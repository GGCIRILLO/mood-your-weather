import { View, Text, ScrollView, Pressable, ImageBackground, Switch, Alert, Linking, StyleSheet, Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  CaretLeft,
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
  SignOut,
  X
} from "phosphor-react-native";
import { useAuth } from "@/contexts/authContext";
import { logout as authLogout, updateUserProfile, updateUserPassword } from "@/services/auth.service";
import { storageService } from "@/services/storage.service";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  // State for toggles
  const [reduceMotion, setReduceMotion] = useState(false);
  const [smartReminder, setSmartReminder] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Modal State
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      // Optional: Update profile photo in backend here too if needed
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    setIsLoading(true);
    const result = await updateUserProfile(newName);
    setIsLoading(false);

    if (result.success) {
      Alert.alert("Success", "Name updated successfully");
      setShowNameModal(false);
    } else {
      Alert.alert("Error", result.error || "Failed to update name");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (!currentPassword) {
      Alert.alert("Error", "Please enter your current password");
      return;
    }

    setIsLoading(true);
    const result = await updateUserPassword(newPassword, currentPassword);
    setIsLoading(false);

    if (result.success) {
      Alert.alert("Success", "Password updated successfully. Please login again.");
      setShowPasswordModal(false);
      setNewPassword("");
      setCurrentPassword("");
      await authLogout();
      router.replace("/(auth)/login");
    } else {
      Alert.alert("Error", result.error || "Failed to update password. You may need to logout and login again.");
    }
  };


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
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={styles.gradient}>
        {/* Background Blur Blobs */}
        <View style={styles.blueBlob} />
        <View style={styles.purpleBlob} />
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
          <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: "#192233" }}>
            <CaretLeft size={24} color="white" />
          </Pressable>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", letterSpacing: 0.5 }}>Profile and Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Profile Profile */}
          <View style={{ alignItems: "center", paddingVertical: 24, paddingHorizontal: 16 }}>
            <View style={{ position: "relative", marginBottom: 16 }}>
              <View style={{ position: "absolute", inset: 0, backgroundColor: "#135bec", borderRadius: 9999, opacity: 0.2, transform: [{ scale: 1.2 }] }} />
              <Pressable onPress={handlePickImage} style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: "#0b1121", overflow: "hidden", backgroundColor: "#163a5f" }}>
                {profileImage || user?.photoURL ? (
                  <ImageBackground source={{ uri: profileImage || user?.photoURL }} style={{ width: "100%", height: "100%" }} />
                ) : (
                  <ImageBackground source={{ uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" }} style={{ width: "100%", height: "100%" }} />
                )}
              </Pressable>
              <Pressable onPress={handlePickImage} style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#135bec", padding: 6, borderRadius: 20, borderWidth: 4, borderColor: "#0b1121" }}>
                <PencilSimple size={16} color="white" weight="fill" />
              </Pressable>
            </View>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 4 }}>
              {user?.displayName || "Alex Storm"}
            </Text>
            <Text style={{ color: "#7dd3fc", fontSize: 14, opacity: 0.7, fontWeight: "500", marginBottom: 16 }}>Weather Tracker since Oct 2023</Text>
          </View>

          {/* Stats Grid */}
          <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1, backgroundColor: "#192233", padding: 16, borderRadius: 20, alignItems: "center", borderWidth: 1, borderColor: "rgba(19, 91, 236, 0.1)" }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>428</Text>
                <Text style={{ fontSize: 12, color: "#92a4c9", marginTop: 4, fontWeight: "500" }}>Entries</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: "#192233", padding: 16, borderRadius: 20, alignItems: "center", borderWidth: 1, borderColor: "rgba(19, 91, 236, 0.1)" }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#135bec" }}>12</Text>
                <Text style={{ fontSize: 12, color: "#92a4c9", marginTop: 4, fontWeight: "500" }}>Day Streak</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: "#192233", padding: 16, borderRadius: 20, alignItems: "center", borderWidth: 1, borderColor: "rgba(19, 91, 236, 0.1)" }}>
                <CloudLightning size={28} color="#60a5fa" weight="fill" style={{ marginBottom: 4 }} />
                <Text style={{ fontSize: 12, color: "#92a4c9", fontWeight: "500" }}>Fav Weather</Text>
              </View>
            </View>
          </View>

          {/* Account Settings */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", textTransform: "uppercase", paddingHorizontal: 24, marginBottom: 12, letterSpacing: 1 }}>Account Settings</Text>
            <View style={{ backgroundColor: "#192233", marginHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "#1e293b", overflow: "hidden" }}>
              <Pressable onPress={() => setShowNameModal(true)} style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#1e293b" }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>Change Name</Text>
                <CaretRight size={16} color="#94a3b8" />
              </Pressable>

              <Pressable onPress={() => setShowPasswordModal(true)} style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>Change Password</Text>
                <CaretRight size={16} color="#94a3b8" />
              </Pressable>
            </View>
          </View>

          {/* Forecast Alerts */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", textTransform: "uppercase", paddingHorizontal: 24, marginBottom: 12, letterSpacing: 1 }}>Forecast Alerts</Text>
            <View style={{ backgroundColor: "#192233", marginHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "#1e293b", overflow: "hidden" }}>
              <View style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#1e293b" }}>
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
              <View style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#1e293b" }}>
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



          {/* Data & Privacy */}
          <View style={{ marginBottom: 40 }}>
            <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", textTransform: "uppercase", paddingHorizontal: 24, marginBottom: 12, letterSpacing: 1 }}>Data & Privacy</Text>
            <View style={{ backgroundColor: "#192233", marginHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "#1e293b", overflow: "hidden" }}>
              <Pressable onPress={() => Alert.alert("Export Data", "Coming soon!")} style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#1e293b" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <DownloadSimple size={24} color="#94a3b8" />
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>Export All Data</Text>
                </View>
                <CaretRight size={16} color="#94a3b8" />
              </Pressable>

              <Pressable onPress={handleLogout} style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <SignOut size={24} color="#ef4444" weight="fill" />
                <Text style={{ color: "#ef4444", fontSize: 16, fontWeight: "500" }}>Log Out</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <View style={{ alignItems: "center", gap: 16, paddingBottom: 24 }}>

            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#94a3b8", fontSize: 14 }}> version 1.0.0</Text>
              <Text style={{ color: "#64748b", fontSize: 12 }}>Designed with ❤️ LVM</Text>
            </View>


          </View>
        </ScrollView >

        {/* Change Name Modal */}
        <Modal
          visible={showNameModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowNameModal(false)}
        >
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ width: "85%", backgroundColor: "#192233", borderRadius: 24, padding: 24, borderWidth: 1, borderColor: "#1e293b" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>Change Name</Text>
                <Pressable onPress={() => setShowNameModal(false)}>
                  <X size={24} color="#94a3b8" />
                </Pressable>
              </View>
              <Text style={{ color: "#94a3b8", marginBottom: 16 }}>Enter your new display name.</Text>
              <TextInput
                style={{ backgroundColor: "#0b1121", color: "white", padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: "#1e293b" }}
                value={newName}
                onChangeText={setNewName}
                placeholder="Display Name"
                placeholderTextColor="#64748b"
              />
              <Pressable
                onPress={handleUpdateName}
                disabled={isLoading}
                style={{ backgroundColor: "#135bec", padding: 16, borderRadius: 16, alignItems: "center", opacity: isLoading ? 0.7 : 1 }}
              >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{isLoading ? "Updating..." : "Update Name"}</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          visible={showPasswordModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPasswordModal(false)}
        >
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ width: "85%", backgroundColor: "#192233", borderRadius: 24, padding: 24, borderWidth: 1, borderColor: "#1e293b" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>Change Password</Text>
                <Pressable onPress={() => setShowPasswordModal(false)}>
                  <X size={24} color="#94a3b8" />
                </Pressable>
              </View>
              <Text style={{ color: "#94a3b8", marginBottom: 16 }}>Enter your current password and a new secure password (min 6 chars).</Text>

              <TextInput
                style={{ backgroundColor: "#0b1121", color: "white", padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "#1e293b" }}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current Password"
                placeholderTextColor="#64748b"
                secureTextEntry
              />

              <TextInput
                style={{ backgroundColor: "#0b1121", color: "white", padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: "#1e293b" }}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                placeholderTextColor="#64748b"
                secureTextEntry
              />
              <Pressable
                onPress={handleUpdatePassword}
                disabled={isLoading}
                style={{ backgroundColor: "#135bec", padding: 16, borderRadius: 16, alignItems: "center", opacity: isLoading ? 0.7 : 1 }}
              >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{isLoading ? "Updating..." : "Update Password"}</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Modal>

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
