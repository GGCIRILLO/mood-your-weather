import React, { useState, useEffect, useRef, useMemo, Fragment } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  ArrowLeft,
  MagnifyingGlass,
  FunnelSimple,
} from "phosphor-react-native";
import {
  JournalEntryCard,
  SearchBar,
  FilterBar,
  EmptyState,
} from "@/components/journal";
import type { MoodEmojiType } from "@/types";
import { useJournalMoods } from "@/hooks/api/useJournalMoods";

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const [searchVisible, setSearchVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<MoodEmojiType[]>([]);
  const [scrollY, setScrollY] = useState(0);

  // Fetch journal data from API
  const { entries, loading, error } = useJournalMoods({
    limit: 50,
    autoFetch: true,
  });

  const headerOpacity = useRef(new Animated.Value(1)).current;

  // Transform API data to match JournalEntryCard format
  const transformedEntries = useMemo(() => {
    return entries.map((entry) => {
      const timestamp = new Date(entry.mood.timestamp);

      // Format date: "Monday, January 15, 2026"
      const date = timestamp.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Format time: "9:30 PM"
      const time = timestamp.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return {
        id: entry.mood.id,
        date,
        emojis: entry.mood.emojis,
        intensity: entry.mood.intensity,
        note: entry.mood.note || "",
        time,
        // NLP analysis data
        nlpSentiment: entry.nlpAnalysis.sentiment,
        nlpScore: entry.nlpAnalysis.score,
        nlpMagnitude: entry.nlpAnalysis.magnitude,
        // External weather - map API structure to component structure
        externalWeather: entry.mood.externalWeather
          ? {
              condition: entry.mood.externalWeather.weather_main,
              temperature: entry.mood.externalWeather.temp,
            }
          : undefined,
        // Location - show name if available, otherwise coordinates
        location: entry.mood.location
          ? entry.mood.location.name ||
            `${entry.mood.location.lat.toFixed(2)}°, ${entry.mood.location.lon.toFixed(2)}°`
          : undefined,
      };
    });
  }, [entries]);

  // Handle scroll for blur effect
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);

    // Fade header background when scrolling
    Animated.timing(headerOpacity, {
      toValue: offsetY > 20 ? 0.95 : 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  // Filter entries based on search and filters
  const filteredEntries = transformedEntries.filter((entry) => {
    // Search filter
    const matchesSearch =
      searchQuery.trim() === "" ||
      entry.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.date.toLowerCase().includes(searchQuery.toLowerCase());

    // Emoji filter
    const matchesFilter =
      selectedFilters.length === 0 ||
      entry.emojis.some((emoji) => selectedFilters.includes(emoji));

    return matchesSearch && matchesFilter;
  });

  // Determine empty state type
  const getEmptyStateType = (): "noEntries" | "noResults" | "noFilters" => {
    if (transformedEntries.length === 0) return "noEntries";
    if (selectedFilters.length > 0 && filteredEntries.length === 0)
      return "noFilters";
    if (searchQuery.trim() !== "" && filteredEntries.length === 0)
      return "noResults";
    return "noEntries";
  };

  const handleFilterToggle = (filter: MoodEmojiType) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
  };

  // Staggered fade-in animation for entries
  // Use a stable map to store animations by entry ID
  const entryAnimsMap = useRef<Map<string, Animated.Value>>(new Map()).current;
  const animatedEntries = useRef<Set<string>>(new Set()).current;

  // Initialize animations only for new entries from API, not on filter changes
  useEffect(() => {
    // Only animate entries that haven't been animated yet
    const newAnimations: Animated.CompositeAnimation[] = [];
    const entriesToAnimate: { id: string; index: number }[] = [];

    transformedEntries.forEach((entry, index) => {
      if (!animatedEntries.has(entry.id)) {
        if (!entryAnimsMap.has(entry.id)) {
          entryAnimsMap.set(entry.id, new Animated.Value(0));
        }
        entriesToAnimate.push({ id: entry.id, index });
        animatedEntries.add(entry.id);
      }
    });

    // Create animations for new entries
    entriesToAnimate.forEach(({ id }, arrayIndex) => {
      const anim = entryAnimsMap.get(id)!;
      anim.setValue(0);

      newAnimations.push(
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: arrayIndex * 50,
          useNativeDriver: true,
        }),
      );
    });

    // Start animations only if there are new entries
    if (newAnimations.length > 0) {
      Animated.stagger(50, newAnimations).start();
    }
  }, [transformedEntries]); // Only depend on transformedEntries (API data), not filteredEntries

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={styles.gradient}>
        {/* Background Blur Blobs */}
        <View style={styles.blueBlob} />
        <View style={styles.purpleBlob} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <View
            style={{
              paddingTop: insets.top + 16,
              paddingBottom: 16,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 48,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              <ArrowLeft size={24} color="#FFF" />
            </Pressable>

            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: "#94a3b8",
              }}
            >
              Journal
            </Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Pressable
                onPress={() => {
                  setSearchVisible(!searchVisible);
                  if (filterVisible) setFilterVisible(false);
                }}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <MagnifyingGlass
                  size={20}
                  color="white"
                  weight={searchVisible ? "fill" : "regular"}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  setFilterVisible(!filterVisible);
                  if (searchVisible) setSearchVisible(false);
                }}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <FunnelSimple
                  size={20}
                  color="white"
                  weight={filterVisible ? "fill" : "regular"}
                />
              </Pressable>
            </View>
          </View>

          {/* Search Bar */}
          <SearchBar
            visible={searchVisible}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onDismiss={() => setSearchVisible(false)}
          />

          {/* Filter Bar */}
          <FilterBar
            visible={filterVisible}
            selectedFilters={selectedFilters}
            onFilterToggle={handleFilterToggle}
          />

          {/* Entry Feed */}
          <View style={{ paddingTop: 20 }}>
            {loading ? (
              <Fragment key="loading">
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 60,
                  }}
                >
                  <ActivityIndicator size="large" color="#6366F1" />
                  <Text
                    style={{
                      color: "#94a3b8",
                      fontSize: 16,
                      marginTop: 16,
                    }}
                  >
                    Loading your reflections...
                  </Text>
                </View>
              </Fragment>
            ) : error ? (
              <Fragment key="error">
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 60,
                    paddingHorizontal: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "#ef4444",
                      fontSize: 18,
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    Error loading reflections
                  </Text>
                  <Text
                    style={{
                      color: "#94a3b8",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </Text>
                </View>
              </Fragment>
            ) : filteredEntries.length === 0 ? (
              <Fragment key="empty">
                <EmptyState
                  type={getEmptyStateType()}
                  searchQuery={searchQuery}
                  onClearFilters={handleClearFilters}
                />
              </Fragment>
            ) : (
              <Fragment key="entries">
                {filteredEntries.map((entry) => {
                  const animValue =
                    entryAnimsMap.get(entry.id) || new Animated.Value(1);
                  return (
                    <View key={entry.id}>
                      <Animated.View
                        key={entry.id}
                        style={{
                          opacity: animValue,
                          transform: [
                            {
                              translateY: animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                              }),
                            },
                          ],
                        }}
                      >
                        <JournalEntryCard
                          key={entry.id}
                          date={entry.date}
                          emojis={entry.emojis}
                          intensity={entry.intensity}
                          note={entry.note}
                          externalWeather={entry.externalWeather}
                          location={entry.location}
                          time={entry.time}
                          searchQuery={searchQuery}
                          nlpSentiment={entry.nlpSentiment}
                          nlpScore={entry.nlpScore}
                          nlpMagnitude={entry.nlpMagnitude}
                        />
                      </Animated.View>
                    </View>
                  );
                })}
              </Fragment>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  blueBlob: {
    position: "absolute",
    top: "20%",
    right: -80,
    width: 256,
    height: 256,
    backgroundColor: "rgba(19, 91, 236, 0.15)",
    borderRadius: 9999,
  },
  purpleBlob: {
    position: "absolute",
    bottom: "33%",
    left: -40,
    width: 320,
    height: 320,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    borderRadius: 9999,
  },
});
