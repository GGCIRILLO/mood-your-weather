import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  PlusCircleIcon,
  NotePencilIcon,
  ChartLineUpIcon,
} from "phosphor-react-native";
import { router } from "expo-router";

export const QuickActionButtons = () => {
  return (
    <View className="px-4 mb-8">
      <View className="flex-row gap-3">
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/mood-entry")}
        >
          <PlusCircleIcon size={20} color="white" weight="bold" />
          <Text className="text-white font-bold ml-1">Log Mood</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/journal")}
          style={styles.secondaryButton}
        >
          <NotePencilIcon size={20} color="white" weight="bold" />
          <Text className="text-white font-bold ml-1">Journal</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/insights")}
        >
          <ChartLineUpIcon size={20} color="white" weight="bold" />
          <Text className="text-white font-bold ml-1">Insights</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    flex: 1,
    backgroundColor: "rgba(19, 91, 236, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#135bec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  secondaryButton: {
    flex: 1,
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
  },
});
