# SMARTSOAP DISPENSER - Mobile App Design Plan

## Overview

A role-based mobile app for monitoring and managing soap dispenser usage and maintenance across a school building. The app provides real-time dispenser status, shift-based analytics, and maintenance alerts with a deep navy-to-blue theme aligned with iOS Human Interface Guidelines.

---

## Screen List

1. **Login Screen** — Email + password authentication with role detection
2. **Sign Up Screen** — Registration with role-specific fields (Employee ID and Shift for Maintenance users)
3. **Dashboard** — Real-time overview of all dispensers with color-coded status indicators
4. **Map Screen** — Building floor map showing dispenser locations with status pins; filterable by floor
5. **Analytics Screen** — Shift-scoped analytics for Maintenance users; full overview for Admin
6. **History Screen** — Log of all events (refills, alerts, offline notices) with type and date filters
7. **Settings Screen** — Notification toggles, threshold settings (Admin only), user management (Admin only), sign out

---

## Primary Content and Functionality

### Login Screen
- **Content:** Email field, password field, "Sign Up" link
- **Functionality:** Authenticate user, detect role (Admin/Maintenance), navigate to Dashboard
- **Validation:** Email format, password required

### Sign Up Screen
- **Content:** Full name, email, password, password confirmation fields
- **Conditional Fields (Maintenance only):** Employee ID, Shift Assignment dropdown (Morning / Afternoon / Evening)
- **Functionality:** Register new user, store role preference, navigate to Dashboard after signup
- **Validation:** Email uniqueness, password strength, Employee ID format

### Dashboard
- **Content:** 
  - Header with user greeting and current date/time
  - Dispenser cards showing: name, location, soap level %, battery %, status (Red/Yellow/Green)
  - Quick action buttons (refill, maintenance alert)
- **Functionality:**
  - Real-time status updates (color-coded: Red = critical, Yellow = low, Green = OK)
  - Tap dispenser card to view detailed info
  - Pull-to-refresh for manual update
  - Filter by floor/location (Admin only)
- **Maintenance View:** Only shows assigned dispensers

### Map Screen
- **Content:**
  - Building floor map with dispenser location pins
  - Floor selector (Floor 1, Floor 2, etc.)
  - Status legend (Red/Yellow/Green indicators)
- **Functionality:**
  - Tap pin to view dispenser details
  - Filter by floor
  - Show/hide offline devices
- **Maintenance View:** Only shows assigned dispensers

### Analytics Screen
- **Content:**
  - Shift-based graphs and statistics (Maintenance users)
  - Full building overview (Admin users)
  - Metrics: refills per shift, average soap usage, battery health trends
- **Functionality:**
  - Date range selector
  - Export data (optional)
  - Tap chart to drill down into details
- **Maintenance View:** Only their shift data

### History Screen
- **Content:**
  - Chronological log of events: refills, critical alerts, low soap, low battery, offline notices, unusual activity
  - Event type badges (color-coded)
  - Timestamp and dispenser name
- **Functionality:**
  - Filter by event type (dropdown)
  - Filter by date range (calendar picker)
  - Search by dispenser name
  - Pull-to-refresh

### Settings Screen
- **Content:**
  - Notification toggles: critical refill, low soap, low battery, offline device, unusual activity
  - Threshold settings (Admin only): soap level %, battery level %
  - User management (Admin only): list of users, add/remove Maintenance staff
  - Account info: current user role, email
  - Sign out button
- **Functionality:**
  - Toggle notifications on/off
  - Adjust thresholds (Admin only)
  - Manage users (Admin only)
  - Sign out and return to Login screen

---

## Key User Flows

### Admin User Flow
1. **Login** → Enter email/password → Dashboard
2. **Dashboard** → View all dispensers → Tap dispenser → See detailed status, refill history, battery info
3. **Analytics** → View building-wide trends, refill patterns, battery health
4. **Map** → View all dispenser locations, filter by floor
5. **History** → View all events across all dispensers
6. **Settings** → Adjust thresholds, manage Maintenance users, toggle notifications

### Maintenance User Flow
1. **Sign Up** → Enter name, email, password, Employee ID, select shift → Dashboard
2. **Dashboard** → View only assigned dispensers for their shift
3. **Analytics** → View only their shift's refill/usage stats
4. **Map** → View only assigned dispenser locations
5. **History** → View only events for assigned dispensers
6. **Settings** → Toggle personal notifications, view account info, sign out

### Refill Alert Flow
1. Dispenser soap level drops below threshold
2. Push notification sent to assigned Maintenance user
3. User navigates to Dashboard or taps notification
4. User taps dispenser card → sees "Refill Now" button
5. User confirms refill → event logged in History, status updates to Green

---

## Color Choices

### Primary Palette (Deep Navy to Blue Gradient)
- **Primary Blue:** `#0A5BA8` (deep navy, primary actions and active states)
- **Secondary Blue:** `#1B7FD9` (lighter blue, secondary elements)
- **Accent Blue:** `#3B9FFF` (bright blue, highlights and hover states)
- **Background:** `#FFFFFF` (light mode), `#0F1419` (dark mode)
- **Surface:** `#F5F7FA` (light mode), `#1A1F2A` (dark mode)
- **Text Primary:** `#0F1419` (light mode), `#FFFFFF` (dark mode)
- **Text Secondary:** `#6B7280` (light mode), `#D1D5DB` (dark mode)

### Status Colors
- **Critical (Red):** `#DC2626` (soap level critical, battery critical)
- **Warning (Yellow):** `#F59E0B` (soap level low, battery low)
- **OK (Green):** `#10B981` (normal operation)
- **Offline (Gray):** `#9CA3AF` (device offline)

### Interactive States
- **Active Tab:** Primary Blue (`#0A5BA8`)
- **Pressed Button:** Darker shade of primary (`#084A8C`)
- **Disabled:** Gray (`#D1D5DB`)

---

## Navigation Structure

**Bottom Tab Bar (5 tabs):**
1. Dashboard (home icon)
2. Map (map icon)
3. Analytics (chart icon)
4. History (history/clock icon)
5. Settings (gear icon)

---

## Responsive Design Notes

- **Portrait orientation (9:16)** — optimized for one-handed usage
- **Safe area handling** — notch and home indicator awareness
- **Touch targets** — minimum 44pt × 44pt for buttons
- **Text sizing** — readable at arm's length (16pt+ for body text)
- **Card-based layout** — scrollable lists for dispensers and events

---

## Accessibility

- **Color contrast:** All text meets WCAG AA standards (4.5:1 for body text)
- **Labels:** All interactive elements have descriptive labels
- **Haptic feedback:** Subtle haptics on button press (light impact)
- **Status indicators:** Not color-only; include text labels and icons

---

## Push Notification Types

1. **Critical Refill** — Soap level at 10% or below
2. **Low Soap** — Soap level at 25%
3. **Low Battery** — Battery at 15% or below
4. **Offline Device** — Device hasn't reported in 30+ minutes
5. **Unusual Activity** — Unexpected refill pattern or button press frequency
6. **Refill Confirmed** — Maintenance user confirms refill completion

---

## Data Model

### Dispenser
- `id` — unique identifier
- `name` — display name (e.g., "Main Hallway Dispenser")
- `location` — floor and room (e.g., "Floor 1, Room 101")
- `floor` — floor number (1, 2, 3, etc.)
- `soapLevel` — percentage (0-100)
- `batteryLevel` — percentage (0-100)
- `status` — "ok" | "low" | "critical" | "offline"
- `lastRefill` — timestamp
- `usageCount` — total button presses
- `assignedTo` — array of Maintenance user IDs (for shift-based access)

### User
- `id` — unique identifier
- `name` — full name
- `email` — email address
- `role` — "admin" | "maintenance"
- `employeeId` — (Maintenance only) employee ID
- `shift` — (Maintenance only) "morning" | "afternoon" | "evening"
- `assignedDispensers` — (Maintenance only) array of dispenser IDs

### Event
- `id` — unique identifier
- `type` — "refill" | "critical_alert" | "low_soap" | "low_battery" | "offline" | "unusual_activity" | "refill_confirmed"
- `dispenserId` — dispenser ID
- `timestamp` — event time
- `details` — additional info (e.g., previous soap level, new soap level)

---

## Theme Implementation

- **Primary color token:** `primary` → `#0A5BA8`
- **Secondary color token:** `secondary` → `#1B7FD9`
- **Status colors:** `success`, `warning`, `error` (mapped to Green, Yellow, Red)
- **Tailwind config:** Update `theme.config.js` with blue gradient palette
- **Dark mode:** Automatic via ThemeProvider; no manual `dark:` prefix needed

---

## Next Steps

1. ✅ Create design.md (this file)
2. Create todo.md with feature checklist
3. Update theme.config.js with blue gradient colors
4. Build authentication screens (Login, Sign Up)
5. Build Dashboard with real-time dispenser cards
6. Build Map screen with floor filtering
7. Build Analytics and History screens
8. Build Settings screen with role-based controls
9. Integrate navigation and polish UI
10. Test end-to-end flows and deliver
