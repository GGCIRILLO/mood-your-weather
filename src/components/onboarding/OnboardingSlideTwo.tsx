import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  ArrowRightIcon,
  CloudIcon,
  SunIcon,
  LightningIcon,
  CloudRainIcon,
  DotsNineIcon,
} from "phosphor-react-native";
import { images } from "../../../assets"; // Assicurati che il percorso sia corretto
import { LinearGradient } from "expo-linear-gradient";
import BlueGlow from "../ui/BlueGlow";

interface OnboardingSlideTwoProps {
  onNext: () => void;
}

export function OnboardingSlideTwo({ onNext }: OnboardingSlideTwoProps) {
  return (
    <View className="flex-1 bg-[#101622]">
      {/* === TOP HALF: External World (Sunny) === */}
      <View
        style={{
          height: "45%",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        <ImageBackground
          source={images.onboarding2_bg}
          className="flex-1"
          resizeMode="cover"
        >
          {/* Warm Gradient Overlay */}
          <LinearGradient
            colors={[
              "rgba(0, 0, 0, 0.1)",
              "rgba(0, 0, 0, 0.4)",
              "rgba(0, 0, 0, 0.7)",
            ]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* External Text Label */}
          <View className="absolute bottom-8 right-6 items-end">
            <Text className="text-white text-3xl font-bold">External</Text>
            <Text className="text-white/90 text-xl font-light">
              Sunny & Bright
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* === BOTTOM HALF: Internal World (Dark) === */}
      <View className="flex-1 items-center pt-8 px-6 bg-[#101622]">
        {/* Ambient Glow */}
        <View className="absolute top-0 w-full h-full items-center justify-center pointer-events-none">
          <BlueGlow />
        </View>

        {/* Text Header */}
        <View className="items-center mb-6 z-10">
          <Text className="text-white text-3xl font-bold text-center leading-tight">
            Outer Calm,{"\n"}
            <Text style={{ color: "#135bec" }}>Inner Storm?</Text>
          </Text>
          <Text className="text-gray-400 text-base text-center mt-2 max-w-70">
            Drag the weather that matches your soul into the circle.
          </Text>
        </View>

        {/* Interactive Area (Circle + Floating Icons) */}
        <View className="relative w-full flex-1 items-center justify-center">
          {/* Drop Zone (Center Circle) */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.1)",
              borderStyle: "dashed",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          >
            <View className="w-20 h-20 rounded-full bg-[#135bec]/10 items-center justify-center">
              <DotsNineIcon
                size={32}
                color="rgba(19, 91, 236, 0.5)"
                weight="bold"
              />
            </View>
          </View>

          {/* Floating Icon: Gloom (Main Focus) */}
          <View className="absolute top-4 right-8 shadow-xl shadow-[#135bec]/30 rounded-full ">
            <View className="w-16 h-16 rounded-full bg-[#1c2536] border border-white/10 items-center justify-center">
              <CloudRainIcon size={32} color="#60a5fa" weight="fill" />
            </View>
          </View>

          {/* Floating Icon: Lightning */}
          <View className="absolute bottom-20 left-6 opacity-60">
            <View className="w-14 h-14 rounded-full bg-[#1c2536] border border-white/10 items-center justify-center">
              <LightningIcon size={24} color="#facc15" weight="fill" />
            </View>
          </View>

          {/* Floating Icon: Cloud */}
          <View className="absolute top-4 left-4 opacity-50">
            <View className="w-12 h-12 rounded-full bg-[#1c2536] border border-white/10 items-center justify-center">
              <CloudIcon size={22} color="#d1d5db" weight="fill" />
            </View>
          </View>

          {/* Floating Icon: Sun */}
          <View className="absolute bottom-16 right-4 opacity-40">
            <View className="w-10 h-10 rounded-full bg-[#1c2536] border border-white/10 items-center justify-center">
              <SunIcon size={20} color="#fdba74" weight="fill" />
            </View>
          </View>
        </View>

        {/* === FOOTER (Simple Navigation) === */}
        <View className="w-full pb-8 px-6 flex-row items-center justify-between">
          {/* Page Indicators (Step 2 Active) */}
          <View className="flex-row items-center gap-2.5">
            <View className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <View
              style={{
                shadowColor: "#135bec",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                height: 10,
                width: 32,
                borderRadius: 20,
                backgroundColor: "#135bec",
              }}
            />
            <View className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={onNext}
            activeOpacity={0.8}
            style={{
              shadowColor: "#135bec",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              height: 56,
              width: 56,
              borderRadius: 28,
              backgroundColor: "#135bec",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowRightIcon size={28} color="#fff" weight="bold" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
