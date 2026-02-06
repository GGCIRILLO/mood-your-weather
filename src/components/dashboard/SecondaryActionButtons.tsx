import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MedalIcon, MoonIcon, CalendarIcon } from "phosphor-react-native";
import { router } from "expo-router";

export const SecondaryActionButtons = () => {
  return (
    <View className="px-4 mb-6">
      <View className="flex-row gap-3">
        <Pressable
          onPress={() => router.push("/challenges-gamification")}
          style={styles.button}
        >
          <MedalIcon size={20} color="white" weight="bold" />
          <Text className="text-white font-bold ml-1">Goals</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/guided-practices")}
          style={styles.button}
        >
          <MoonIcon size={20} color="white" weight="bold" />
          <Text className="text-white font-bold ml-1">Practice</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/calendar")}
          style={styles.button}
        >
          <CalendarIcon size={20} color="white" weight="bold" />
          <Text className="text-white font-bold ml-1">Calendar</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9999,
    flex: 1,
  },
});
