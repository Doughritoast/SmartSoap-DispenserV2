# Firebase Firestore Setup Guide

This guide walks you through setting up Firestore database for the SMARTSOAP DISPENSER app.

## Step 1: Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **soapdispenser-a435a**
3. In the left sidebar, click **Build** → **Firestore Database**
4. Click **Create Database**
5. Choose **Start in production mode**
6. Select region: **us-central1** (or closest to you)
7. Click **Create**

## Step 2: Set Firestore Security Rules

After creating the database, go to the **Rules** tab and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow authenticated users to read all dispensers
    match /dispensers/{dispenserId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    // Allow authenticated users to read/write events
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

Click **Publish** to save the rules.

## Step 3: Initialize Collections (Automatic)

When you first launch the app, it will automatically:
1. Create test users (admin@school.com, maintenance@school.com)
2. Create 6 test dispensers across 3 floors
3. Create test events for monitoring

**Test Credentials:**
- **Admin:** admin@school.com / admin123
- **Maintenance:** maintenance@school.com / maint123

## Step 4: Verify Collections

In Firebase Console, check that these collections exist:
- `users` - Contains user profiles with roles
- `dispensers` - Contains dispenser data with status
- `events` - Contains monitoring events

## Database Schema

### Users Collection
```
users/{userId}
├── uid: string
├── email: string
├── role: "admin" | "maintenance"
├── fullName: string
├── employeeId: string (optional)
├── shiftAssignment: "Morning" | "Afternoon" | "Evening"
└── createdAt: timestamp
```

### Dispensers Collection
```
dispensers/{dispenserId}
├── id: string
├── name: string
├── floor: number (1, 2, or 3)
├── location: string
├── soapLevel: number (0-100)
├── batteryLevel: number (0-100)
├── usageCount: number
├── lastRefill: timestamp
├── status: "ok" | "low" | "critical" | "offline"
└── assignedTo: array (user IDs)
```

### Events Collection
```
events/{eventId}
├── id: string
├── dispenserId: string
├── type: "refill" | "low_soap" | "critical" | "offline"
├── timestamp: timestamp
├── description: string
└── [additional fields based on type]
```

## Troubleshooting

### "Client is offline" Error
- Ensure Firebase credentials are correctly set in environment variables
- Check internet connection
- Restart the app

### "Permission denied" Error
- Verify Firestore security rules are correctly published
- Check that user is authenticated
- Ensure user role matches the required permissions

### Collections Not Created
- Check browser console for errors during app initialization
- Manually create collections in Firebase Console if needed
- Run the app again to trigger initialization

## Real-time Listeners

The app uses Firestore real-time listeners for:
- **Dashboard:** Live dispenser status updates
- **Map:** Real-time location and status visualization
- **Analytics:** Live usage statistics
- **History:** Event log updates

All listeners are automatically set up when screens load.
