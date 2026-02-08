import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import { useState, useRef, useEffect } from "react";
import {
  FilterChips,
  PracticeCard,
  PlayerModal,
} from "@/components/guided-practices";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { practices, filters, Practice } from "@/utils/practicesData";

export default function GuidedPracticesScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    isPlaying,
    position,
    duration,
    audioDurations,
    playSound,
    togglePlayback,
    setPlaybackPosition,
    stopSound,
  } = useAudioPlayer();

  const handleBeginJourney = async (practice: Practice) => {
    setSelectedPractice(practice);
    setIsModalVisible(true);
    await playSound(practice.audio);
  };

  const handleCloseModal = async () => {
    await stopSound();
    setIsModalVisible(false);
  };

  const filteredPractices = practices.filter((practice) => {
    if (activeFilter === "All") return true;
    return (
      practice.tag.includes(activeFilter) ||
      practice.type.includes(activeFilter)
    );
  });

  // Animation state
  const componentAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Staggered fade-in animation for practice cards
  const practiceAnimsMap = useRef<Map<number, Animated.Value>>(
    new Map(),
  ).current;
  const animatedPractices = useRef<Set<number>>(new Set()).current;

  useEffect(() => {
    const animations = componentAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    );
    Animated.stagger(50, animations).start();
  }, [componentAnims]);

  // Initialize animations for filtered practices
  useEffect(() => {
    const newAnimations: Animated.CompositeAnimation[] = [];
    const practicesToAnimate: { id: number; index: number }[] = [];

    filteredPractices.forEach((practice, index) => {
      if (!animatedPractices.has(practice.id)) {
        if (!practiceAnimsMap.has(practice.id)) {
          practiceAnimsMap.set(practice.id, new Animated.Value(0));
        }
        practicesToAnimate.push({ id: practice.id, index });
        animatedPractices.add(practice.id);
      }
    });

    // Create animations for new practices
    practicesToAnimate.forEach(({ id }, arrayIndex) => {
      const anim = practiceAnimsMap.get(id)!;
      anim.setValue(0);

      newAnimations.push(
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: arrayIndex * 80,
          useNativeDriver: true,
        }),
      );
    });

    // Start animations only if there are new practices
    if (newAnimations.length > 0) {
      Animated.stagger(80, newAnimations).start();
    }
  }, [filteredPractices]);

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1121" }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          style={{
            opacity: componentAnims[0],
            transform: [
              {
                translateY: componentAnims[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
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
              style={styles.backButton}
              testID="back-button"
            >
              <ArrowLeftIcon size={24} color="#FFF" />
            </Pressable>

            <Text className="text-sm font-bold uppercase tracking-widest text-slate-400">
              GUIDED PRACTICES
            </Text>

            <View style={styles.placeholderButton} />
          </View>
        </Animated.View>

        {/* Filter Chips */}
        <Animated.View
          style={{
            paddingHorizontal: 24,
            paddingBottom: 20,
            opacity: componentAnims[1],
            transform: [
              {
                translateY: componentAnims[1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <FilterChips
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </Animated.View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
          {filteredPractices.map((practice) => {
            const animValue =
              practiceAnimsMap.get(practice.id) || new Animated.Value(1);
            return (
              <Animated.View
                key={practice.id}
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
                <PracticeCard
                  practice={practice}
                  audioDuration={audioDurations[practice.id]}
                  onBeginJourney={handleBeginJourney}
                />
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      <PlayerModal
        visible={isModalVisible}
        practice={selectedPractice}
        isPlaying={isPlaying}
        position={position}
        duration={duration}
        onClose={handleCloseModal}
        onTogglePlayback={togglePlayback}
        onSeek={setPlaybackPosition}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  placeholderButton: {
    width: 48,
    height: 48,
  },
});
