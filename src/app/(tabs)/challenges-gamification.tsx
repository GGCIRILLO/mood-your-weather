import { View, Text, ScrollView, Pressable, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Drop, Thermometer, CloudLightning, ShieldCheck, Cloud, ShareNetwork, House, Medal, User, Lock } from "phosphor-react-native";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import { useAuth } from "@/contexts/authContext";

export default function ChallengesScreen() {
    const insets = useSafeAreaInsets();
    const [sensitivity, setSensitivity] = useState(5);
    const { user } = useAuth();
    const extractFirstName = (email: string | undefined) => {
        if (!email) return "Friend";
        const username = email.split("@")[0];
        const firstName = username.split(/[\.0-9]/)[0];
        return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    };
    const userName = user?.displayName || extractFirstName(user?.email);

    return (
        <View style={{ flex: 1, backgroundColor: "#0b1121" }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={{ paddingTop: insets.top + 12, backgroundColor: "rgba(11, 17, 33, 0.9)", paddingHorizontal: 16, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "rgba(255, 255, 255, 0.05)" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#38bdf8", alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: "white", fontWeight: "bold" }}>👤</Text>
                        </View>
                        <View>
                            <Text style={{ color: "#93c5fd", fontSize: 12, fontWeight: "500", textTransform: "uppercase" }}>Mood Forecast</Text>
                            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Hello, {userName}</Text>
                        </View>
                    </View>

                </View>

                <View style={{ flexDirection: "column", gap: 24, paddingHorizontal: 16, paddingTop: 24 }}>
                    {/* Active Streak Card */}
                    <View style={{ position: "relative", width: "100%", borderRadius: 24, overflow: "hidden", backgroundColor: "#162032", minHeight: 180 }}>
                        <LinearGradient colors={["#0b1121", "rgba(11, 17, 33, 0.4)", "transparent"]} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
                        <View style={{ padding: 20, flexDirection: "column", justifyContent: "space-between", minHeight: 180 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <View style={{ backgroundColor: "rgba(56, 189, 248, 0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: "rgba(56, 189, 248, 0.3)", flexDirection: "row", alignItems: "center", gap: 4 }}>
                                    <Drop size={18} color="#38bdf8" weight="fill" />
                                    <Text style={{ color: "#38bdf8", fontSize: 12, fontWeight: "bold", textTransform: "uppercase" }}>Active Streak</Text>
                                </View>
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 24 }}>4<Text style={{ fontSize: 16, fontWeight: "normal", color: "rgba(255, 255, 255, 0.7)" }}>/7 Days</Text></Text>
                            </View>
                            <View style={{ gap: 12, marginTop: 16 }}>
                                <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>7-Day Rainy Reflection</Text>
                                <Text style={{ color: "#93c5fd", fontSize: 14 }}>Keep the flow going! You're over halfway there.</Text>
                                <View style={{ width: "100%", height: 12, backgroundColor: "rgba(0, 0, 0, 0.4)", borderRadius: 6, overflow: "hidden" }}>
                                    <View style={{ height: "100%", width: "57%", backgroundColor: "#38bdf8", borderRadius: 6 }} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Weekly Goal Slider */}
                    <View style={{ backgroundColor: "#162032", borderWidth: 1, borderColor: "#253550", borderRadius: 24, padding: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>Weekly Check-in Goal</Text>
                            <Thermometer size={24} color="#93c5fd" />
                        </View>
                        <View style={{ gap: 16 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ color: "#93c5fd", fontSize: 14 }}>Relaxed</Text>
                                <Text style={{ color: "#38bdf8", fontWeight: "bold" }}>{sensitivity} Days</Text>
                                <Text style={{ color: "#93c5fd", fontSize: 14 }}>Intense</Text>
                            </View>
                            <Slider style={{ width: "100%", height: 24 }} minimumValue={1} maximumValue={7} step={1} value={sensitivity} onValueChange={setSensitivity} minimumTrackTintColor="#38bdf8" maximumTrackTintColor="#253550" thumbTintColor="#38bdf8" />
                            <Text style={{ fontSize: 12, color: "#93c5fd", textAlign: "center" }}>Drag to adjust your emotional weather sensitivity.</Text>
                        </View>
                    </View>

                    {/* Challenges Grid */}
                    <View>
                        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
                            <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>Challenges</Text>
                            <Text style={{ fontSize: 14, color: "#38bdf8", fontWeight: "500" }}>View All</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 16 }}>
                            {/* Column 1 */}
                            <View style={{ flex: 1, gap: 16 }}>
                                <View style={{ backgroundColor: "#162032", borderWidth: 1, borderColor: "#253550", borderRadius: 24, padding: 16, gap: 12 }}>
                                    <Drop size={24} color="#38bdf8" weight="fill" />
                                    <View>
                                        <Text style={{ color: "white", fontWeight: "bold" }}>Rainy Day Reflection</Text>
                                        <Text style={{ fontSize: 12, color: "#38bdf8" }}>In Progress</Text>
                                    </View>
                                    <Text style={{ fontSize: 12, color: "#93c5fd" }}>60%</Text>
                                </View>
                                <View style={{ backgroundColor: "rgba(22, 32, 50, 0.5)", borderWidth: 1, borderColor: "rgba(37, 53, 80, 0.5)", borderRadius: 24, padding: 16, gap: 12, opacity: 0.8 }}>
                                    <CloudLightning size={24} color="#93c5fd" />
                                    <View>
                                        <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: "bold" }}>Storm Survivor</Text>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                                            <Lock size={14} color="#93c5fd" />
                                            <Text style={{ fontSize: 12, color: "#93c5fd" }}>Locked</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Column 2 */}
                            <View style={{ flex: 1, gap: 16, marginTop: 32 }}>
                                <View style={{ backgroundColor: "#162032", borderWidth: 1, borderColor: "rgba(56, 189, 248, 0.3)", borderRadius: 24, padding: 16, gap: 12 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <ShieldCheck size={24} color="#38bdf8" weight="fill" />
                                        <Text style={{ color: "#38bdf8", fontSize: 10, fontWeight: "bold", backgroundColor: "rgba(56, 189, 248, 0.2)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>Done</Text>
                                    </View>
                                    <View>
                                        <Text style={{ color: "white", fontWeight: "bold" }}>Monthly Forecast</Text>
                                        <Text style={{ fontSize: 12, color: "#93c5fd" }}>30/30 Days Logged</Text>
                                    </View>
                                    <Pressable style={{ paddingVertical: 6, borderRadius: 12, backgroundColor: "rgba(37, 53, 80, 0.5)", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 4 }}>
                                        <ShareNetwork size={14} color="white" />
                                        <Text style={{ fontSize: 12, color: "white" }}>Share Badge</Text>
                                    </Pressable>
                                </View>
                                <View style={{ backgroundColor: "rgba(22, 32, 50, 0.5)", borderWidth: 1, borderColor: "rgba(37, 53, 80, 0.5)", borderRadius: 24, padding: 16, gap: 12, opacity: 0.8 }}>
                                    <Cloud size={24} color="#93c5fd" />
                                    <View>
                                        <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: "bold" }}>Cloud Spotting</Text>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                                            <Lock size={14} color="#93c5fd" />
                                            <Text style={{ fontSize: 12, color: "#93c5fd" }}>Locked</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Live Report */}
                    <View style={{ backgroundColor: "#050a14", borderRadius: 32, padding: 20, borderWidth: 1, borderColor: "#253550", marginBottom: 16 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#38bdf8" }} />
                            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#38bdf8", textTransform: "uppercase" }}>Live Report</Text>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", marginBottom: 8 }}>Community Weather</Text>
                        <Text style={{ fontSize: 14, color: "#93c5fd" }}>Global mood is 60% Rainy today. You are not alone in the rain.</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={{ position: "absolute", bottom: 0, width: "100%", backgroundColor: "rgba(11, 17, 33, 0.9)", borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.05)", paddingBottom: insets.bottom + 8, paddingTop: 12, paddingHorizontal: 24 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Pressable onPress={() => router.push("/")} style={{ alignItems: "center", gap: 4, padding: 8 }}>
                        <House size={24} color="#93c5fd" />
                        <Text style={{ fontSize: 10, color: "#93c5fd" }}>Home</Text>
                    </Pressable>
                    <Pressable style={{ alignItems: "center", gap: 4, padding: 8, marginTop: -32 }}>
                        <View style={{ backgroundColor: "#162032", padding: 4, borderRadius: 16, borderWidth: 4, borderColor: "#0b1121" }}>
                            <View style={{ backgroundColor: "#38bdf8", width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
                                <Medal size={28} color="#0b1121" weight="fill" />
                            </View>
                        </View>
                        <Text style={{ fontSize: 10, fontWeight: "bold", color: "#38bdf8" }}>Goals</Text>
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
