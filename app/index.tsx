import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useFirebaseAuth } from "@/lib/firebase-auth-context";
import { View } from "react-native";

export default function RootIndex() {
  const router = useRouter();
  const { isSignedIn, isLoading } = useFirebaseAuth();

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
