import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { ArrowRightIcon } from "phosphor-react-native";
import { images } from "../../../assets";
import { LinearGradient } from "expo-linear-gradient";

interface OnboardingSlideOneProps {
  onNext: () => void;
}

export function OnboardingSlideOne({ onNext }: OnboardingSlideOneProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View className="flex-1">
      {/* Immersive Background Layer */}
      <ImageBackground
        source={images.onboarding1_bg}
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.4)"]}
          style={{ ...StyleSheet.absoluteFillObject }}
        />
      </ImageBackground>

      {/* Foreground UI Layer */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
          paddingHorizontal: 24,
          paddingBottom: isLandscape ? 24 : 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Glassmorphic Card */}
        <View
          style={{
            backgroundColor: "rgba(16, 22, 34, 0.7)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 32,
            borderRadius: isLandscape ? 32 : 40,
            padding: isLandscape ? 20 : 24,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
            maxWidth: isLandscape ? 600 : undefined,
            alignSelf: "center",
            width: "100%",
          }}
        >
          {/* Text Content */}
          <View style={{ gap: 12, marginBottom: 24 }}>
            <Text
              style={{
                fontSize: isLandscape ? 24 : 30,
                fontWeight: "bold",
                lineHeight: isLandscape ? 32 : 40,
                letterSpacing: -0.5,
                color: "white",
              }}
            >
              Your Emotions Are Like Weather
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: isLandscape ? 16 : 18,
                fontWeight: "500",
                lineHeight: isLandscape ? 22 : 28,
              }}
            >
              Sometimes stormy, sometimes sunny, always changing. Swipe to
              explore the forecast.
            </Text>
          </View>

          {/* Interactive Footer: Indicators & Action */}
          <View className="flex-row items-center justify-between pt-2">
            {/* Page Indicators */}
            <View className="flex-row items-center gap-2.5">
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
              <View className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <View className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </View>

            {/* FAB / Next Button */}
            <TouchableOpacity
              testID="next-button"
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
      </ScrollView>
    </View>
  );
}
