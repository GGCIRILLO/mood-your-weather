import { View, Text, ScrollView, Pressable, ImageBackground, Switch, Alert, Linking } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  CaretLeft,
  DotsThreeVertical,
  CloudRain,
  CloudLightning,
  Diamond,
  ArrowRight,
  Moon,
  Palette,
  StopCircle,
  BellRinging,
  PaperPlaneRight,
  Heart,
  Cloud,
  Table,
  DownloadSimple,
  Lock,
  Trash,
  Star,
  Envelope,
  CaretRight,
  PencilSimple,
  SignOut
} from "phosphor-react-native";
import { useAuth } from "@/contexts/authContext";
import { logout as authLogout } from "@/services/auth.service";
import { storageService } from "@/services/storage.service";
import { useColorScheme } from "nativewind";


export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { colorScheme, setColorScheme } = useColorScheme();

  // State for toggles
  const [reduceMotion, setReduceMotion] = useState(false);
  const [smartReminder, setSmartReminder] = useState(true);

  const handleLogout = async () => {
    Alert.alert("Close Weather Station", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          const result = await authLogout();
          if (result.success) {
            router.replace("/(auth)/login");
          }
        },
      },
    ]);
  };

  const handleClearData = async () => {
    Alert.alert(
      "Delete All Data",
      "This will permanently delete all your mood entries. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await storageService.clearAll();
            router.replace("/(onboarding)/splash");
          },
        },
      ],
    );
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#0b1121" }}>
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 12,
        paddingBottom: 12,
        paddingHorizontal: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(11, 17, 33, 0.95)",
        zIndex: 50
      }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: "rgba(255,255,255,0.05)" }}>
          <CaretLeft size={24} color="white" />
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", letterSpacing: 0.5 }}>Profile and Settings</Text>
        <Pressable style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: "rgba(255,255,255,0.05)" }}>
          <DotsThreeVertical size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Profile */}
        <View style={{ alignItems: "center", paddingVertical: 24, paddingHorizontal: 16 }}>
          <View style={{ position: "relative", marginBottom: 16 }}>
            <View style={{ position: "absolute", inset: 0, backgroundColor: "#38bdf8", borderRadius: 9999, opacity: 0.2, transform: [{ scale: 1.2 }] }} />
            <View style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: "#0b1121", overflow: "hidden", backgroundColor: "#163a5f" }}>
              {user?.photoURL ? (
                <ImageBackground source={{ uri: user.photoURL }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <ImageBackground source={{ uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" }} style={{ width: "100%", height: "100%" }} />
              )}
            </View>
            <View style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#38bdf8", padding: 6, borderRadius: 20, borderWidth: 4, borderColor: "#0b1121" }}>
              <CloudRain size={16} color="#0b1121" weight="fill" />
            </View>
          </View>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 4 }}>
            {user?.displayName || "Alex Storm"}
          </Text>
          <Text style={{ color: "#7dd3fc", fontSize: 14, opacity: 0.7, fontWeight: "500", marginBottom: 16 }}>Weather Tracker since Oct 2023</Text>

          <Pressable
            onPress={() => Alert.alert("Edit Profile", "Feature coming soon!")}
            style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(56, 189, 248, 0.1)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "rgba(56, 189, 248, 0.2)" }}
          >
            <PencilSimple size={16} color="#38bdf8" />
            <Text style={{ color: "#38bdf8", fontSize: 14, fontWeight: "600" }}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Stats Grid */}
        <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: "#162032", padding: 16, borderRadius: 20, alignItems: "center", borderWidth: 1, borderColor: "rgba(56, 189, 248, 0.1)" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>428</Text>
              <Text style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontWeight: "500" }}>Entries</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "#162032", padding: 16, borderRadius: 20, alignItems: "center", borderWidth: 1, borderColor: "rgba(56, 189, 248, 0.1)" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: "#38bdf8" }}>12</Text>
              <Text style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontWeight: "500" }}>Day Streak</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "#162032", padding: 16, borderRadius: 20, alignItems: "center", borderWidth: 1, borderColor: "rgba(56, 189, 248, 0.1)" }}>
              <CloudLightning size={28} color="#60a5fa" weight="fill" style={{ marginBottom: 4 }} />
              <Text style={{ fontSize: 12, color: "#94a3b8", fontWeight: "500" }}>Fav Weather</Text>
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", textTransform: "uppercase", paddingHorizontal: 24, marginBottom: 12, letterSpacing: 1 }}>Appearance</Text>
          <View style={{ backgroundColor: "#162032", marginHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
            {/* Theme */}
            <View style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Moon size={24} color="#94a3b8" />
                <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>App Theme</Text>
              </View>
              <View style={{ flexDirection: "row", backgroundColor: "rgba(0,0,0,0.3)", padding: 4, borderRadius: 9999 }}>
                <Pressable
                  onPress={() => setColorScheme("light")}
                  style={{
                    backgroundColor: colorScheme === "light" ? "#38bdf8" : "transparent",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 9999
                  }}
                >
                  <Text style={{
                    color: colorScheme === "light" ? "#0b1121" : "#94a3b8",
                    fontSize: 12,
                    fontWeight: colorScheme === "light" ? "bold" : "600"
                  }}>Light</Text>
                </Pressable>
                <Pressable
                  onPress={() => setColorScheme("dark")}
                  style={{
                    backgroundColor: colorScheme === "dark" ? "#38bdf8" : "transparent",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 9999
                  }}
                >
                  <Text style={{
                    color: colorScheme === "dark" ? "#0b1121" : "#94a3b8",
                    fontSize: 12,
                    fontWeight: colorScheme === "dark" ? "bold" : "600"
                  }}>Dark</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Forecast Alerts */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", textTransform: "uppercase", paddingHorizontal: 24, marginBottom: 12, letterSpacing: 1 }}>Forecast Alerts</Text>
          <View style={{ backgroundColor: "#162032", marginHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <View style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" }}>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <BellRinging size={24} color="#94a3b8" />
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>Smart Reminder</Text>
                </View>
                <Text style={{ color: "#94a3b8", fontSize: 12, paddingLeft: 36, marginTop: 4 }}>Based on your activity patterns</Text>
              </View>
              <Switch
                value={smartReminder}
                onValueChange={setSmartReminder}
                trackColor={{ false: "#334155", true: "#38bdf8" }}
                thumbColor="white"
              />
            </View>
            <View style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" }}>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "500", paddingLeft: 36 }}>Daily Check-in</Text>
              <View style={{ backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
                <Text style={{ color: "white", fontFamily: "Courier", fontWeight: "bold" }}>09 : 30 AM</Text>
              </View>
            </View>
            <Pressable style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <PaperPlaneRight size={16} color="#38bdf8" />
              <Text style={{ color: "#38bdf8", fontWeight: "600" }}>Send Test Notification</Text>
            </Pressable>
          </View>
        </View>

        {/* Integrations */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", textTransform: "uppercase", paddingHorizontal: 24, marginBottom: 12, letterSpacing: 1 }}>Integrations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
            {/* HealthKit */}
            <View style={{ width: 140, height: 140, backgroundColor: "#162032", borderRadius: 20, padding: 16, justifyContent: "space-between", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(239, 68, 68, 0.2)", alignItems: "center", justifyContent: "center" }}>
                <Heart size={20} color="#ef4444" weight="fill" />
              </View>
              <View>
                <Text style={{ color: "white", fontWeight: "bold", marginBottom: 4 }}>HealthKit</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#22c55e" }} />
                  <Text style={{ color: "#22c55e", fontSize: 10, fontWeight: "bold" }}>Connected</Text>
                </View>
              </View>
            </View>
            {/* Weather API */}
            <View style={{ width: 140, height: 140, backgroundColor: "#162032", borderRadius: 20, padding: 16, justifyContent: "space-between", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(59, 130, 246, 0.2)", alignItems: "center", justifyContent: "center" }}>
                <Cloud size={20} color="#3b82f6" weight="fill" />
              </View>
              <View>
                <Text style={{ color: "white", fontWeight: "bold", marginBottom: 4 }}>Weather API</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#22c55e" }} />
                  <Text style={{ color: "#22c55e", fontSize: 10, fontWeight: "bold" }}>Connected</Text>
                </View>
              </View>
            </View>
            {/* Sheets */}
            <View style={{ width: 140, height: 140, backgroundColor: "#162032", borderRadius: 20, padding: 16, justifyContent: "space-between", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(34, 197, 94, 0.2)", alignItems: "center", justifyContent: "center" }}>
                <Table size={20} color="#22c55e" weight="fill" />
              </View>
              <View>
                <Text style={{ color: "white", fontWeight: "bold", marginBottom: 4 }}>Sheets</Text>
                <Text style={{ color: "#94a3b8", fontSize: 10, fontWeight: "500" }}>Tap to connect</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Data & Privacy */}
        <View style={{ marginBottom: 40 }}>
          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", textTransform: "uppercase", paddingHorizontal: 24, marginBottom: 12, letterSpacing: 1 }}>Data & Privacy</Text>
          <View style={{ backgroundColor: "#162032", marginHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <Pressable onPress={() => Alert.alert("Export Data", "Coming soon!")} style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <DownloadSimple size={24} color="#94a3b8" />
                <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>Export All Data</Text>
              </View>
              <CaretRight size={16} color="#94a3b8" />
            </Pressable>
            <View style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Lock size={24} color="#38bdf8" weight="fill" />
                <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>End-to-End Encryption</Text>
              </View>
              <View style={{ backgroundColor: "rgba(56, 189, 248, 0.2)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                <Text style={{ color: "#38bdf8", fontSize: 12, fontWeight: "bold" }}>Active</Text>
              </View>
            </View>
            <Pressable onPress={handleLogout} style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
              <SignOut size={24} color="#ef4444" weight="fill" />
              <Text style={{ color: "#ef4444", fontSize: 16, fontWeight: "500" }}>Log Out</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View style={{ alignItems: "center", gap: 16, paddingBottom: 24 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#94a3b8", borderWidth: 2, borderColor: "#0b1121", marginLeft: 0 }} />
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#cbd5e1", borderWidth: 2, borderColor: "#0b1121", marginLeft: -8 }} />
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#e2e8f0", borderWidth: 2, borderColor: "#0b1121", marginLeft: -8 }} />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#94a3b8", fontSize: 14 }}> version 1.0.0</Text>
            <Text style={{ color: "#64748b", fontSize: 12 }}>Designed with ❤️ LVM</Text>
          </View>


        </View>
      </ScrollView >
    </View >
  );
}
