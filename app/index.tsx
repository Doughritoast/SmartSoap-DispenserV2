import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useFirebaseAuth } from "@/lib/firebase-auth-context";
import { View } from "react-native";
import { initializeFirebaseDatabase } from "@/lib/firebase-init";

export default function RootIndex() {
  const router = useRouter();
  const { isSignedIn, isLoading } = useFirebaseAuth();

  useEffect(() => {
    // Initialize Firebase database on app load
    initializeFirebaseDatabase().catch((error) => {
      console.error("Failed to initialize Firebase database:", error);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isSignedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }
  }, [isSignedIn, isLoading, router]);

  return <View className="flex-1 bg-background" />;
}
