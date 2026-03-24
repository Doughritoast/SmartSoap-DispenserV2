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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - in production, call your backend API
      const mockUsers: Record<string, { password: string; user: User }> = {
        "admin@school.com": {
          password: "admin123",
          user: {
            id: "admin-1",
            name: "Admin User",
            email: "admin@school.com",
            role: "admin",
          },
        },
        "maintenance@school.com": {
          password: "maint123",
          user: {
            id: "maint-1",
            name: "John Maintenance",
            email: "maintenance@school.com",
            role: "maintenance",
            employeeId: "EMP001",
            shift: "morning",
            assignedDispensers: ["disp-1", "disp-2"],
          },
        },
      };

      const userRecord = mockUsers[email];
      if (!userRecord || userRecord.password !== password) {
        throw new Error("Invalid email or password");
      }

      setUser(userRecord.user);
      await AsyncStorage.setItem("user", JSON.stringify(userRecord.user));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Omit<User, "id">, password: string) => {
    setIsLoading(true);
    try {
      // Mock signup - in production, call your backend API
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
      };

      setUser(newUser);
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      await AsyncStorage.removeItem("user");
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
