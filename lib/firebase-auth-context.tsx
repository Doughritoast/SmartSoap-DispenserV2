import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db, retryFirebaseOperation } from "./firebase-config";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

export type UserRole = "admin" | "maintenance";

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  employeeId?: string;
  shiftAssignment?: "Morning" | "Afternoon" | "Evening";
  createdAt: Date;
}

interface AuthContextType {
  user: UserData | null;
  isSignedIn: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, userData: Partial<UserData>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch user data from Firestore with retry logic
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await retryFirebaseOperation(
            () => getDoc(userDocRef),
            3,
            500
          );

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as UserData;
            setUser(userData);
          } else {
            // User exists in Auth but not in Firestore - create minimal user object
            console.warn("User not found in Firestore, creating minimal user object");
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              role: "maintenance",
              fullName: firebaseUser.displayName || "User",
              createdAt: new Date(),
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        // Don't block the app on error - user can still proceed
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, userData: Partial<UserData>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Save user data to Firestore with retry logic
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await retryFirebaseOperation(
        () =>
          setDoc(userDocRef, {
            uid: firebaseUser.uid,
            email,
            role: userData.role || "maintenance",
            fullName: userData.fullName || "",
            employeeId: userData.employeeId || "",
            shiftAssignment: userData.shiftAssignment || "Morning",
            createdAt: new Date(),
          }),
        3,
        500
      );

      setUser({
        uid: firebaseUser.uid,
        email,
        role: (userData.role || "maintenance") as UserRole,
        fullName: userData.fullName || "",
        employeeId: userData.employeeId,
        shiftAssignment: userData.shiftAssignment as "Morning" | "Afternoon" | "Evening" | undefined,
        createdAt: new Date(),
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw new Error(error.message || "Sign up failed");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch user data from Firestore with retry logic
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await retryFirebaseOperation(
        () => getDoc(userDocRef),
        3,
        500
      );

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as UserData;
        setUser(userData);
      } else {
        // Create minimal user object if not in Firestore
        console.warn("User not found in Firestore after sign in");
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          role: "maintenance",
          fullName: firebaseUser.displayName || "User",
          createdAt: new Date(),
        });
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw new Error(error.message || "Sign in failed");
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error("Sign out error:", error);
      throw new Error(error.message || "Sign out failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        isLoading,
        signUp,
        signIn,
        signOutUser,
        signOut: signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider");
  }
  return context;
}
