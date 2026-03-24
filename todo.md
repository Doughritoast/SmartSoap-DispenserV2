# SMARTSOAP DISPENSER - Project TODO

## Authentication & Setup
- [x] Login screen with email/password validation
- [x] Sign Up screen with role selection (Admin/Maintenance)
- [x] Maintenance-specific fields (Employee ID, Shift Assignment)
- [x] Auth state persistence with AsyncStorage
- [x] Role-based navigation routing

## Dashboard Screen
- [x] Display real-time dispenser cards with status (Red/Yellow/Green)
- [x] Show soap level %, battery %, usage count
- [x] Implement color-coded status indicators
- [x] Add dispenser detail modal/sheet
- [x] Pull-to-refresh functionality
- [x] Filter by floor/location (Admin only)
- [x] Maintenance users see only assigned dispensers

## Map Screen
- [x] Render building floor map with dispenser location pins
- [x] Floor selector/tabs (Floor 1, Floor 2, etc.)
- [x] Status legend (Red/Yellow/Green)
- [x] Tap pin to view dispenser details
- [x] Filter by floor
- [x] Show/hide offline devices toggle
- [x] Maintenance users see only assigned dispensers

## Analytics Screen
- [x] Display shift-based graphs for Maintenance users
- [x] Display full building overview for Admin users
- [x] Show metrics: refills per shift, average soap usage, battery trends
- [x] Date range selector
- [x] Drill-down functionality for chart details
- [ ] Export data option (optional)

## History Screen
- [x] Chronological event log (refills, alerts, offline notices, unusual activity)
- [x] Event type badges with color coding
- [x] Filter by event type (dropdown)
- [ ] Filter by date range (calendar picker)
- [x] Search by dispenser name
- [x] Pull-to-refresh
- [x] Maintenance users see only events for assigned dispensers

## Settings Screen
- [x] Notification toggle: critical refill
- [x] Notification toggle: low soap
- [x] Notification toggle: low battery
- [x] Notification toggle: offline device
- [x] Notification toggle: unusual activity
- [x] Threshold settings (Admin only): soap level %
- [x] Threshold settings (Admin only): battery level %
- [x] User management (Admin only): list Maintenance users
- [x] User management (Admin only): add/remove Maintenance staff
- [x] Display current user role and email
- [x] Sign out button

## Navigation & Theming
- [x] Configure bottom tab bar with 5 tabs (Dashboard, Map, Analytics, History, Settings)
- [x] Add tab icons to icon-symbol.tsx
- [x] Update theme.config.js with deep navy-to-blue gradient
- [x] Implement blue primary color (#0A5BA8)
- [x] Implement status colors (Red/Yellow/Green)
- [x] Ensure dark mode support
- [x] Add haptic feedback on button press

## Mock Data & Testing
- [x] Create mock dispenser data with various status levels
- [x] Create mock user data (Admin and Maintenance roles)
- [x] Create mock event history
- [x] Test role-based access control
- [x] Test shift-based filtering for Maintenance users
- [x] Test all navigation flows

## UI Polish & Refinement
- [ ] Ensure all buttons and links are functional
- [ ] Add loading states for data fetching
- [ ] Add error handling and user feedback
- [ ] Verify text sizing and readability
- [ ] Ensure touch targets are 44pt minimum
- [ ] Test on iOS and Android layouts
- [ ] Verify safe area handling (notch, home indicator)

## Push Notifications (Optional)
- [ ] Set up push notification infrastructure
- [ ] Implement critical refill notification
- [ ] Implement low soap notification
- [ ] Implement low battery notification
- [ ] Implement offline device notification
- [ ] Implement unusual activity notification
- [ ] Implement refill confirmed notification

## Branding
- [x] Generate custom app logo reflecting soap dispenser/monitoring theme
- [x] Update app.config.ts with app name and logo URL
- [x] Create splash screen icon
- [x] Create Android adaptive icon assets

## Final Delivery
- [ ] All screens built and functional
- [ ] All user flows tested end-to-end
- [ ] No console errors on iOS, Android, and Web
- [ ] App ready for checkpoint and publishing

## Color Scheme Refinement
- [x] Update theme.config.js to use semi-transparent blue surfaces instead of white
- [x] Update Login screen background and card colors
- [x] Update Sign Up screen background and card colors
- [x] Update Dashboard screen card colors
- [x] Update Map screen card colors
- [x] Update Analytics screen card colors
- [x] Update History screen card colors
- [x] Update Settings screen card colors
- [x] Ensure text contrast is readable on all blue backgrounds

## Bug Fixes
- [x] Fix floor selector buttons - white text on white background, should be blue with white text
- [x] Fix History screen - add filter by event type dropdown/selector
