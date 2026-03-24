import { useState, useEffect } from "react";
import { ScrollView, Text, View, Pressable, RefreshControl, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { MOCK_DISPENSERS, getStatusColor, getStatusLabel, type Dispenser } from "@/lib/mock-data";
import * as Haptics from "expo-haptics";

export default function DashboardScreen() {
  const { user } = useAuth();
  const [dispensers, setDispensers] = useState<Dispenser[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  // Filter dispensers based on user role
  useEffect(() => {
    let filtered = MOCK_DISPENSERS;

    // Maintenance users only see assigned dispensers
    if (user?.role === "maintenance") {
      filtered = filtered.filter((d) => d.assignedTo.includes(user.id));
    }

    // Filter by floor if selected
    if (selectedFloor !== null) {
      filtered = filtered.filter((d) => d.floor === selectedFloor);
    }

    setDispensers(filtered);
  }, [user, selectedFloor]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 800);
  };

  const floors = Array.from(new Set(MOCK_DISPENSERS.map((d) => d.floor))).sort();

  const renderDispenserCard = ({ item }: { item: Dispenser }) => (
    <Pressable
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="bg-surface rounded-2xl p-4 mb-3 border border-border"
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">{item.name}</Text>
          <Text className="text-sm text-muted">{item.location}</Text>
        </View>
        <View
          style={{ backgroundColor: getStatusColor(item.status) }}
          className="rounded-full px-3 py-1"
        >
          <Text className="text-white text-xs font-bold">{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      {/* Metrics Grid */}
      <View className="flex-row gap-3 mb-3">
        {/* Soap Level */}
        <View className="flex-1 bg-primary bg-opacity-20 rounded-lg p-3 border border-primary border-opacity-30">
          <Text className="text-xs text-muted font-semibold mb-1">SOAP</Text>
          <Text className="text-2xl font-bold text-primary">{item.soapLevel}%</Text>
          <View className="h-1 bg-border rounded-full mt-2 overflow-hidden">
            <View
              style={{
                width: `${item.soapLevel}%`,
                backgroundColor: getStatusColor(
                  item.soapLevel > 50 ? "ok" : item.soapLevel > 25 ? "low" : "critical",
                ),
              }}
              className="h-full"
            />
          </View>
        </View>

        {/* Battery Level */}
        <View className="flex-1 bg-primary bg-opacity-20 rounded-lg p-3 border border-primary border-opacity-30">
          <Text className="text-xs text-muted font-semibold mb-1">BATTERY</Text>
          <Text className="text-2xl font-bold text-primary">{item.batteryLevel}%</Text>
          <View className="h-1 bg-border rounded-full mt-2 overflow-hidden">
            <View
              style={{
                width: `${item.batteryLevel}%`,
                backgroundColor: getStatusColor(
                  item.batteryLevel > 50 ? "ok" : item.batteryLevel > 15 ? "low" : "critical",
                ),
              }}
              className="h-full"
            />
          </View>
        </View>
      </View>

      {/* Usage Info */}
      <View className="flex-row justify-between items-center pt-3 border-t border-border">
        <View>
          <Text className="text-xs text-muted">Usage Count</Text>
          <Text className="text-sm font-semibold text-foreground">{item.usageCount}</Text>
        </View>
        <View>
          <Text className="text-xs text-muted">Last Refill</Text>
          <Text className="text-sm font-semibold text-foreground">
            {new Date(item.lastRefill).toLocaleDateString()}
          </Text>
        </View>
        <Pressable
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          style={({ pressed }) => [
            { transform: [{ scale: pressed ? 0.95 : 1 }], opacity: pressed ? 0.8 : 1 },
          ]}
          className="bg-primary rounded-lg px-4 py-2"
        >
          <Text className="text-white text-xs font-bold">Refill</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-4">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-3xl font-bold text-foreground">Dashboard</Text>
        <Text className="text-sm text-muted">
          {user?.role === "admin" ? "All Dispensers" : `Your Assigned Dispensers (${user?.shift})`}
        </Text>
      </View>

      {/* Floor Filter (Admin only) */}
      {user?.role === "admin" && (
        <View className="mb-4">
          <Text className="text-sm font-semibold text-foreground mb-2">Filter by Floor</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            <Pressable
              onPress={() => setSelectedFloor(null)}
              style={{
                backgroundColor: selectedFloor === null ? "#0A5BA8" : "#F5F7FA",
              }}
              className="px-4 py-2 rounded-full border border-border"
            >
              <Text
                className={`font-semibold text-sm ${selectedFloor === null ? "text-white" : "text-foreground"}`}
              >
                All
              </Text>
            </Pressable>
            {floors.map((floor) => (
              <Pressable
                key={floor}
                onPress={() => setSelectedFloor(floor)}
                style={{
                  backgroundColor: selectedFloor === floor ? "#0A5BA8" : "#F5F7FA",
                }}
                className="px-4 py-2 rounded-full border border-border"
              >
                <Text
                  className={`font-semibold text-sm ${selectedFloor === floor ? "text-white" : "text-foreground"}`}
                >
                  Floor {floor}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Dispensers List */}
      <FlatList
        data={dispensers}
        renderItem={renderDispenserCard}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={
          <View className="items-center justify-center py-8">
            <Text className="text-lg text-muted">No dispensers found</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
