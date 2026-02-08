import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ArrowLeft,
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
  X,
  UserCircle,
  SunIcon,
  CloudSunIcon,
  CloudIcon,
} from "phosphor-react-native";
import { useAuth } from "@/contexts/authContext";
import {
  logout as authLogout,
  updateUserProfile,
  updateUserPassword,
} from "@/services/auth.service";
import { storageService } from "@/services/storage.service";
import { useUserStats } from "@/hooks/api/useStats";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  requestNotificationPermissions,
  scheduleDailyNotification,
  cancelDailyNotification,
  saveNotificationSettings,
  getNotificationSettings,
  restoreNotificationSettings,
  sendTestNotification,
} from "@/services/notification.service";
import {
  useExportToCSV,
  useExportToGoogleSheets,
} from "@/hooks/api/useExport";

const PROFILE_IMAGE_KEY = "@mood_weather:profile_image";

// Map weather emojis to Phosphor icons
const WEATHER_ICON_MAP: Record<string, any> = {
  sunny: SunIcon,
  partly: CloudSunIcon,
  cloudy: CloudIcon,
  rainy: CloudRain,
  stormy: CloudLightning,
};

// Map weather emojis to colors
const WEATHER_COLOR_MAP: Record<string, string> = {
  sunny: "#fbbf24",
  partly: "#ffffff",
  cloudy: "#9ca3af",
  rainy: "#60a5fa",
  stormy: "#a78bfa",
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useUserStats();
  const { mutate: exportToCSV, isPending: isExportingCSV } = useExportToCSV();
  const {
    mutate: exportToGoogleSheets,
    isPending: isExportingSheets,
  } = useExportToGoogleSheets();

  const isExporting = isExportingCSV || isExportingSheets;

  // State for toggles
  const [reduceMotion, setReduceMotion] = useState(false);
  const [smartReminder, setSmartReminder] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Time picker state
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Modal State
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load saved profile image and notification settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load profile image
        const savedImage = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
        if (savedImage) {
          setProfileImage(savedImage);
        }

        // Load notification settings
        const notificationSettings = await getNotificationSettings();
        setSmartReminder(notificationSettings.enabled);
        setReminderTime(notificationSettings.time);

        // Restore notification schedule
        await restoreNotificationSettings();
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      // Save to AsyncStorage
      try {
        await AsyncStorage.setItem(PROFILE_IMAGE_KEY, uri);
      } catch (error) {
        console.error("Error saving profile image:", error);
      }
    }
  };

  const handleTimeChange = async (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedTime && smartReminder) {
      setReminderTime(selectedTime);

      // Re-schedule notification with new time
      const hour = selectedTime.getHours();
      const minute = selectedTime.getMinutes();
      await scheduleDailyNotification(hour, minute);

      // Save new time
      await saveNotificationSettings(true, selectedTime);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleToggleSmartReminder = async (enabled: boolean) => {
    try {
      if (enabled) {
        // Request permissions
        const hasPermission = await requestNotificationPermissions();

        if (!hasPermission) {
          Alert.alert(
            "Permission Required",
            "Please enable notifications in your device settings to use this feature.",
          );
          return;
        }

        // Schedule notification with current time
        const hour = reminderTime.getHours();
        const minute = reminderTime.getMinutes();
        await scheduleDailyNotification(hour, minute);

        // Save settings
        await saveNotificationSettings(true, reminderTime);

        setSmartReminder(true);
        Alert.alert(
          "Reminder Enabled",
          `You'll receive a daily reminder at ${formatTime(reminderTime)}`,
        );
      } else {
        // Cancel notification
        await cancelDailyNotification();
        await saveNotificationSettings(false, reminderTime);

        setSmartReminder(false);
        Alert.alert("Reminder Disabled", "Daily reminder has been disabled.");
      }
    } catch (error) {
      console.error("Error toggling reminder:", error);
      Alert.alert(
        "Error",
        "Failed to update reminder settings. Please try again.",
      );
    }
  };

  const handleSendTestNotification = async () => {
    try {
      const hasPermission = await requestNotificationPermissions();

      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings.",
        );
        return;
      }

      await sendTestNotification();
      Alert.alert(
        "Test Sent",
        "Check your notifications! You should receive a test notification now.",
      );
    } catch (error) {
      console.error("Error sending test notification:", error);
      Alert.alert(
        "Error",
        "Failed to send test notification. Please try again.",
      );
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
      Alert.alert(
        "Success",
        "Password updated successfully. Please login again.",
      );
      setShowPasswordModal(false);
      setNewPassword("");
      setCurrentPassword("");
      await authLogout();
      router.replace("/(auth)/login");
    } else {
      Alert.alert(
        "Error",
        result.error ||
          "Failed to update password. You may need to logout and login again.",
      );
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

  const handleExportData = async () => {
    Alert.alert(
      "Export Data",
      "Choose your export format:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "CSV File",
          onPress: () => {
            exportToCSV(undefined, {
              onSuccess: () => {
                Alert.alert(
                  "Success",
                  "Your data has been exported to CSV successfully!",
                );
              },
              onError: (error: Error) => {
                Alert.alert(
                  "Export Failed",
                  error.message || "Failed to export data. Please try again.",
                );
              },
            });
          },
        },
        {
          text: "Google Sheets",
          onPress: () => {
            exportToGoogleSheets(undefined, {
              onSuccess: (data) => {
                if (data.url) {
                  Alert.alert(
                    "Success",
                    `Your data has been exported to Google Sheets!\n\nURL: ${data.url}`,
                    [
                      {
                        text: "OK",
                        style: "default",
                      },
                    ],
                  );
                } else {
                  Alert.alert(
                    "Success",
                    data.message || "Data exported to Google Sheets!",
                  );
                }
              },
              onError: (error: Error) => {
                Alert.alert(
                  "Export Failed",
                  error.message || "Failed to export to Google Sheets.",
                );
              },
            });
          },
        },
      ],
    );
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

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
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
              PROFILE
            </Text>
            <View style={{ width: 48 }} />
          </View>

          {/* Profile Profile */}
          <View
            style={{
              alignItems: "center",
              paddingVertical: 24,
              paddingHorizontal: 16,
            }}
          >
            <View style={{ position: "relative", marginBottom: 16 }}>
              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#135bec",
                  borderRadius: 9999,
                  opacity: 0.2,
                  transform: [{ scale: 1.2 }],
                }}
              />
              <Pressable
                onPress={handlePickImage}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  borderWidth: 4,
                  borderColor: "#0b1121",
                  overflow: "hidden",
                  backgroundColor: "#163a5f",
                }}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UserCircle
                      size={80}
                      color="rgba(255,255,255,0.3)"
                      weight="fill"
                    />
                  </View>
                )}
              </Pressable>
              <Pressable
                onPress={handlePickImage}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#135bec",
                  padding: 6,
                  borderRadius: 20,
                  borderWidth: 4,
                  borderColor: "#0b1121",
                }}
              >
                <PencilSimple size={16} color="white" weight="fill" />
              </Pressable>
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                marginBottom: 4,
              }}
            >
              {user?.displayName || "Alex Storm"}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#192233",
                  padding: 16,
                  borderRadius: 20,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(19, 91, 236, 0.1)",
                }}
              >
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
                >
                  {stats?.totalEntries || 0}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#92a4c9",
                    marginTop: 4,
                    fontWeight: "500",
                  }}
                >
                  Entries
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#192233",
                  padding: 16,
                  borderRadius: 20,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(19, 91, 236, 0.1)",
                }}
              >
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#135bec" }}
                >
                  {stats?.currentStreak || 0}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#92a4c9",
                    marginTop: 4,
                    fontWeight: "500",
                  }}
                >
                  Day Streak
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#192233",
                  padding: 16,
                  borderRadius: 20,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(19, 91, 236, 0.1)",
                }}
              >
                {stats?.dominantMood &&
                  (() => {
                    const Icon =
                      WEATHER_ICON_MAP[stats.dominantMood] || CloudIcon;
                    const iconColor =
                      WEATHER_COLOR_MAP[stats.dominantMood] || "#60a5fa";
                    return (
                      <Icon
                        size={28}
                        color={iconColor}
                        weight="fill"
                        style={{ marginBottom: 4 }}
                      />
                    );
                  })()}
                {!stats?.dominantMood && (
                  <CloudLightning
                    size={28}
                    color="#a78bfa"
                    weight="fill"
                    style={{ marginBottom: 4 }}
                  />
                )}
                <Text
                  style={{ fontSize: 12, color: "#92a4c9", fontWeight: "500" }}
                >
                  Fav Weather
                </Text>
              </View>
            </View>
          </View>

          {/* Account Settings */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                color: "#94a3b8",
                fontSize: 12,
                fontWeight: "bold",
                textTransform: "uppercase",
                paddingHorizontal: 24,
                marginBottom: 12,
                letterSpacing: 1,
              }}
            >
              Account Settings
            </Text>
            <View
              style={{
                backgroundColor: "#192233",
                marginHorizontal: 16,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#1e293b",
                overflow: "hidden",
              }}
            >
              <Pressable
                onPress={() => setShowNameModal(true)}
                style={{
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#1e293b",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "500" }}
                >
                  Change Name
                </Text>
                <CaretRight size={16} color="#94a3b8" />
              </Pressable>

              <Pressable
                onPress={() => setShowPasswordModal(true)}
                style={{
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "500" }}
                >
                  Change Password
                </Text>
                <CaretRight size={16} color="#94a3b8" />
              </Pressable>
            </View>
          </View>

          {/* Forecast Alerts */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                color: "#94a3b8",
                fontSize: 12,
                fontWeight: "bold",
                textTransform: "uppercase",
                paddingHorizontal: 24,
                marginBottom: 12,
                letterSpacing: 1,
              }}
            >
              Forecast Alerts
            </Text>
            <View
              style={{
                backgroundColor: "#192233",
                marginHorizontal: 16,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#1e293b",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: smartReminder ? 1 : 0,
                  borderBottomColor: "#1e293b",
                }}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <BellRinging size={24} color="#94a3b8" />
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      Smart Reminder
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "#94a3b8",
                      fontSize: 12,
                      paddingLeft: 36,
                      marginTop: 4,
                    }}
                  >
                    Based on your activity patterns
                  </Text>
                </View>
                <Switch
                  value={smartReminder}
                  onValueChange={handleToggleSmartReminder}
                  trackColor={{ false: "#334155", true: "#135bec" }}
                  thumbColor="white"
                />
              </View>

              {smartReminder && (
                <>
                  <Pressable
                    onPress={() => setShowTimePicker(true)}
                    style={{
                      padding: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottomWidth: 1,
                      borderBottomColor: "#1e293b",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                        fontWeight: "500",
                        paddingLeft: 36,
                      }}
                    >
                      Daily Check-in
                    </Text>
                    <View
                      style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Courier",
                          fontWeight: "bold",
                        }}
                      >
                        {formatTime(reminderTime)}
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    onPress={handleSendTestNotification}
                    style={{
                      padding: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <PaperPlaneRight size={16} color="#135bec" />
                    <Text style={{ color: "#135bec", fontWeight: "600" }}>
                      Send Test Notification
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>

          {/* Data & Privacy */}
          <View style={{ marginBottom: 40 }}>
            <Text
              style={{
                color: "#94a3b8",
                fontSize: 12,
                fontWeight: "bold",
                textTransform: "uppercase",
                paddingHorizontal: 24,
                marginBottom: 12,
                letterSpacing: 1,
              }}
            >
              Data & Privacy
            </Text>
            <View
              style={{
                backgroundColor: "#192233",
                marginHorizontal: 16,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#1e293b",
                overflow: "hidden",
              }}
            >
              <Pressable
                onPress={handleExportData}
                disabled={isExporting}
                style={{
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#1e293b",
                  opacity: isExporting ? 0.5 : 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <DownloadSimple size={24} color="#94a3b8" />
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "500" }}
                  >
                    {isExporting ? "Exporting..." : "Export All Data"}
                  </Text>
                </View>
                <CaretRight size={16} color="#94a3b8" />
              </Pressable>

              <Pressable
                onPress={handleLogout}
                style={{
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <SignOut size={24} color="#ef4444" weight="fill" />
                <Text
                  style={{ color: "#ef4444", fontSize: 16, fontWeight: "500" }}
                >
                  Log Out
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <View style={{ alignItems: "center", gap: 16, paddingBottom: 24 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#94a3b8", fontSize: 14 }}>
                {" "}
                version 1.0.0
              </Text>
              <Text style={{ color: "#64748b", fontSize: 12 }}>
                Designed with ❤️ LVM
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Change Name Modal */}
        <Modal
          visible={showNameModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowNameModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: "85%",
                backgroundColor: "#192233",
                borderRadius: 24,
                padding: 24,
                borderWidth: 1,
                borderColor: "#1e293b",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                >
                  Change Name
                </Text>
                <Pressable onPress={() => setShowNameModal(false)}>
                  <X size={24} color="#94a3b8" />
                </Pressable>
              </View>
              <Text style={{ color: "#94a3b8", marginBottom: 16 }}>
                Enter your new display name.
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#0b1121",
                  color: "white",
                  padding: 16,
                  borderRadius: 16,
                  marginBottom: 24,
                  borderWidth: 1,
                  borderColor: "#1e293b",
                }}
                value={newName}
                onChangeText={setNewName}
                placeholder="Display Name"
                placeholderTextColor="#64748b"
              />
              <Pressable
                onPress={handleUpdateName}
                disabled={isLoading}
                style={{
                  backgroundColor: "#135bec",
                  padding: 16,
                  borderRadius: 16,
                  alignItems: "center",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  {isLoading ? "Updating..." : "Update Name"}
                </Text>
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: "85%",
                backgroundColor: "#192233",
                borderRadius: 24,
                padding: 24,
                borderWidth: 1,
                borderColor: "#1e293b",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                >
                  Change Password
                </Text>
                <Pressable onPress={() => setShowPasswordModal(false)}>
                  <X size={24} color="#94a3b8" />
                </Pressable>
              </View>
              <Text style={{ color: "#94a3b8", marginBottom: 16 }}>
                Enter your current password and a new secure password (min 6
                chars).
              </Text>

              <TextInput
                style={{
                  backgroundColor: "#0b1121",
                  color: "white",
                  padding: 16,
                  borderRadius: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#1e293b",
                }}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current Password"
                placeholderTextColor="#64748b"
                secureTextEntry
              />

              <TextInput
                style={{
                  backgroundColor: "#0b1121",
                  color: "white",
                  padding: 16,
                  borderRadius: 16,
                  marginBottom: 24,
                  borderWidth: 1,
                  borderColor: "#1e293b",
                }}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                placeholderTextColor="#64748b"
                secureTextEntry
              />
              <Pressable
                onPress={handleUpdatePassword}
                disabled={isLoading}
                style={{
                  backgroundColor: "#135bec",
                  padding: 16,
                  borderRadius: 16,
                  alignItems: "center",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Time Picker Modal (iOS) or Inline (Android) */}
        {showTimePicker && Platform.OS === "ios" && (
          <Modal
            visible={showTimePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowTimePicker(false)}
          >
            <Pressable
              style={{
                flex: 1,
                justifyContent: "flex-end",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
              onPress={() => setShowTimePicker(false)}
            >
              <View
                style={{
                  backgroundColor: "#192233",
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 24,
                  borderTopWidth: 1,
                  borderColor: "#1e293b",
                }}
                onStartShouldSetResponder={() => true}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                  >
                    Set Reminder Time
                  </Text>
                  <Pressable onPress={() => setShowTimePicker(false)}>
                    <X size={24} color="#94a3b8" />
                  </Pressable>
                </View>

                <DateTimePicker
                  value={reminderTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  textColor="#ffffff"
                  style={{ backgroundColor: "#192233" }}
                />

                <Pressable
                  onPress={() => setShowTimePicker(false)}
                  style={{
                    backgroundColor: "#135bec",
                    padding: 16,
                    borderRadius: 16,
                    alignItems: "center",
                    marginTop: 16,
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                  >
                    Done
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Modal>
        )}

        {showTimePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
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
