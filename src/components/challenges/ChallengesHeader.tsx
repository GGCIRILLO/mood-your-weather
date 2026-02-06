import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ChallengesHeader = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
      <Pressable
        onPress={() => router.back()}
        className="w-12 h-12 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
      >
        <ArrowLeftIcon size={24} color="#FFF" />
      </Pressable>

      <Text className="text-sm font-bold uppercase tracking-widest text-slate-400">
        CHALLENGES & GOALS
      </Text>

      <View className="w-12 h-12" />
    </View>
  );
};
