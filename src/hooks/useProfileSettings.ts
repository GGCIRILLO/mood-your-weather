import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  logout as authLogout,
  updateUserProfile,
  updateUserPassword,
} from "@/services/auth.service";
import { storageService } from "@/services/storage.service";
import {
  requestNotificationPermissions,
  scheduleDailyNotification,
  cancelDailyNotification,
  saveNotificationSettings,
  getNotificationSettings,
  restoreNotificationSettings,
  sendTestNotification,
} from "@/services/notification.service";
import { useExportToCSV } from "@/hooks/api/useExport";
import { useDeleteAccount } from "@/hooks/api/useUser";

const PROFILE_IMAGE_KEY = "@mood_weather:profile_image";

export const useProfileSettings = () => {
  const { mutate: exportToCSV, isPending: isExporting } = useExportToCSV();
  const { mutate: deleteAccountMutation, isPending: isDeleting } =
    useDeleteAccount();

  // State for toggles and settings
  const [reduceMotion, setReduceMotion] = useState(false);
  const [smartReminder, setSmartReminder] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Modal State
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load saved profile image and notification settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedImage = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
        if (savedImage) {
          setProfileImage(savedImage);
        }

        const notificationSettings = await getNotificationSettings();
        setSmartReminder(notificationSettings.enabled);
        setReminderTime(notificationSettings.time);

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

      const hour = selectedTime.getHours();
      const minute = selectedTime.getMinutes();
      await scheduleDailyNotification(hour, minute);
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
        const hasPermission = await requestNotificationPermissions();

        if (!hasPermission) {
          Alert.alert(
            "Permission Required",
            "Please enable notifications in your device settings to use this feature.",
          );
          return;
        }

        const hour = reminderTime.getHours();
        const minute = reminderTime.getMinutes();
        await scheduleDailyNotification(hour, minute);
        await saveNotificationSettings(true, reminderTime);

        setSmartReminder(true);
        Alert.alert(
          "Reminder Enabled",
          `You'll receive a daily reminder at ${formatTime(reminderTime)}`,
        );
      } else {
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

  const handleUpdateName = async (displayName: string) => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    setIsLoading(true);
    const result = await updateUserProfile(displayName);
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
      "Your mood entries will be exported as a CSV file.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
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
      ],
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete EVERYTHING?",
      "This will permanently delete your account, all your moods, and settings. This action is irreversible.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            deleteAccountMutation(undefined, {
              onSuccess: () => {
                Alert.alert(
                  "Account Deleted",
                  "Your account has been successfully removed.",
                );
              },
              onError: (error: Error) => {
                Alert.alert(
                  "Error",
                  error.message || "Failed to delete account",
                );
              },
            });
          },
        },
      ],
    );
  };

  return {
    // State
    reduceMotion,
    smartReminder,
    profileImage,
    reminderTime,
    showTimePicker,
    showNameModal,
    showPasswordModal,
    newName,
    newPassword,
    currentPassword,
    isLoading,
    isExporting,
    isDeleting,
    // Setters
    setReduceMotion,
    setShowTimePicker,
    setShowNameModal,
    setShowPasswordModal,
    setNewName,
    setNewPassword,
    setCurrentPassword,
    // Handlers
    handlePickImage,
    handleTimeChange,
    formatTime,
    handleToggleSmartReminder,
    handleSendTestNotification,
    handleUpdateName,
    handleUpdatePassword,
    handleLogout,
    handleExportData,
    handleDeleteAccount,
  };
};
