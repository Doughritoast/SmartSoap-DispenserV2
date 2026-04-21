import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/firebase-auth-context";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createDefaultUsersInFirestore,
  migrateDispensersToFirestore,
  migrateEventsToFirestore,
} from "@/lib/firestore-migration";

export default function RootIndex() {
  const router = useRouter();
  const { isSignedIn, isLoading: authLoading } = useAuth();
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if migration has already been done
        const migrationDone = await AsyncStorage.getItem("firebase_migration_done");

        if (!migrationDone) {
          console.log("🚀 Starting Firebase data migration...");

          // Step 1: Create default users
          console.log("📝 Creating default users...");
          await createDefaultUsersInFirestore();
          console.log("✅ Default users created");

          // Step 2: Migrate dispensers
          console.log("📦 Migrating dispensers...");
          await migrateDispensersToFirestore();
          console.log("✅ Dispensers migrated");

          // Step 3: Migrate events
          console.log("📋 Migrating events...");
          await migrateEventsToFirestore();
          console.log("✅ Events migrated");

          // Mark migration as complete
          await AsyncStorage.setItem("firebase_migration_done", "true");
          console.log("🎉 Firebase migration complete!");
        } else {
          console.log("✅ Firebase migration already completed");
        }

        setMigrationComplete(true);
      } catch (error: any) {
        console.error("❌ Migration error:", error);
        setMigrationError(error.message || "Migration failed");
      }
    };

    if (!authLoading) {
      initializeApp();
    }
  }, [authLoading]);

  // Show loading screen during migration
  if (!migrationComplete || authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0A5BA8" />
        <Text className="mt-4 text-foreground text-center">
          {migrationError ? "Migration Error" : "Initializing..."}
        </Text>
        {migrationError && (
          <Text className="mt-2 text-error text-center px-4 text-sm">
            {migrationError}
          </Text>
        )}
      </View>
    );
  }

  // Redirect to appropriate screen after migration
  useEffect(() => {
    if (migrationComplete && !authLoading) {
      if (isSignedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }
  }, [isSignedIn, authLoading, migrationComplete, router]);

  return <View className="flex-1 bg-background" />;
}
