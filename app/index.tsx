import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/firebase-auth-context";
import {
  createDefaultUsersInFirestore,
  migrateDispensersToFirestore,
  migrateEventsToFirestore,
} from "@/lib/firestore-migration";
import { useRouter } from "expo-router";

export default function InitializationScreen() {
  const { isSignedIn, isLoading: authLoading } = useAuth();
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if migration has already been done
        const migrationDone = await AsyncStorage.getItem("firebase_migration_done");
        
        if (!migrationDone) {
          console.log("Starting Firebase data migration...");
          
          // Step 1: Create default users
          await createDefaultUsersInFirestore();
          console.log("✓ Default users created");
          
          // Step 2: Migrate dispensers
          await migrateDispensersToFirestore();
          console.log("✓ Dispensers migrated");
          
          // Step 3: Migrate events
          await migrateEventsToFirestore();
          console.log("✓ Events migrated");
          
          // Mark migration as complete
          await AsyncStorage.setItem("firebase_migration_done", "true");
          console.log("✓ Firebase migration complete!");
        }
        
        setMigrationComplete(true);
      } catch (error: any) {
        console.error("Migration error:", error);
        setMigrationError(error.message);
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
        <Text className="mt-4 text-foreground">
          {migrationError ? "Migration Error" : "Initializing..."}
        </Text>
        {migrationError && (
          <Text className="mt-2 text-error text-center px-4">{migrationError}</Text>
        )}
      </View>
    );
  }

  // Redirect to appropriate screen
  if (isSignedIn) {
    router.replace("/(tabs)");
  } else {
    router.replace("/login");
  }

  return null;
}
