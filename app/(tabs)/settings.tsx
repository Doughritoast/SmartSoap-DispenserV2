import { useState } from "react";
import { ScrollView, Text, View, Pressable, Switch, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Notification preferences
  const [notifications, setNotifications] = useState({
    criticalRefill: true,
    lowSoap: true,
    lowBattery: true,
    offlineDevice: true,
    unusualActivity: false,
  });

  // Thresholds (Admin only)
  const [thresholds, setThresholds] = useState({
    soapLevel: 25,
    batteryLevel: 15,
  });

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Sign Out",
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          await logout();
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderSettingRow = (label: string, value: boolean, onToggle: () => void) => (
    <View className="flex-row justify-between items-center py-3 border-b border-border">
      <Text className="text-sm text-foreground">{label}</Text>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Settings</Text>
          <Text className="text-sm text-muted">Preferences & Configuration</Text>
        </View>

        {/* Account Section */}
        <View className="bg-surface rounded-2xl p-4 border border-border mb-6">
          <Text className="text-sm font-bold text-foreground mb-4">Account</Text>
          <View className="flex-row justify-between items-center py-3 border-b border-border">
            <Text className="text-sm text-muted">Name</Text>
            <Text className="text-sm font-semibold text-foreground">{user?.name}</Text>
          </View>
          <View className="flex-row justify-between items-center py-3 border-b border-border">
            <Text className="text-sm text-muted">Email</Text>
            <Text className="text-sm font-semibold text-foreground">{user?.email}</Text>
          </View>
          <View className="flex-row justify-between items-center py-3">
            <Text className="text-sm text-muted">Role</Text>
            <View className="bg-primary rounded-lg px-3 py-1">
              <Text className="text-xs font-bold text-white capitalize">{user?.role}</Text>
            </View>
          </View>
          {user?.role === "maintenance" && (
            <>
              <View className="flex-row justify-between items-center py-3 border-t border-border">
                <Text className="text-sm text-muted">Employee ID</Text>
                <Text className="text-sm font-semibold text-foreground">{user?.employeeId}</Text>
              </View>
              <View className="flex-row justify-between items-center py-3">
                <Text className="text-sm text-muted">Shift</Text>
                <Text className="text-sm font-semibold text-foreground capitalize">{user?.shift}</Text>
              </View>
            </>
          )}
        </View>

        {/* Notifications Section */}
        <View className="bg-surface rounded-2xl p-4 border border-border mb-6">
          <Text className="text-sm font-bold text-foreground mb-4">Push Notifications</Text>
          {renderSettingRow(
            "Critical Refill Alert",
            notifications.criticalRefill,
            () => toggleNotification("criticalRefill"),
          )}
          {renderSettingRow(
            "Low Soap Warning",
            notifications.lowSoap,
            () => toggleNotification("lowSoap"),
          )}
          {renderSettingRow(
            "Low Battery Alert",
            notifications.lowBattery,
            () => toggleNotification("lowBattery"),
          )}
          {renderSettingRow(
            "Offline Device Notice",
            notifications.offlineDevice,
            () => toggleNotification("offlineDevice"),
          )}
          <View className="flex-row justify-between items-center py-3">
            <Text className="text-sm text-foreground">Unusual Activity Alert</Text>
            <Switch
              value={notifications.unusualActivity}
              onValueChange={() => toggleNotification("unusualActivity")}
            />
          </View>
        </View>

        {/* Admin-only: Thresholds Section */}
        {user?.role === "admin" && (
          <View className="bg-surface rounded-2xl p-4 border border-border mb-6">
            <Text className="text-sm font-bold text-foreground mb-4">Alert Thresholds</Text>
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-muted">Soap Level Alert</Text>
                <View className="bg-surface rounded-lg px-3 py-1">
                  <Text className="text-sm font-bold text-primary">{thresholds.soapLevel}%</Text>
                </View>
              </View>
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View
                  style={{ width: `${thresholds.soapLevel}%` }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </View>
            </View>
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-muted">Battery Level Alert</Text>
                <View className="bg-surface rounded-lg px-3 py-1">
                  <Text className="text-sm font-bold text-primary">{thresholds.batteryLevel}%</Text>
                </View>
              </View>
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View
                  style={{ width: `${thresholds.batteryLevel}%` }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </View>
            </View>
          </View>
        )}

        {/* Admin-only: User Management Section */}
        {user?.role === "admin" && (
          <View className="bg-surface rounded-2xl p-4 border border-border mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm font-bold text-foreground">Manage Users</Text>
              <Pressable
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                className="bg-primary rounded-lg px-3 py-1"
              >
                <Text className="text-xs font-bold text-white">+ Add User</Text>
              </Pressable>
            </View>

            {/* Sample maintenance users */}
            {["John Maintenance", "Sarah Tech", "Mike Facilities"].map((name, idx) => (
              <View key={idx} className="flex-row justify-between items-center py-3 border-b border-border">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{name}</Text>
                  <Text className="text-xs text-muted">Maintenance • EMP00{idx + 1}</Text>
                </View>
                <Pressable
                  onPress={() => {
                    Alert.alert("Remove User", `Remove ${name}?`, [
                      { text: "Cancel" },
                      { text: "Remove", style: "destructive" },
                    ]);
                  }}
                  className="bg-error bg-opacity-10 rounded-lg px-2 py-1"
                >
                  <Text className="text-xs font-bold text-error">Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* About Section */}
        <View className="bg-surface rounded-2xl p-4 border border-border mb-6 bg-opacity-50">
          <Text className="text-sm font-bold text-foreground mb-3">About</Text>
          <View className="flex-row justify-between items-center py-2 mb-2">
            <Text className="text-sm text-muted">App Version</Text>
            <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
          </View>
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-sm text-muted">Last Updated</Text>
            <Text className="text-sm font-semibold text-foreground">Mar 24, 2026</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            {
              transform: [{ scale: pressed ? 0.97 : 1 }],
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          className="bg-error rounded-xl py-3 items-center mb-6"
        >
          <Text className="text-white font-bold text-base">Sign Out</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
