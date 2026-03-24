import { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import * as Haptics from "expo-haptics";

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<"week" | "month" | "all">("week");

  // Mock analytics data
  const analyticsData = {
    totalRefills: 47,
    averageSoapUsage: 62,
    batteryHealth: 78,
    refillsThisWeek: 12,
    criticalAlerts: 3,
    maintenanceTime: "2.5 hrs",
  };

  const shiftData = {
    morning: { refills: 8, avgTime: "15 min", alerts: 1 },
    afternoon: { refills: 12, avgTime: "18 min", alerts: 2 },
    evening: { refills: 5, avgTime: "12 min", alerts: 0 },
  };

  const renderStatCard = (title: string, value: string, subtitle?: string) => (
    <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
      <Text className="text-xs font-semibold text-muted mb-1">{title}</Text>
      <Text className="text-2xl font-bold text-primary mb-1">{value}</Text>
      {subtitle && <Text className="text-xs text-muted">{subtitle}</Text>}
    </View>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-4">
          <Text className="text-3xl font-bold text-foreground">Analytics</Text>
          <Text className="text-sm text-muted">
            {user?.role === "admin" ? "Building Overview" : `${user?.shift} Shift Stats`}
          </Text>
        </View>

        {/* Date Range Selector */}
        <View className="flex-row gap-2 mb-6">
          {(["week", "month", "all"] as const).map((range) => (
            <Pressable
              key={range}
              onPress={() => {
                setDateRange(range);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                backgroundColor: dateRange === range ? "#0A5BA8" : "rgba(10, 91, 168, 0.2)",
              }}
              className="flex-1 py-2 rounded-lg border border-border"
            >
              <Text
                className={`text-sm font-semibold text-center ${dateRange === range ? "text-white" : "text-foreground"}`}
              >
                {range === "week" ? "Week" : range === "month" ? "Month" : "All Time"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Key Metrics */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">Key Metrics</Text>
          <View className="flex-row gap-3 mb-3">
            {renderStatCard("Total Refills", analyticsData.totalRefills.toString())}
            {renderStatCard("Avg Soap Usage", analyticsData.averageSoapUsage + "%")}
          </View>
          <View className="flex-row gap-3">
            {renderStatCard("Battery Health", analyticsData.batteryHealth + "%")}
            {renderStatCard("This Week", analyticsData.refillsThisWeek.toString(), "refills")}
          </View>
        </View>

        {/* Admin-only: Building Overview */}
        {user?.role === "admin" && (
          <>
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-3">Building Status</Text>
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <View className="flex-row justify-between mb-3">
                  <Text className="text-sm text-muted">Critical Alerts</Text>
                  <Text className="text-lg font-bold text-error">{analyticsData.criticalAlerts}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                  <Text className="text-sm text-muted">Maintenance Time</Text>
                  <Text className="text-lg font-bold text-primary">{analyticsData.maintenanceTime}</Text>
                </View>
                <View className="h-1 bg-border rounded-full overflow-hidden">
                  <View className="h-full bg-gradient-to-r from-primary to-secondary w-3/4" />
                </View>
              </View>
            </View>

            {/* Shift Breakdown */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-3">Shift Performance</Text>
              {(["morning", "afternoon", "evening"] as const).map((shift) => (
                <View key={shift} className="bg-surface rounded-2xl p-4 border border-border mb-2">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-sm font-bold text-foreground capitalize">{shift} Shift</Text>
                    <View className="bg-primary bg-opacity-20 rounded-lg px-2 py-1 border border-primary border-opacity-30">
                      <Text className="text-xs font-semibold text-primary">
                        {shiftData[shift].refills} refills
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between text-xs text-muted">
                    <Text>Avg Time: {shiftData[shift].avgTime}</Text>
                    <Text>Alerts: {shiftData[shift].alerts}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Maintenance: Shift Stats */}
        {user?.role === "maintenance" && (
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-3">Your {user.shift} Shift</Text>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-muted">Refills Completed</Text>
                <Text className="text-lg font-bold text-primary">
                  {shiftData[user.shift as keyof typeof shiftData].refills}
                </Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-muted">Average Time per Refill</Text>
                <Text className="text-lg font-bold text-primary">
                  {shiftData[user.shift as keyof typeof shiftData].avgTime}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Critical Alerts</Text>
                <Text className="text-lg font-bold text-error">
                  {shiftData[user.shift as keyof typeof shiftData].alerts}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Chart Placeholder */}
        <View className="bg-surface rounded-2xl p-4 border border-border mb-6 bg-opacity-50">
          <Text className="text-sm font-semibold text-foreground mb-3">Usage Trend</Text>
          <View className="h-32 bg-primary bg-opacity-20 rounded-lg items-center justify-center border border-primary border-opacity-30">
            <Text className="text-3xl mb-2">📊</Text>
            <Text className="text-sm text-muted">Chart visualization</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
