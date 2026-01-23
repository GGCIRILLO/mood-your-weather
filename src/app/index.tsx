// ============================================
// APP ENTRY POINT - Check onboarding/auth
// ============================================

import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useOnboarding } from "@/hooks/storage/useStorage";
import { storageService } from "@/services/storage.service";
import { useAuth } from "@/contexts/authContext";

export default function Index() {
  const router = useRouter();
  const { onboarding, loading: onboardingLoading } = useOnboarding();
  const { user, loading: authLoading } = useAuth();
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (!onboardingLoading && !authLoading) {
      handleNavigation();
    }
  }, [onboarding, user, onboardingLoading, authLoading]);

  const handleNavigation = () => {
    // Check onboarding first
    if (!onboarding.completed) {
      router.replace("/(onboarding)/splash");
      return;
    }

    // Check authentication
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }

    // User is onboarded and authenticated
    router.replace("/(tabs)/");
  };

  const handleResetStorage = async () => {
    Alert.alert(
      "Reset Storage",
      "Vuoi cancellare tutti i dati e rifare l'onboarding?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setResetting(true);
            await storageService.clearAll();
            // Force reload by navigating to splash
            router.replace("/(onboarding)/splash");
          },
        },
      ],
    );
  };

  // Show loading screen with reset button for dev
  return (
    <View className="flex-1 items-center justify-center bg-blue-50">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-gray-600 mt-4">
        {resetting ? "Resetting..." : "Loading..."}
      </Text>

      {/* Dev Reset Button - Long press per mostrare */}
      <Pressable
        onLongPress={handleResetStorage}
        className="absolute bottom-12 px-6 py-3 bg-red-100 rounded-full active:bg-red-200"
      >
        <Text className="text-red-600 text-sm font-medium">
          🔄 Reset Storage (long press)
        </Text>
      </Pressable>
    </View>
  );
}
