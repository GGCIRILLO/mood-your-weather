// ============================================
// PROFILE SCREEN - Settings and user info
// ============================================

import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/authContext";
import { logout as authLogout } from "@/services/auth.service";
import { storageService } from "@/services/storage.service";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Logout", "Sei sicuro di voler uscire?", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          const result = await authLogout();
          if (result.success) {
            router.replace("/(auth)/login");
          } else {
            Alert.alert("Errore", "Impossibile effettuare il logout");
          }
        },
      },
    ]);
  };

  const handleResetOnboarding = async () => {
    Alert.alert("Reset Onboarding", "Vuoi rivedere il tutorial di benvenuto?", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Reset",
        onPress: async () => {
          await storageService.resetOnboarding();
          await authLogout();
          router.replace("/(onboarding)/splash");
        },
      },
    ]);
  };

  const handleClearData = async () => {
    Alert.alert(
      "Elimina Tutti i Dati",
      "Questa azione eliminerà tutti i tuoi mood entries. Non può essere annullata.",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
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
    <View className="flex-1 bg-blue-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="py-6 items-center">
          <View className="bg-blue-500 w-24 h-24 rounded-full items-center justify-center mb-4">
            <Text className="text-5xl">👤</Text>
          </View>
          <Text className="text-gray-900 text-2xl font-bold">
            {user?.displayName || user?.email?.split("@")[0] || "User"}
          </Text>
          <Text className="text-gray-600 text-base mt-1">
            {user?.email || "email@example.com"}
          </Text>
        </View>

        {/* Settings Sections */}
        <View className="bg-white rounded-3xl p-4 shadow-lg mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-4 px-2">
            Account
          </Text>

          <Pressable
            onPress={() => {}}
            className="flex-row items-center py-4 px-2 border-b border-gray-100 active:bg-gray-50"
          >
            <Text className="text-2xl mr-3">✏️</Text>
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">
                Modifica Profilo
              </Text>
              <Text className="text-gray-500 text-sm">
                Nome, email, password
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </Pressable>

          <Pressable
            onPress={() => {}}
            className="flex-row items-center py-4 px-2 active:bg-gray-50"
          >
            <Text className="text-2xl mr-3">🔔</Text>
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">Notifiche</Text>
              <Text className="text-gray-500 text-sm">
                Reminder giornalieri
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </Pressable>
        </View>

        <View className="bg-white rounded-3xl p-4 shadow-lg mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-4 px-2">App</Text>

          <Pressable
            onPress={handleResetOnboarding}
            className="flex-row items-center py-4 px-2 border-b border-gray-100 active:bg-gray-50"
          >
            <Text className="text-2xl mr-3">🎓</Text>
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">Rivedi Tutorial</Text>
              <Text className="text-gray-500 text-sm">Onboarding iniziale</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </Pressable>

          <Pressable
            onPress={() => {}}
            className="flex-row items-center py-4 px-2 border-b border-gray-100 active:bg-gray-50"
          >
            <Text className="text-2xl mr-3">🌙</Text>
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">Tema</Text>
              <Text className="text-gray-500 text-sm">Light / Dark / Auto</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </Pressable>

          <Pressable
            onPress={() => {}}
            className="flex-row items-center py-4 px-2 active:bg-gray-50"
          >
            <Text className="text-2xl mr-3">ℹ️</Text>
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">About</Text>
              <Text className="text-gray-500 text-sm">Versione 1.0.0</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </Pressable>
        </View>

        <View className="bg-white rounded-3xl p-4 shadow-lg mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-4 px-2">
            Danger Zone
          </Text>

          <Pressable
            onPress={handleClearData}
            className="flex-row items-center py-4 px-2 border-b border-gray-100 active:bg-red-50"
          >
            <Text className="text-2xl mr-3">🗑️</Text>
            <View className="flex-1">
              <Text className="text-red-600 font-medium">
                Elimina Tutti i Dati
              </Text>
              <Text className="text-gray-500 text-sm">Non reversibile</Text>
            </View>
            <Text className="text-red-400">›</Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            className="flex-row items-center py-4 px-2 active:bg-red-50"
          >
            <Text className="text-2xl mr-3">🚪</Text>
            <View className="flex-1">
              <Text className="text-red-600 font-medium">Logout</Text>
              <Text className="text-gray-500 text-sm">Esci dall'account</Text>
            </View>
            <Text className="text-red-400">›</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
