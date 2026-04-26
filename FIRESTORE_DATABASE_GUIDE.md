# How to Create a Firestore Database for User Login

This guide teaches you how to set up a Firestore database to store user login information.

## What is Firestore?

Firestore is a **cloud database** that stores data in **collections** (like tables in Excel) with **documents** (like rows). It's perfect for real-time apps because it automatically syncs data across all devices.

## Step-by-Step Setup

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Click on your project: **soapdispenser-a435a**
3. You should see the Firebase dashboard

### Step 2: Create Firestore Database

1. In the left sidebar, click **Build** (or **Develop**)
2. Look for **Firestore Database** and click it
3. Click the blue **Create Database** button
4. A popup will appear with two options:
   - **Start in production mode** ← Choose this
   - Start in test mode
5. Click **Start in production mode**
6. Select your region (closest to you, e.g., **us-central1**)
7. Click **Create**

**Wait 1-2 minutes** for the database to be created.

### Step 3: Create a "users" Collection

After the database is created, you'll see an empty Firestore page.

1. Click the blue **Start collection** button
2. Enter collection name: **users**
3. Click **Next**
4. Click **Auto ID** (Firebase will create a unique ID)
5. Add your first user document with these fields:

| Field Name | Type | Value |
|-----------|------|-------|
| email | string | admin@school.com |
| password | string | admin123 |
| role | string | admin |
| fullName | string | Admin User |
| createdAt | timestamp | (current date/time) |

6. Click **Save**

### Step 4: Add More Users

1. Click the **Add document** button (+ icon)
2. Click **Auto ID**
3. Add the maintenance user:

| Field Name | Type | Value |
|-----------|------|-------|
| email | string | maintenance@school.com |
| password | string | maint123 |
| role | string | maintenance |
| fullName | string | John Maintenance |
| employeeId | string | EMP001 |
| shiftAssignment | string | Morning |
| createdAt | timestamp | (current date/time) |

4. Click **Save**

## Your Firestore Structure

After setup, your database will look like this:

```
Firestore Database
└── users (collection)
    ├── doc1 (admin user)
    │   ├── email: "admin@school.com"
    │   ├── password: "admin123"
    │   ├── role: "admin"
    │   ├── fullName: "Admin User"
    │   └── createdAt: 2026-04-25
    │
    └── doc2 (maintenance user)
        ├── email: "maintenance@school.com"
        ├── password: "maint123"
        ├── role: "maintenance"
        ├── fullName: "John Maintenance"
        ├── employeeId: "EMP001"
        ├── shiftAssignment: "Morning"
        └── createdAt: 2026-04-25
```

## Step 5: Set Security Rules

Security rules control who can read/write data. Without proper rules, anyone can access your data!

1. In Firestore, click the **Rules** tab (next to Data)
2. Delete all the existing text
3. Copy and paste this code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow authenticated users to access their own user document
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

4. Click the blue **Publish** button
5. A popup will ask "Are you sure?" - click **Publish**

## Step 6: Test Your Database

Now your app can:
1. ✅ Sign in with: admin@school.com / admin123
2. ✅ Sign in with: maintenance@school.com / maint123
3. ✅ Create new users
4. ✅ Store user data securely

## Understanding the Fields

| Field | Purpose | Example |
|-------|---------|---------|
| **email** | User's login email | admin@school.com |
| **password** | User's login password | admin123 |
| **role** | User's permission level | admin or maintenance |
| **fullName** | User's display name | Admin User |
| **createdAt** | When user was created | 2026-04-25 |
| **employeeId** | (Optional) Employee ID | EMP001 |
| **shiftAssignment** | (Optional) Work shift | Morning, Afternoon, Evening |

## How the App Uses This Data

When you sign in:
1. App sends email + password to Firebase
2. Firebase checks the **users** collection
3. If email & password match, user is logged in
4. App reads the user's **role** to show admin or maintenance features

## Common Mistakes to Avoid

❌ **Don't:** Leave security rules in test mode (anyone can access)
✅ **Do:** Publish production security rules

❌ **Don't:** Store passwords as plain text (not secure)
✅ **Do:** Use Firebase Authentication (built-in security)

❌ **Don't:** Use spaces in collection names
✅ **Do:** Use lowercase names like "users", "dispensers", "events"

## Next Steps

1. ✅ Create Firestore database
2. ✅ Create "users" collection
3. ✅ Add test users
4. ✅ Publish security rules
5. ✅ Open the app and sign in!

## Troubleshooting

### "Permission denied" when signing in
- Check security rules are published
- Make sure user email exists in Firestore
- Verify password matches exactly

### Can't see the database
- Refresh the Firebase Console page
- Check you selected the correct project
- Wait a few seconds for the database to fully load

### Need to add more users?
- Click **Add document** in the users collection
- Fill in email, password, role, fullName
- Click **Save**

## Security Best Practices

🔒 **Always use HTTPS** - Firebase automatically uses secure connections
🔒 **Never share passwords** - Users should set their own passwords
🔒 **Use strong passwords** - At least 6 characters
🔒 **Enable 2FA** - For admin accounts, enable two-factor authentication in Firebase

## What's Next?

After setting up the users collection, you can add more collections:
- **dispensers** - Store soap dispenser data
- **events** - Store monitoring events
- **alerts** - Store alert thresholds

Each collection follows the same pattern:
1. Click **Add collection**
2. Name it
3. Add documents with fields
4. Update security rules if needed
