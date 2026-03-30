import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "admin" | "maintenance";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  shift?: "morning" | "afternoon" | "evening";
  assignedDispensers?: string[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, "id">, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const USERS_STORAGE_KEY = "registered_users";
const CURRENT_USER_KEY = "current_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (e) {
        console.error("Failed to restore user session", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Initialize default users if they don't exist
  const initializeDefaultUsers = async () => {
    try {
      const existingUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (!existingUsers) {
        const defaultUsers = {
          "admin@school.com": {
            password: "admin123",
            user: {
              id: "admin-1",
              name: "Admin User",
              email: "admin@school.com",
              role: "admin" as UserRole,
            },
          },
          "maintenance@school.com": {
            password: "maint123",
            user: {
              id: "maint-1",
              name: "John Maintenance",
              email: "maintenance@school.com",
              role: "maintenance" as UserRole,
              employeeId: "EMP001",
              shift: "morning" as const,
              assignedDispensers: ["disp-1", "disp-2"],
            },
          },
        };
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
      }
    } catch (e) {
      console.error("Failed to initialize default users", e);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await initializeDefaultUsers();
      
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};

      const userRecord = users[email];
      if (!userRecord || userRecord.password !== password) {
        throw new Error("Invalid email or password");
      }

      setUser(userRecord.user);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userRecord.user));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Omit<User, "id">, password: string) => {
    setIsLoading(true);
    try {
      await initializeDefaultUsers();

      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};

      // Check if user already exists
      if (users[userData.email]) {
        throw new Error("Email already registered");
      }

      // Create new user
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
      };

      // Add to users database
      users[userData.email] = {
        password,
        user: newUser,
      };

      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      setUser(newUser);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedUser: User) => {
    setIsLoading(true);
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};

      // Find and update the user
      if (users[updatedUser.email]) {
        users[updatedUser.email].user = updatedUser;
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        setUser(updatedUser);
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (email: string) => {
    setIsLoading(true);
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};

      delete users[email];
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    login,
    signup,
    logout,
    updateUser,
    deleteUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
