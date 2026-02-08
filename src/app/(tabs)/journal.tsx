import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  StatusBar,
  StyleSheet,
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

// Dummy data for testing
const DUMMY_ENTRIES = [
  {
    id: "1",
    date: "Monday, January 15, 2026",
    emojis: ["stormy", "rainy"] as MoodEmojiType[],
    intensity: 85,
    note: "Today was really tough at work. Had a difficult meeting with my manager and felt completely overwhelmed. I couldn't focus on anything afterward. Need to figure out a better way to handle stress before it gets worse.",
    externalWeather: {
      condition: "Rainy",
      temperature: 8,
    },
    location: "Milan, IT",
    time: "9:30 PM",
  },
  {
    id: "2",
    date: "Sunday, January 14, 2026",
    emojis: ["sunny"] as MoodEmojiType[],
    intensity: 90,
    note: "Amazing day! Went for a long walk in the park and had lunch with friends. Feeling grateful for the little things in life. The weather was perfect and everything just felt right.",
    externalWeather: {
      condition: "Sunny",
      temperature: 15,
    },
    location: "Milan, IT",
    time: "8:15 PM",
  },
  {
    id: "3",
    date: "Saturday, January 13, 2026",
    emojis: ["partly", "cloudy"] as MoodEmojiType[],
    intensity: 60,
    note: "A quiet day at home. Did some reading and caught up on my favorite shows. Not particularly exciting, but needed this rest after a busy week.",
    externalWeather: {
      condition: "Cloudy",
      temperature: 10,
    },
    location: "Milan, IT",
    time: "10:00 PM",
  },
  {
    id: "4",
    date: "Friday, January 12, 2026",
    emojis: ["rainy"] as MoodEmojiType[],
    intensity: 55,
    note: "Felt a bit down today. Missing home and thinking about old friends. Sometimes you just need to let yourself feel sad and that's okay.",
    externalWeather: {
      condition: "Rainy",
      temperature: 7,
    },
    location: "Milan, IT",
    time: "7:45 PM",
  },
  {
    id: "5",
    date: "Thursday, January 11, 2026",
    emojis: ["stormy"] as MoodEmojiType[],
    intensity: 95,
    note: "Feeling extremely anxious about the upcoming presentation. Can't sleep, heart racing. Need to remember to breathe and take it one step at a time.",
    externalWeather: {
      condition: "Stormy",
      temperature: 6,
    },
    location: "Milan, IT",
    time: "11:30 PM",
  },
];

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const [searchVisible, setSearchVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<MoodEmojiType[]>([]);
  const [scrollY, setScrollY] = useState(0);

  const headerOpacity = useRef(new Animated.Value(1)).current;

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
  const filteredEntries = DUMMY_ENTRIES.filter((entry) => {
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
    if (DUMMY_ENTRIES.length === 0) return "noEntries";
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
  const entryAnims = useRef(
    DUMMY_ENTRIES.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const animations = filteredEntries.map((_, index) =>
      Animated.timing(entryAnims[index], {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    );
    Animated.stagger(50, animations).start();
  }, [filteredEntries, entryAnims]);

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
              Reflections
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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
            {filteredEntries.length === 0 ? (
              <EmptyState
                type={getEmptyStateType()}
                searchQuery={searchQuery}
                onClearFilters={handleClearFilters}
              />
            ) : (
              filteredEntries.map((entry, index) => (
                <Animated.View
                  key={entry.id}
                  style={{
                    opacity: entryAnims[index],
                    transform: [
                      {
                        translateY: entryAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <JournalEntryCard
                    date={entry.date}
                    emojis={entry.emojis}
                    intensity={entry.intensity}
                    note={entry.note}
                    externalWeather={entry.externalWeather}
                    location={entry.location}
                    time={entry.time}
                    searchQuery={searchQuery}
                  />
                </Animated.View>
              ))
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
