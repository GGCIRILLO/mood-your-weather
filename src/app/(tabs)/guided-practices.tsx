import { View, Text, ScrollView, Pressable, ImageBackground, TextInput, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { List, Bell, CloudLightning, CloudRain, Sun, Moon, Play, BookmarkSimple, Clock, House, Medal, User, X, CaretDown, DotsThree, Wind, Shuffle, SkipBack, SkipForward, Repeat, Pause, Cloud, ArrowRight, Quotes } from "phosphor-react-native";
import { useAuth } from "@/contexts/authContext";
import { useState, useEffect, useRef } from "react";

export default function GuidedPracticesScreen() {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const [currentScreen, setCurrentScreen] = useState<'discovery' | 'player' | 'reflection'>('discovery');
    const [activeFilter, setActiveFilter] = useState("All");
    const [sliderValue, setSliderValue] = useState(80);
    const [journalNotes, setJournalNotes] = useState("");

    // Breathing animation
    const breatheAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (currentScreen === 'player') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(breatheAnim, {
                        toValue: 1.2,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(breatheAnim, {
                        toValue: 1,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [currentScreen]);

    const practices = [
        {
            id: 1,
            title: "Thunderstorm Release",
            tag: "Anxiety Relief",
            duration: "10 min",
            type: "Deep Focus",
            description: "Let the rolling thunder wash away your stress and ground you in the present moment. Feel the electricity clear your mind.",
            icon: CloudLightning,
            image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800",
            color: "#135bec",
        },
        {
            id: 2,
            title: "Rainy Day Calm",
            tag: "Sleep Aid",
            duration: "15 min",
            type: "Relaxation",
            description: "Gentle rain sounds to help you drift into peaceful sleep. Let each drop carry away your worries.",
            icon: CloudRain,
            image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
            color: "#6366f1",
        },
    ];

    const filters = ["All", "Anxiety", "Focus", "Sleep"];

    // SCREEN 1: DISCOVERY
    if (currentScreen === 'discovery') {
        return (
            <View style={{ flex: 1, backgroundColor: "#0b1121" }}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, paddingBottom: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#192233", alignItems: "center", justifyContent: "center" }}>
                                <List size={20} color="white" />
                            </Pressable>
                            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", letterSpacing: 0.5 }}>Guided Practices</Text>
                            <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#192233", alignItems: "center", justifyContent: "center" }}>
                                <Bell size={20} color="white" />
                                <View style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: "#135bec" }} />
                            </Pressable>
                        </View>

                        {/* Filter Chips */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
                            <View style={{ flexDirection: "row", gap: 12 }}>
                                {filters.map((filter) => (
                                    <Pressable
                                        key={filter}
                                        onPress={() => setActiveFilter(filter)}
                                        style={{
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            borderRadius: 20,
                                            backgroundColor: activeFilter === filter ? "#135bec" : "#192233",
                                            shadowColor: activeFilter === filter ? "#135bec" : "transparent",
                                            shadowOffset: { width: 0, height: 0 },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 15,
                                        }}
                                    >
                                        <Text style={{ color: activeFilter === filter ? "white" : "#92a4c9", fontSize: 14, fontWeight: activeFilter === filter ? "600" : "500" }}>
                                            {filter}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Practice Cards */}
                    <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
                        {practices.map((practice, index) => (
                            <View key={practice.id} style={{ marginBottom: 20, marginTop: index === 0 ? 0 : 10 }}>
                                <View style={{ height: 550, borderRadius: 40, overflow: "hidden", backgroundColor: "#192233" }}>
                                    <ImageBackground source={{ uri: practice.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover">
                                        <LinearGradient colors={["rgba(0,0,0,0.2)", "transparent", "rgba(11,17,33,0.95)"]} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
                                        <LinearGradient colors={["transparent", "rgba(11,17,33,0.8)"]} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />

                                        <View style={{ flex: 1, padding: 32, justifyContent: "space-between" }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                <View style={{ backgroundColor: "rgba(25, 34, 51, 0.6)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)" }}>
                                                    <Text style={{ color: "white", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.5 }}>{practice.tag}</Text>
                                                </View>
                                                <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(25, 34, 51, 0.6)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)", alignItems: "center", justifyContent: "center" }}>
                                                    <BookmarkSimple size={20} color="white" />
                                                </Pressable>
                                            </View>

                                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                                <practice.icon size={84} color="rgba(255,255,255,0.9)" weight="fill" />
                                            </View>

                                            <View style={{ gap: 16 }}>
                                                <View>
                                                    <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>{practice.title}</Text>
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                                        <Clock size={16} color="#92a4c9" />
                                                        <Text style={{ color: "#92a4c9", fontSize: 14 }}>{practice.duration}</Text>
                                                        <Text style={{ color: "#92a4c9", fontSize: 14 }}>•</Text>
                                                        <Text style={{ color: "#92a4c9", fontSize: 14 }}>{practice.type}</Text>
                                                    </View>
                                                </View>
                                                <Text style={{ color: "#92a4c9", fontSize: 14, lineHeight: 22 }} numberOfLines={2}>{practice.description}</Text>
                                                <Pressable
                                                    onPress={() => setCurrentScreen('player')}
                                                    style={{
                                                        width: "100%",
                                                        height: 56,
                                                        backgroundColor: practice.color,
                                                        borderRadius: 28,
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: 8,
                                                        shadowColor: practice.color,
                                                        shadowOffset: { width: 0, height: 0 },
                                                        shadowOpacity: 0.4,
                                                        shadowRadius: 25,
                                                    }}
                                                >
                                                    <Play size={24} color="white" weight="fill" />
                                                    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Begin Journey</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Bottom Navigation */}
                <View style={{ position: "absolute", bottom: 0, width: "100%", backgroundColor: "rgba(11, 17, 33, 0.9)", borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.05)", paddingBottom: insets.bottom + 8, paddingTop: 12, paddingHorizontal: 24 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Pressable onPress={() => router.push("/")} style={{ alignItems: "center", gap: 4, padding: 8 }}>
                            <House size={24} color="#93c5fd" />
                            <Text style={{ fontSize: 10, color: "#93c5fd" }}>Home</Text>
                        </Pressable>
                        <Pressable onPress={() => router.push("/challenges-gamification")} style={{ alignItems: "center", gap: 4, padding: 8 }}>
                            <Medal size={24} color="#93c5fd" />
                            <Text style={{ fontSize: 10, color: "#93c5fd" }}>Goals</Text>
                        </Pressable>
                        <Pressable style={{ alignItems: "center", gap: 4, padding: 8, marginTop: -32 }}>
                            <View style={{ backgroundColor: "#162032", padding: 4, borderRadius: 16, borderWidth: 4, borderColor: "#0b1121" }}>
                                <View style={{ backgroundColor: "#135bec", width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
                                    <Moon size={28} color="white" weight="fill" />
                                </View>
                            </View>
                            <Text style={{ fontSize: 10, fontWeight: "bold", color: "#135bec" }}>Practice</Text>
                        </Pressable>
                        <Pressable onPress={() => router.push("/profile")} style={{ alignItems: "center", gap: 4, padding: 8 }}>
                            <User size={24} color="#93c5fd" />
                            <Text style={{ fontSize: 10, color: "#93c5fd" }}>Profile</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    }

    // SCREEN 2: PLAYER
    if (currentScreen === 'player') {
        return (
            <View style={{ flex: 1, backgroundColor: "#0b1121" }}>
                <ImageBackground
                    source={{ uri: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800" }}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                >
                    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(11,17,33,0.6)" }} />

                    <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
                        {/* Top Controls */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 40 }}>
                            <Pressable onPress={() => setCurrentScreen('discovery')} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(25, 34, 51, 0.6)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)", alignItems: "center", justifyContent: "center" }}>
                                <CaretDown size={20} color="rgba(255,255,255,0.7)" />
                            </Pressable>
                            <View style={{ backgroundColor: "rgba(25, 34, 51, 0.6)", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)", flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#ef4444" }} />
                                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 }}>Live Session</Text>
                            </View>
                            <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(25, 34, 51, 0.6)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)", alignItems: "center", justifyContent: "center" }}>
                                <DotsThree size={20} color="rgba(255,255,255,0.7)" />
                            </Pressable>
                        </View>

                        {/* Center Breathing Element */}
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <Animated.View style={{ transform: [{ scale: breatheAnim }] }}>
                                <View style={{ width: 128, height: 128, borderRadius: 64, backgroundColor: "#135bec", alignItems: "center", justifyContent: "center", shadowColor: "#135bec", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 60 }}>
                                    <Wind size={48} color="white" weight="fill" />
                                </View>
                            </Animated.View>
                            <Text style={{ marginTop: 48, color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: "500", letterSpacing: 3, textTransform: "uppercase" }}>Breathe In</Text>
                        </View>

                        {/* Bottom Player Controls */}
                        <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24, gap: 24 }}>
                            <View style={{ alignItems: "center" }}>
                                <Text style={{ color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 4 }}>Thunderstorm Release</Text>
                                <Text style={{ color: "#135bec", fontSize: 14, fontWeight: "500" }}>Nature Sounds • Focus</Text>
                            </View>

                            {/* Waveform */}
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, height: 48 }}>
                                {[3, 5, 8, 4, 6, 10, 7, 4, 8, 5, 3].map((height, i) => (
                                    <View key={i} style={{ width: 4, height: height * 4, borderRadius: 2, backgroundColor: i >= 4 && i <= 7 ? "#135bec" : "rgba(255,255,255,0.3)" }} />
                                ))}
                            </View>

                            {/* Progress */}
                            <View style={{ gap: 8 }}>
                                <View style={{ width: "100%", height: 4, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                                    <View style={{ width: "33%", height: "100%", backgroundColor: "#135bec", borderRadius: 2 }} />
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "monospace" }}>03:20</Text>
                                    <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "monospace" }}>10:00</Text>
                                </View>
                            </View>

                            {/* Controls */}
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }}>
                                <Pressable><Shuffle size={28} color="rgba(255,255,255,0.6)" /></Pressable>
                                <Pressable><SkipBack size={36} color="rgba(255,255,255,0.8)" weight="fill" /></Pressable>
                                <Pressable onPress={() => setCurrentScreen('reflection')} style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "white", alignItems: "center", justifyContent: "center", shadowColor: "white", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 30 }}>
                                    <Pause size={36} color="#0b1121" weight="fill" />
                                </Pressable>
                                <Pressable><SkipForward size={36} color="rgba(255,255,255,0.8)" weight="fill" /></Pressable>
                                <Pressable><Repeat size={28} color="rgba(255,255,255,0.6)" /></Pressable>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    // SCREEN 3: REFLECTION
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#0b1121" }}>
            <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}>
                {/* Close Button */}
                <View style={{ alignItems: "flex-end", marginBottom: 16 }}>
                    <Pressable onPress={() => setCurrentScreen('discovery')} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#192233", alignItems: "center", justifyContent: "center" }}>
                        <X size={20} color="rgba(255,255,255,0.5)" />
                    </Pressable>
                </View>

                {/* Content */}
                <View style={{ alignItems: "center", gap: 32, marginTop: 16 }}>
                    {/* Header */}
                    <View style={{ alignItems: "center", gap: 8 }}>
                        <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", textAlign: "center" }}>The skies have cleared.</Text>
                        <Text style={{ color: "#92a4c9", fontSize: 16, textAlign: "center" }}>How does your inner weather feel now?</Text>
                    </View>

                    {/* Mood Comparison */}
                    <View style={{ width: "100%", backgroundColor: "#192233", borderRadius: 32, padding: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ alignItems: "center", gap: 12, opacity: 0.5 }}>
                            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.5 }}>Before</Text>
                            <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: "#232f48", alignItems: "center", justifyContent: "center" }}>
                                <Cloud size={36} color="#92a4c9" />
                            </View>
                            <Text style={{ color: "#92a4c9", fontSize: 14 }}>Cloudy</Text>
                        </View>

                        <ArrowRight size={24} color="rgba(255,255,255,0.2)" />

                        <View style={{ alignItems: "center", gap: 12 }}>
                            <Text style={{ color: "#135bec", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1.5 }}>Now</Text>
                            <View style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: "#135bec", alignItems: "center", justifyContent: "center", shadowColor: "#135bec", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 30, borderWidth: 2, borderColor: "rgba(255,255,255,0.1)" }}>
                                <Sun size={48} color="white" weight="fill" />
                            </View>
                            <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>Clear Sky</Text>
                        </View>
                    </View>

                    {/* Slider */}
                    <View style={{ width: "100%", gap: 12 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4 }}>
                            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: "500", letterSpacing: 1.5 }}>STORMY</Text>
                            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: "500", letterSpacing: 1.5 }}>CLEAR</Text>
                        </View>
                        <View style={{ width: "100%", height: 56, backgroundColor: "#192233", borderRadius: 28, justifyContent: "center", paddingHorizontal: 16 }}>
                            <View style={{ width: "100%", height: 4, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                                <View style={{ width: `${sliderValue}%`, height: "100%", backgroundColor: "#135bec", borderRadius: 2 }} />
                            </View>
                        </View>
                    </View>

                    {/* Journal Prompt */}
                    <View style={{ width: "100%", gap: 12 }}>
                        <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginLeft: 8 }}>Notes for your future self</Text>
                        <View style={{ width: "100%", minHeight: 128, backgroundColor: "#192233", borderRadius: 24, padding: 16, borderWidth: 1, borderColor: "transparent" }}>
                            <TextInput
                                value={journalNotes}
                                onChangeText={setJournalNotes}
                                multiline
                                placeholder="I noticed that when I focused on the rain sounds..."
                                placeholderTextColor="rgba(146,164,201,0.5)"
                                style={{ color: "#92a4c9", fontSize: 14, lineHeight: 22, minHeight: 96 }}
                            />
                        </View>
                    </View>

                    {/* Quote Card */}
                    <View style={{ width: "100%", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", borderRadius: 24, padding: 24, backgroundColor: "#192233" }}>
                        <Quotes size={32} color="rgba(19,91,236,0.4)" weight="fill" style={{ marginBottom: 8 }} />
                        <Text style={{ color: "white", fontSize: 18, fontStyle: "italic", lineHeight: 28, fontWeight: "300" }}>
                            "The storm is an artist; the rainbow is its masterpiece."
                        </Text>
                        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: "500", letterSpacing: 2, textTransform: "uppercase", textAlign: "right", marginTop: 12 }}>
                            — Matshona Dhliwayo
                        </Text>
                    </View>

                    {/* Complete Button */}
                    <Pressable
                        onPress={() => setCurrentScreen('discovery')}
                        style={{ width: "100%", height: 56, backgroundColor: "white", borderRadius: 28, alignItems: "center", justifyContent: "center", marginTop: 16 }}
                    >
                        <Text style={{ color: "#0b1121", fontSize: 18, fontWeight: "bold" }}>Complete Session</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}
