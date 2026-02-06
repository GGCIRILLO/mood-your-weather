
import React from "react";
import { View, Pressable } from "react-native";
import { UserIcon, GearIcon } from "phosphor-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const DashboardHeader = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingBottom: 16,
      }}
    >
      <View className="flex-row items-center gap-3">
        {/* Profile Avatar */}
        <Pressable
          onPress={() => router.push("/profile")}
          className="size-10 rounded-full bg-white/10 items-center justify-center"
        >
          <UserIcon size={24} color="white" weight="bold" />
        </Pressable>
      </View>

      {/* Settings Button */}
      <Pressable className="size-10 rounded-full bg-white/10 items-center justify-center active:bg-white/20">
        <GearIcon size={24} color="white" weight="bold" />
      </Pressable>
    </View>
  );
};
