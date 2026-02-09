import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft } from "phosphor-react-native";
import { useAuth } from "@/contexts/authContext";
import { useUserStats } from "@/hooks/api/useStats";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import {
  ProfileHeader,
  StatsGrid,
  AccountSettings,
  ForecastAlerts,
  DataPrivacy,
  ChangeNameModal,
  ChangePasswordModal,
  TimePickerModal,
} from "@/components/profile";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { stats } = useUserStats();

  const {
    profileImage,
    smartReminder,
    reminderTime,
    showTimePicker,
    showNameModal,
    showPasswordModal,
    newName,
    newPassword,
    currentPassword,
    isLoading,
    isExporting,
    setShowTimePicker,
    setShowNameModal,
    setShowPasswordModal,
    setNewName,
    setNewPassword,
    setCurrentPassword,
    handlePickImage,
    handleTimeChange,
    formatTime,
    handleToggleSmartReminder,
    handleSendTestNotification,
    handleUpdateName,
    handleUpdatePassword,
    handleLogout,
    handleExportData,
  } = useProfileSettings();

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={styles.gradient}>
        <View style={styles.blueBlob} />
        <View style={styles.purpleBlob} />

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
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

          <ProfileHeader
            displayName={user?.displayName || ""}
            profileImage={profileImage}
            onPickImage={handlePickImage}
          />

          <StatsGrid
            totalEntries={stats?.totalEntries}
            currentStreak={stats?.currentStreak}
            dominantMood={stats?.dominantMood || undefined}
          />

          <AccountSettings
            onChangeName={() => {
              setNewName(user?.displayName || "");
              setShowNameModal(true);
            }}
            onChangePassword={() => setShowPasswordModal(true)}
          />

          <ForecastAlerts
            smartReminder={smartReminder}
            reminderTime={reminderTime}
            formatTime={formatTime}
            onToggleReminder={handleToggleSmartReminder}
            onSetTime={() => setShowTimePicker(true)}
            onSendTest={handleSendTestNotification}
          />

          <DataPrivacy
            isExporting={isExporting}
            onExportData={handleExportData}
            onLogout={handleLogout}
          />
        </ScrollView>

        <ChangeNameModal
          visible={showNameModal}
          name={newName}
          isLoading={isLoading}
          onClose={() => setShowNameModal(false)}
          onChangeName={setNewName}
          onUpdate={() => handleUpdateName(newName)}
        />

        <ChangePasswordModal
          visible={showPasswordModal}
          currentPassword={currentPassword}
          newPassword={newPassword}
          isLoading={isLoading}
          onClose={() => setShowPasswordModal(false)}
          onChangeCurrentPassword={setCurrentPassword}
          onChangeNewPassword={setNewPassword}
          onUpdate={handleUpdatePassword}
        />

        <TimePickerModal
          visible={showTimePicker}
          reminderTime={reminderTime}
          onClose={() => setShowTimePicker(false)}
          onTimeChange={handleTimeChange}
        />
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
