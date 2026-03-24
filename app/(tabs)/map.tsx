import { useState, useEffect } from "react";
import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { MOCK_DISPENSERS, getStatusColor, getStatusLabel, type Dispenser } from "@/lib/mock-data";
import * as Haptics from "expo-haptics";

export default function MapScreen() {
  const { user } = useAuth();
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [dispensers, setDispensers] = useState<Dispenser[]>([]);
  const [showOffline, setShowOffline] = useState(true);

  // Filter dispensers based on user role and selected floor
  useEffect(() => {
    let filtered = MOCK_DISPENSERS;

    // Maintenance users only see assigned dispensers
    if (user?.role === "maintenance") {
      filtered = filtered.filter((d) => d.assignedTo.includes(user.id));
    }

    // Filter by floor
    filtered = filtered.filter((d) => d.floor === selectedFloor);

    // Filter offline if needed
    if (!showOffline) {
      filtered = filtered.filter((d) => d.status !== "offline");
    }

    setDispensers(filtered);
  }, [user, selectedFloor, showOffline]);

  const floors = Array.from(new Set(MOCK_DISPENSERS.map((d) => d.floor))).sort();

  const renderDispenserPin = ({ item }: { item: Dispenser }) => (
    <Pressable
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="bg-surface rounded-xl p-3 mb-2 border border-border flex-row items-center gap-3"
    >
      {/* Status Indicator */}
      <View
        style={{ backgroundColor: getStatusColor(item.status) }}
        className="w-3 h-3 rounded-full"
      />

      {/* Dispenser Info */}
      <View className="flex-1">
        <Text className="text-sm font-bold text-foreground">{item.name}</Text>
        <Text className="text-xs text-muted">{item.location}</Text>
      </View>

      {/* Status Badge */}
      <View className="bg-primary bg-opacity-20 rounded-lg px-2 py-1 border border-primary border-opacity-30">
        <Text className="text-xs font-semibold text-foreground">{getStatusLabel(item.status)}</Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-4">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-3xl font-bold text-foreground">Map</Text>
        <Text className="text-sm text-muted">Building Floor Overview</Text>
      </View>

      {/* Floor Selector */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-foreground mb-2">Select Floor</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
          {floors.map((floor) => (
            <Pressable
              key={floor}
              onPress={() => {
                setSelectedFloor(floor);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                backgroundColor: selectedFloor === floor ? "#0A5BA8" : "rgba(10, 91, 168, 0.3)",
                borderColor: selectedFloor === floor ? "#0A5BA8" : "#2D5A8C",
              }}
              className="px-6 py-2 rounded-full border"
            >
              <Text
                className="font-bold text-sm text-white"
              >
                Floor {floor}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Map Visualization */}
      <View className="bg-surface rounded-2xl p-4 mb-4 border border-border bg-opacity-50">
        <Text className="text-sm font-semibold text-foreground mb-3">Floor {selectedFloor} Layout</Text>

        {/* Simplified Floor Map */}
        <View className="bg-primary bg-opacity-20 rounded-lg p-4 mb-3 border border-primary border-opacity-30">
          <View className="h-40 bg-primary bg-opacity-10 rounded-lg items-center justify-center">
            <Text className="text-4xl mb-2">🏢</Text>
            <Text className="text-sm text-muted text-center">
              Floor {selectedFloor} - {dispensers.length} dispenser{dispensers.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {/* Status Legend */}
        <View className="flex-row gap-3 mb-3">
          <View className="flex-row items-center gap-1 flex-1">
            <View className="w-2 h-2 rounded-full bg-success" />
            <Text className="text-xs text-muted">OK</Text>
          </View>
          <View className="flex-row items-center gap-1 flex-1">
            <View className="w-2 h-2 rounded-full bg-warning" />
            <Text className="text-xs text-muted">Low</Text>
          </View>
          <View className="flex-row items-center gap-1 flex-1">
            <View className="w-2 h-2 rounded-full bg-error" />
            <Text className="text-xs text-muted">Critical</Text>
          </View>
          <View className="flex-row items-center gap-1 flex-1">
            <View className="w-2 h-2 rounded-full bg-offline" />
            <Text className="text-xs text-muted">Offline</Text>
          </View>
        </View>
      </View>

      {/* Show Offline Toggle */}
      <View className="flex-row items-center justify-between mb-4 bg-surface rounded-lg p-3 border border-border bg-opacity-50">
        <Text className="text-sm font-semibold text-foreground">Show Offline Devices</Text>
        <Pressable
          onPress={() => {
            setShowOffline(!showOffline);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={{
            backgroundColor: showOffline ? "#0A5BA8" : "#E5E7EB",
          }}
          className="w-12 h-7 rounded-full items-center justify-center"
        >
          <View
            style={{
              transform: [{ translateX: showOffline ? 10 : -10 }],
            }}
            className="w-5 h-5 bg-white rounded-full"
          />
        </Pressable>
      </View>

      {/* Dispensers List */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-foreground mb-2">Dispensers on Floor {selectedFloor}</Text>
        <FlatList
          data={dispensers}
          renderItem={renderDispenserPin}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
          <View className="items-center justify-center py-4">
            <Text className="text-sm text-muted">No dispensers on this floor</Text>
          </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}
