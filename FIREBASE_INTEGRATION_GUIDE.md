# Firebase Integration Guide - SMARTSOAP DISPENSER

## Overview

Your SMARTSOAP DISPENSER app is now integrated with Firebase for cloud-based authentication and real-time data management. This guide explains how to use Firebase features in your app.

---

## Firebase Setup Status

✅ **Completed:**
- Firebase SDK installed (firebase 12.12.0)
- Firebase configuration file created (`lib/firebase-config.ts`)
- Environment variables configured
- Firebase Authentication provider set up
- Firestore data migration utilities created
- Root layout updated to use Firebase auth

---

## Environment Variables

The following Firebase credentials are now configured as environment variables:

| Variable | Value | Purpose |
|----------|-------|---------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Configured | Web SDK authentication |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `soapdispenser-3ab53.firebaseapp.com` | Authentication domain |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `soapdispenser-3ab53` | Project identifier |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | `soapdispenser-3ab53.appspot.com` | Cloud storage |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `930494803897` | Push notifications |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Configured | App identifier |

---

## Firebase Authentication

### How It Works

1. **User Signs Up** → Firebase creates auth account → User profile saved to Firestore
2. **User Logs In** → Firebase validates credentials → User profile loaded from Firestore
3. **User Logs Out** → Firebase signs out → Local cache cleared
4. **Session Persistence** → Firebase automatically restores session on app restart

### Using Firebase Auth in Components

```typescript
import { useAuth } from "@/lib/firebase-auth-context";

export function MyComponent() {
  const { user, isSignedIn, login, logout } = useAuth();

  return (
    <View>
      {isSignedIn ? (
        <>
          <Text>Welcome, {user?.name}!</Text>
          <Pressable onPress={logout}>
            <Text>Sign Out</Text>
          </Pressable>
        </>
      ) : (
        <Text>Please sign in</Text>
      )}
    </View>
  );
}
```

### Auth Context Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `login(email, password)` | Sign in with email/password | `await login("user@school.com", "password123")` |
| `signup(userData, password)` | Create new user account | `await signup({ name, email, role, ... }, password)` |
| `logout()` | Sign out current user | `await logout()` |
| `updateUser(user)` | Update user profile | `await updateUser({ ...user, name: "New Name" })` |
| `deleteUser(email)` | Delete user account | `await deleteUser("user@school.com")` |

---

## Firestore Database Structure

### Collections

#### `users` Collection
Stores user profiles with authentication data.

```typescript
{
  id: "user-123",                    // Firebase UID
  name: "John Maintenance",
  email: "john@school.com",
  role: "maintenance",               // "admin" or "maintenance"
  employeeId: "EMP001",
  shift: "morning",                  // "morning", "afternoon", "evening"
  assignedDispensers: ["disp-1", "disp-2"],
  createdAt: Timestamp
}
```

#### `dispensers` Collection
Stores soap dispenser information and real-time status.

```typescript
{
  id: "disp-1",
  name: "Main Hallway",
  location: "Floor 1 - Hallway A",
  floor: 1,
  soapLevel: 75,                     // Percentage 0-100
  batteryLevel: 90,                  // Percentage 0-100
  status: "ok",                      // "ok", "low", "critical", "offline"
  usageCount: 245,
  lastRefill: Timestamp,
  assignedTo: ["maint-1"],           // User IDs
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `events` Collection
Stores event history (refills, alerts, maintenance logs).

```typescript
{
  id: "event-1",
  dispenserId: "disp-1",
  type: "refill",                    // "refill", "alert", "offline", "unusual"
  message: "Soap refilled",
  timestamp: Timestamp,
  userId: "maint-1",                 // Who performed the action
  metadata: {
    soapLevel: 100,
    batteryLevel: 95
  }
}
```

---

## Data Migration

### Migrate Mock Data to Firestore

To migrate your mock data to Firestore, call these functions in your app initialization:

```typescript
import {
  migrateDispensersToFirestore,
  migrateEventsToFirestore,
  createDefaultUsersInFirestore,
} from "@/lib/firestore-migration";

// Call during app startup (e.g., in useEffect)
useEffect(() => {
  const migrate = async () => {
    try {
      await createDefaultUsersInFirestore();
      await migrateDispensersToFirestore();
      await migrateEventsToFirestore();
      console.log("Migration complete!");
    } catch (error) {
      console.error("Migration failed:", error);
    }
  };
  
  migrate();
}, []);
```

### Available Migration Functions

| Function | Purpose |
|----------|---------|
| `createDefaultUsersInFirestore()` | Create default admin and maintenance users |
| `migrateDispensersToFirestore()` | Migrate all dispensers to Firestore |
| `migrateEventsToFirestore()` | Migrate all events to Firestore |
| `getDispensersFromFirestore()` | Fetch all dispensers from Firestore |
| `getEventsFromFirestore()` | Fetch all events from Firestore |
| `getAssignedDispensersFromFirestore(userId)` | Get dispensers assigned to a user |
| `getDispenserEventsFromFirestore(dispenserId)` | Get events for a specific dispenser |

---

## Real-time Data Updates

### Set Up Real-time Listeners

To receive real-time updates from Firestore:

```typescript
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase-config";

useEffect(() => {
  const dispensersRef = collection(db, "dispensers");
  
  // Listen to all dispensers
  const unsubscribe = onSnapshot(dispensersRef, (snapshot) => {
    const dispensers = snapshot.docs.map(doc => doc.data());
    setDispensers(dispensers);
  });

  return () => unsubscribe();
}, []);
```

### Filter Real-time Data

```typescript
import { query, where } from "firebase/firestore";

// Get dispensers on Floor 1
const q = query(
  collection(db, "dispensers"),
  where("floor", "==", 1)
);

onSnapshot(q, (snapshot) => {
  const floorDispensers = snapshot.docs.map(doc => doc.data());
  setDispensers(floorDispensers);
});
```

---

## Firestore Security Rules

### Recommended Rules (Set in Firebase Console)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.uid != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Dispensers - admins can write, all authenticated users can read
    match /dispensers/{document=**} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Events - all authenticated users can read, admins can write
    match /events/{document=**} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## Testing Firebase Integration

### Run Tests

```bash
cd /home/ubuntu/smartsoap-dispenser
pnpm test
```

All Firebase integration tests should pass:
- ✅ Firebase configuration validation
- ✅ Auth context exports
- ✅ Migration utilities
- ✅ Firebase config module

---

## Troubleshooting

### Issue: "Firebase app not initialized"
**Solution:** Ensure `FirebaseAuthProvider` wraps your app in `app/_layout.tsx`

### Issue: "Permission denied" errors
**Solution:** Check Firestore security rules in Firebase Console

### Issue: "Auth state not persisting"
**Solution:** Ensure `onAuthStateChanged` listener is set up in `firebase-auth-context.tsx`

### Issue: "Firestore offline persistence not working"
**Solution:** `enableIndexedDbPersistence` is automatically called in `firebase-config.ts`

---

## Next Steps

1. **Set Firestore Security Rules** → Go to Firebase Console → Firestore → Rules
2. **Enable Authentication Methods** → Firebase Console → Authentication → Sign-in methods
3. **Test Sign Up/Login** → Use your app's auth screens
4. **Migrate Data** → Call migration functions to populate Firestore
5. **Set Up Real-time Listeners** → Update Dashboard, Map, Analytics to use live Firestore data
6. **Enable Push Notifications** → Integrate `expo-notifications` with Firebase Cloud Messaging

---

## Firebase Console Links

- **Firebase Console:** https://console.firebase.google.com/
- **Your Project:** https://console.firebase.google.com/project/soapdispenser-3ab53
- **Authentication:** https://console.firebase.google.com/project/soapdispenser-3ab53/authentication
- **Firestore:** https://console.firebase.google.com/project/soapdispenser-3ab53/firestore
- **Project Settings:** https://console.firebase.google.com/project/soapdispenser-3ab53/settings/general

---

## Support

For Firebase documentation, visit: https://firebase.google.com/docs
For React Native Firebase, visit: https://rnfirebase.io/

---

**Last Updated:** April 20, 2026
**Firebase SDK Version:** 12.12.0
**Project:** SMARTSOAP DISPENSER
