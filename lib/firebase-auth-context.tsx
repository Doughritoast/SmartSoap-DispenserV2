import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase-config";
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
  createdAt?: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, "id" | "createdAt">, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch user profile from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            // Cache user locally
            await AsyncStorage.setItem("current_user", JSON.stringify(userData));
          }
        } else {
          setUser(null);
          await AsyncStorage.removeItem("current_user");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch user profile from Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setUser(userData);
        await AsyncStorage.setItem("current_user", JSON.stringify(userData));
      }
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Omit<User, "id" | "createdAt">, password: string) => {
    setIsLoading(true);
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
      const firebaseUser = userCredential.user;

      // Create user profile in Firestore
      const newUser: User = {
        ...userData,
        id: firebaseUser.uid,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), newUser as any);
      setUser(newUser);
      await AsyncStorage.setItem("current_user", JSON.stringify(newUser));
    } catch (error: any) {
      throw new Error(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      await AsyncStorage.removeItem("current_user");
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedUser: User) => {
    setIsLoading(true);
    try {
      const userDocRef = doc(db, "users", updatedUser.id);
      await updateDoc(userDocRef, updatedUser as any);
      setUser(updatedUser);
      await AsyncStorage.setItem("current_user", JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (email: string) => {
    setIsLoading(true);
    try {
      // Query user by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await deleteDoc(userDoc.ref);
      }
    } catch (error: any) {
      throw new Error(error.message || "Delete failed");
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
    throw new Error("useAuth must be used within a FirebaseAuthProvider");
  }
  return context;
}
