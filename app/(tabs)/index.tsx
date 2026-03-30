import { useState, useEffect, useMemo } from "react";
import { ScrollView, Text, View, Pressable, RefreshControl, FlatList, Modal } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { MOCK_DISPENSERS, getStatusColor, getStatusLabel, type Dispenser } from "@/lib/mock-data";
import * as Haptics from "expo-haptics";

export default function DashboardScreen() {
  const { user } = useAuth();
  const [dispensers, setDispensers] = useState<Dispenser[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedDispenser, setSelectedDispenser] = useState<Dispenser | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleDispenserPress = (dispenser: Dispenser) => {
    setSelectedDispenser(dispenser);
    setIsModalVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleMarkRefilled = async () => {
    if (selectedDispenser) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsModalVisible(false);
      setSelectedDispenser(null);
    }
  };

  const floors = Array.from(new Set(MOCK_DISPENSERS.map((d) => d.floor))).sort();

  const renderDispenserCard = ({ item }: { item: Dispenser }) => (
    <Pressable
      onPress={() => handleDispenserPress(item)}
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
              style={{ width: `${item.soapLevel}%` }}
              className="h-full bg-primary"
            />
          </View>
        </View>

        {/* Battery Level */}
        <View className="flex-1 bg-primary bg-opacity-20 rounded-lg p-3 border border-primary border-opacity-30">
          <Text className="text-xs text-muted font-semibold mb-1">BATTERY</Text>
          <Text className="text-2xl font-bold text-primary">{item.batteryLevel}%</Text>
          <View className="h-1 bg-border rounded-full mt-2 overflow-hidden">
            <View
              style={{ width: `${item.batteryLevel}%` }}
              className="h-full bg-primary"
            />
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center pt-3 border-t border-border">
        <Text className="text-xs text-muted">Usage: {item.usageCount} times</Text>
        <Text className="text-xs text-muted">Tap for details</Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Header */}
        <View className="mb-4">
          <Text className="text-3xl font-bold text-foreground">Dashboard</Text>
          <Text className="text-sm text-muted">Real-time Dispenser Status</Text>
        </View>

        {/* Floor Filter */}
        {user?.role === "admin" && (
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Filter by Floor</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              <Pressable
                onPress={() => {
                  setSelectedFloor(null);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={{
                  backgroundColor: selectedFloor === null ? "#0A5BA8" : "rgba(10, 91, 168, 0.3)",
                  borderColor: selectedFloor === null ? "#0A5BA8" : "#2D5A8C",
                }}
                className="px-6 py-2 rounded-full border"
              >
                <Text className="font-bold text-sm text-white">All</Text>
              </Pressable>
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
                  <Text className="font-bold text-sm text-white">Floor {floor}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Status Summary */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-success bg-opacity-20 rounded-lg p-3 border border-success border-opacity-30">
            <Text className="text-xs text-muted font-semibold">OK</Text>
            <Text className="text-2xl font-bold text-success">
              {dispensers.filter((d) => d.status === "ok").length}
            </Text>
          </View>
          <View className="flex-1 bg-warning bg-opacity-20 rounded-lg p-3 border border-warning border-opacity-30">
            <Text className="text-xs text-muted font-semibold">LOW</Text>
            <Text className="text-2xl font-bold text-warning">
              {dispensers.filter((d) => d.status === "low").length}
            </Text>
          </View>
          <View className="flex-1 bg-error bg-opacity-20 rounded-lg p-3 border border-error border-opacity-30">
            <Text className="text-xs text-muted font-semibold">CRITICAL</Text>
            <Text className="text-2xl font-bold text-error">
              {dispensers.filter((d) => d.status === "critical").length}
            </Text>
          </View>
        </View>

        {/* Dispensers List */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-foreground mb-3">
            Dispensers ({dispensers.length})
          </Text>
          <FlatList
            data={dispensers}
            renderItem={renderDispenserCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View className="items-center justify-center py-8">
                <Text className="text-sm text-muted">No dispensers available</Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* Dispenser Detail Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 max-h-4/5">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Close Button */}
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-foreground">Dispenser Details</Text>
                <Pressable onPress={() => setIsModalVisible(false)}>
                  <Text className="text-2xl text-muted">✕</Text>
                </Pressable>
              </View>

              {selectedDispenser && (
                <>
                  {/* Dispenser Name & Location */}
                  <View className="bg-surface rounded-2xl p-4 border border-border mb-4">
                    <Text className="text-xl font-bold text-foreground mb-1">
                      {selectedDispenser.name}
                    </Text>
                    <Text className="text-sm text-muted mb-3">{selectedDispenser.location}</Text>
                    <View
                      style={{ backgroundColor: getStatusColor(selectedDispenser.status) }}
                      className="rounded-full px-3 py-1 self-start"
                    >
                      <Text className="text-white text-xs font-bold">
                        {getStatusLabel(selectedDispenser.status)}
                      </Text>
                    </View>
                  </View>

                  {/* Real-time Metrics */}
                  <Text className="text-sm font-semibold text-foreground mb-3">Real-time Metrics</Text>

                  {/* Soap Level */}
                  <View className="bg-surface rounded-2xl p-4 border border-border mb-3">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-sm font-semibold text-foreground">Soap Level</Text>
                      <Text className="text-lg font-bold text-primary">{selectedDispenser.soapLevel}%</Text>
                    </View>
                    <View className="h-2 bg-border rounded-full overflow-hidden">
                      <View
                        style={{ width: `${selectedDispenser.soapLevel}%` }}
                        className="h-full bg-primary"
                      />
                    </View>
                  </View>

                  {/* Battery Level */}
                  <View className="bg-surface rounded-2xl p-4 border border-border mb-3">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-sm font-semibold text-foreground">Battery Level</Text>
                      <Text className="text-lg font-bold text-primary">{selectedDispenser.batteryLevel}%</Text>
                    </View>
                    <View className="h-2 bg-border rounded-full overflow-hidden">
                      <View
                        style={{ width: `${selectedDispenser.batteryLevel}%` }}
                        className="h-full bg-primary"
                      />
                    </View>
                  </View>

                  {/* Usage Stats */}
                  <View className="flex-row gap-3 mb-4">
                    <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
                      <Text className="text-xs text-muted font-semibold mb-1">Usage Count</Text>
                      <Text className="text-2xl font-bold text-primary">
                        {selectedDispenser.usageCount}
                      </Text>
                    </View>
                    <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
                      <Text className="text-xs text-muted font-semibold mb-1">Last Refill</Text>
                      <Text className="text-xs font-semibold text-foreground">
                        {new Date(selectedDispenser.lastRefill).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  {/* Mark Refilled Button */}
                  <Pressable
                    onPress={handleMarkRefilled}
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed ? "#0847A3" : "#0A5BA8",
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                      },
                    ]}
                    className="rounded-xl py-4 items-center mb-3"
                  >
                    <Text className="text-white font-bold text-lg">✓ Mark Refilled</Text>
                  </Pressable>

                  {/* Close Button */}
                  <Pressable
                    onPress={() => setIsModalVisible(false)}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                    className="rounded-xl py-3 items-center border border-border"
                  >
                    <Text className="text-foreground font-semibold">Close</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
