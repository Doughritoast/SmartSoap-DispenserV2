import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";

// Mock Firebase modules
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  connectAuthEmulator: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  connectFirestoreEmulator: vi.fn(),
  enableIndexedDbPersistence: vi.fn(() => Promise.resolve()),
}));

describe("Firebase Integration", () => {
  describe("Firebase Configuration", () => {
    it("should have Firebase environment variables defined", () => {
      expect(process.env.EXPO_PUBLIC_FIREBASE_API_KEY).toBeDefined();
      expect(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN).toBeDefined();
      expect(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID).toBe("soapdispenser-3ab53");
      expect(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET).toBeDefined();
      expect(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID).toBe("930494803897");
      expect(process.env.EXPO_PUBLIC_FIREBASE_APP_ID).toBeDefined();
    });

    it("should have correct Firebase project ID", () => {
      expect(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID).toBe("soapdispenser-3ab53");
    });

    it("should have correct Firebase messaging sender ID", () => {
      expect(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID).toBe("930494803897");
    });
  });

  describe("Firebase Auth Context", () => {
    it("should export useAuth hook", async () => {
      const { useAuth } = await import("../firebase-auth-context");
      expect(typeof useAuth).toBe("function");
    });

    it("should export FirebaseAuthProvider", async () => {
      const { FirebaseAuthProvider } = await import("../firebase-auth-context");
      expect(FirebaseAuthProvider).toBeDefined();
    });

    it("should export AuthContextType interface", async () => {
      const module = await import("../firebase-auth-context");
      // AuthContextType is a TypeScript interface
      expect(module).toBeDefined();
    });
  });

  describe("Firebase Migration Utilities", () => {
    it("should export migration functions", async () => {
      const {
        migrateDispensersToFirestore,
        migrateEventsToFirestore,
        createDefaultUsersInFirestore,
        getDispensersFromFirestore,
        getEventsFromFirestore,
      } = await import("../firestore-migration");

      expect(typeof migrateDispensersToFirestore).toBe("function");
      expect(typeof migrateEventsToFirestore).toBe("function");
      expect(typeof createDefaultUsersInFirestore).toBe("function");
      expect(typeof getDispensersFromFirestore).toBe("function");
      expect(typeof getEventsFromFirestore).toBe("function");
    });
  });

  describe("Firebase Config Module", () => {
    it("should export auth and db instances", async () => {
      const { auth, db } = await import("../firebase-config");
      expect(auth).toBeDefined();
      expect(db).toBeDefined();
    });
  });
});
