# Firestore Quick Start Checklist

Complete these steps to set up your Firestore database for user login.

## ☐ Step 1: Create Firestore Database (2 minutes)

- [ ] Go to https://console.firebase.google.com/
- [ ] Select project: **soapdispenser-a435a**
- [ ] Click **Build** → **Firestore Database**
- [ ] Click **Create Database**
- [ ] Choose **Start in production mode**
- [ ] Select region: **us-central1**
- [ ] Click **Create**
- [ ] Wait for database to be created (1-2 minutes)

## ☐ Step 2: Create "users" Collection (3 minutes)

- [ ] Click **Start collection** button
- [ ] Collection name: **users**
- [ ] Click **Next**
- [ ] Click **Auto ID**
- [ ] Add first user with these fields:

```
email: admin@school.com
password: admin123
role: admin
fullName: Admin User
createdAt: (click timestamp, set to today)
```

- [ ] Click **Save**

## ☐ Step 3: Add Second User (1 minute)

- [ ] Click **Add document** button
- [ ] Click **Auto ID**
- [ ] Add second user:

```
email: maintenance@school.com
password: maint123
role: maintenance
fullName: John Maintenance
employeeId: EMP001
shiftAssignment: Morning
createdAt: (click timestamp, set to today)
```

- [ ] Click **Save**

## ☐ Step 4: Set Security Rules (2 minutes)

- [ ] Click **Rules** tab
- [ ] Delete all existing text
- [ ] Copy and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

- [ ] Click **Publish**
- [ ] Click **Publish** again in the popup

## ☐ Step 5: Test Sign In (2 minutes)

- [ ] Open your app
- [ ] Click **Sign In**
- [ ] Enter: **admin@school.com** / **admin123**
- [ ] Click **Sign In**
- [ ] You should see the Dashboard ✅

## ✅ Done!

Your Firestore database is now set up and ready for user login!

### Test Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@school.com | admin123 | Admin |
| maintenance@school.com | maint123 | Maintenance |

### What You Just Created

```
📦 Firestore Database
└── 📁 users (collection)
    ├── 👤 Admin User
    │   └── email: admin@school.com
    │       password: admin123
    │       role: admin
    │
    └── 👤 Maintenance User
        └── email: maintenance@school.com
            password: maint123
            role: maintenance
```

## Troubleshooting

### "Permission denied" error
→ Check that security rules are published (green checkmark)

### Can't sign in
→ Check email and password match exactly in Firestore

### Database not showing
→ Refresh the page and wait 30 seconds

### Need to add more users?
→ Click **Add document** in the users collection and fill in the fields

## Next: Add More Collections (Optional)

After users work, you can add:

1. **dispensers** - Soap dispenser data
2. **events** - Monitoring events
3. **alerts** - Alert thresholds

Follow the same pattern:
1. Click **Add collection**
2. Name it
3. Add documents with fields
4. Update security rules if needed

---

**Questions?** Check `FIRESTORE_DATABASE_GUIDE.md` for detailed explanations.
