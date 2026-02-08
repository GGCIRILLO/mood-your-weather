import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import { useState } from "react";
import { FilterChips, PracticeCard, PlayerModal } from "@/components/guided-practices";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { practices, filters, Practice } from "@/utils/practicesData";

export default function GuidedPracticesScreen() {
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
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
        return practice.tag.includes(activeFilter) || practice.type.includes(activeFilter);
    });

    return (
        <View style={{ flex: 1, backgroundColor: "#0b1121" }}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeftIcon size={24} color="#FFF" />
                    </Pressable>

                    <Text className="text-sm font-bold uppercase tracking-widest text-slate-400">
                        GUIDED PRACTICES
                    </Text>

                    <View style={styles.placeholderButton} />
                </View>

                <View style={{ paddingHorizontal: 24, paddingBottom: 20 }}>
                    <FilterChips
                        filters={filters}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                    />
                </View>

                <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
                    {filteredPractices.map((practice) => (
                        <PracticeCard
                            key={practice.id}
                            practice={practice}
                            audioDuration={audioDurations[practice.id]}
                            onBeginJourney={handleBeginJourney}
                        />
                    ))}
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