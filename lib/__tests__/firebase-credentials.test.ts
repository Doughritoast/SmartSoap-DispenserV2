import { describe, it, expect, beforeAll } from "vitest";
import "../../scripts/load-env.js";

describe("Firebase Credentials Validation", () => {
  beforeAll(() => {
    // Ensure environment variables are loaded
    if (!process.env.EXPO_PUBLIC_FIREBASE_API_KEY) {
      console.warn("Firebase credentials not loaded. Make sure .env file exists.");
    }
  });
  it("should have all required Firebase environment variables", () => {
    expect(process.env.EXPO_PUBLIC_FIREBASE_API_KEY).toBeDefined();
    expect(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN).toBeDefined();
    expect(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID).toBeDefined();
    expect(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET).toBeDefined();
    expect(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID).toBeDefined();
    expect(process.env.EXPO_PUBLIC_FIREBASE_APP_ID).toBeDefined();
  });

  it("should have valid Firebase project ID format", () => {
    const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
    expect(projectId).toBeDefined();
    expect(projectId).toMatch(/^[a-z0-9-]+$/);
  });

  it("should have valid Firebase auth domain format", () => {
    const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
    expect(authDomain).toBeDefined();
    expect(authDomain).toMatch(/^[a-z0-9-]+\.firebaseapp\.com$/);
  });

  it("should have valid Firebase storage bucket format", () => {
    const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
    expect(storageBucket).toMatch(/^[a-z0-9-.]+(\.(appspot\.com|firebasestorage\.app))$/);
  });

  it("should have valid Firebase API key format", () => {
    const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey?.length).toBeGreaterThan(0);
  });

  it("should have valid Firebase messaging sender ID format", () => {
    const senderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
    expect(senderId).toBeDefined();
    expect(senderId).toMatch(/^\d+$/);
  });
});
