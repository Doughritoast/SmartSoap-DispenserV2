# Firebase Setup Instructions for SMARTSOAP DISPENSER

Your Firebase project credentials are already configured in the app. Now you need to set up Firestore database and security rules.

## Quick Setup (5 minutes)

### Step 1: Create Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **soapdispenser-a435a**
3. Click **Build** → **Firestore Database**
4. Click **Create Database**
5. Choose **Start in production mode**
6. Select region: **us-central1**
7. Click **Create**

### Step 2: Set Security Rules
1. In Firestore, go to the **Rules** tab
2. Replace all content with this:

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

3. Click **Publish**

### Step 3: Test the App
1. Open the app in your browser or Expo Go
2. The app will automatically create test users and data
3. Sign in with:
   - **Admin:** admin@school.com / admin123
   - **Maintenance:** maintenance@school.com / maint123

## What Happens Automatically

When you first open the app, it will:
- ✅ Create test users (admin and maintenance)
- ✅ Create 6 test dispensers across 3 floors
- ✅ Create sample events for monitoring
- ✅ Set up real-time listeners for live updates

## Database Collections

### users
- Stores user profiles with roles (admin/maintenance)
- Each user can only read/write their own document

### dispensers
- Stores soap dispenser data (soap level, battery, location)
- All authenticated users can read
- Only admins can write

### events
- Stores monitoring events (refills, low soap, offline alerts)
- All authenticated users can read/write

## Features Ready to Use

✅ **Sign In/Sign Up** - Real Firebase Authentication
✅ **Real-time Monitoring** - Live dispenser status updates
✅ **Role-based Access** - Admin vs Maintenance permissions
✅ **Alert Thresholds** - Editable by admin users
✅ **Building Floor Map** - 3-floor layout with dispensers
✅ **Analytics** - Shift-based usage statistics
✅ **History** - Event logging and filtering

## Troubleshooting

### "Client is offline" Error
- Check that Firestore database is created
- Verify internet connection
- Restart the app

### "Permission denied" Error
- Ensure security rules are published
- Check that you're signed in
- Verify user role has required permissions

### Collections Not Appearing
- Open the app to trigger automatic initialization
- Check browser console for initialization logs
- Manually create collections if needed

## Need Help?

Check the console logs in the app - they show:
- ✅ Firebase initialization status
- ✅ User creation success/failure
- ✅ Data migration progress
- ✅ Real-time listener status

All logs start with emoji indicators:
- 🔄 = In progress
- ✅ = Success
- ❌ = Error
- 📝 = Creating data
