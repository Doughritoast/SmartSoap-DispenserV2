import { useState, useMemo } from "react";
import { ScrollView, Text, View, Pressable, TextInput, FlatList, RefreshControl } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { MOCK_EVENTS, getEventTypeIcon, getEventTypeLabel, type Event } from "@/lib/mock-data";
import * as Haptics from "expo-haptics";

export default function HistoryScreen() {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<Event["type"] | "all">("all");
  const [refreshing, setRefreshing] = useState(false);

  const eventTypes: (Event["type"] | "all")[] = [
    "all",
    "refill",
    "critical_alert",
    "low_soap",
    "low_battery",
    "offline",
    "unusual_activity",
    "refill_confirmed",
  ];

  // Filter events based on user role, search, and type
  const filteredEvents = useMemo(() => {
    let filtered = MOCK_EVENTS;

    // Maintenance users only see events for assigned dispensers
    if (user?.role === "maintenance") {
      const assignedIds = new Set(
        MOCK_EVENTS.filter((e) =>
          MOCK_EVENTS.some((evt) => evt.dispenserId === e.dispenserId && user.id),
        ).map((e) => e.dispenserId),
      );
      filtered = filtered.filter((e) => assignedIds.has(e.dispenserId));
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((e) => e.type === selectedType);
    }

    // Filter by search text
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.dispenserName.toLowerCase().includes(lowerSearch) ||
          e.details.toLowerCase().includes(lowerSearch),
      );
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [user, selectedType, searchText]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 800);
  };

  const renderEventCard = ({ item }: { item: Event }) => (
    <Pressable
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="bg-white rounded-2xl p-4 mb-3 border border-border"
    >
      <View className="flex-row gap-3">
        {/* Icon */}
        <View className="w-12 h-12 bg-surface rounded-lg items-center justify-center">
          <Text className="text-xl">{getEventTypeIcon(item.type)}</Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-sm font-bold text-foreground flex-1">{item.dispenserName}</Text>
            <Text className="text-xs text-muted">
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>
          <Text className="text-xs font-semibold text-primary mb-1">
            {getEventTypeLabel(item.type)}
          </Text>
          <Text className="text-xs text-muted">{item.details}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-4">
          <Text className="text-3xl font-bold text-foreground">History</Text>
          <Text className="text-sm text-muted">Event Log & Maintenance Records</Text>
        </View>

        {/* Search Bar */}
        <View className="mb-4">
          <TextInput
            className="bg-white border border-border rounded-xl px-4 py-3 text-foreground"
            placeholder="Search by dispenser name..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Type Filter */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-foreground mb-2">Filter by Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {eventTypes.map((type) => (
              <Pressable
                key={type}
                onPress={() => {
                  setSelectedType(type);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={{
                  backgroundColor: selectedType === type ? "#0A5BA8" : "#F5F7FA",
                }}
                className="px-3 py-2 rounded-full border border-border"
              >
                <Text
                  className={`text-xs font-semibold ${selectedType === type ? "text-white" : "text-foreground"}`}
                >
                  {type === "all"
                    ? "All"
                    : getEventTypeLabel(type as Event["type"]).split(" ")[0]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Events List */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-foreground mb-3">
            {filteredEvents.length} Event{filteredEvents.length !== 1 ? "s" : ""}
          </Text>
          <FlatList
            data={filteredEvents}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            ListEmptyComponent={
              <View className="items-center justify-center py-8">
                <Text className="text-lg text-muted mb-2">📭</Text>
                <Text className="text-base text-muted">No events found</Text>
                <Text className="text-xs text-muted mt-1">Try adjusting your filters</Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
