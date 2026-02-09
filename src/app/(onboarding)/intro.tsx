import { useState, useRef } from "react";
import { View, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { storageService } from "@/services/storage.service";
import {
  OnboardingSlideOne,
  OnboardingSlideTwo,
  OnboardingSlideThree,
} from "@/components/onboarding";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TOTAL_SLIDES = 3;
export default function OnboardingIntro() {
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = () => {
    if (currentIndex < TOTAL_SLIDES - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const handleComplete = async () => {
    await storageService.setOnboardingCompleted();
    router.replace("/(auth)/login");
  };

  const renderSlide = (index: number) => {
    switch (index) {
      case 0:
        return <OnboardingSlideOne onNext={handleNext} />;
      case 1:
        return <OnboardingSlideTwo onNext={handleNext} />;
      case 2:
        return <OnboardingSlideThree onFinish={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1">
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / SCREEN_WIDTH
          );
          setCurrentIndex(index);
        }}
      >
        {Array.from({ length: TOTAL_SLIDES }).map((_, index) => (
          <View key={index} style={{ width: SCREEN_WIDTH }}>
            {renderSlide(index)}
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}
