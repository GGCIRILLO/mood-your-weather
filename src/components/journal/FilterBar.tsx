import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import {
  CloudRainIcon,
  CloudLightningIcon,
  CloudIcon,
  CloudSunIcon,
  SunIcon,
} from "phosphor-react-native";
import type { MoodEmojiType } from "@/types";

interface FilterBarProps {
  visible: boolean;
  selectedFilters: MoodEmojiType[];
  onFilterToggle: (filter: MoodEmojiType) => void;
}

const FILTER_OPTIONS: {
  emoji: MoodEmojiType;
  label: string;
  icon: any;
  color: string;
}[] = [
  { emoji: "sunny", label: "Sunny", icon: SunIcon, color: "#F59E0B" },
  { emoji: "partly", label: "Partly", icon: CloudSunIcon, color: "#3B82F6" },
  { emoji: "cloudy", label: "Cloudy", icon: CloudIcon, color: "#64748B" },
  { emoji: "rainy", label: "Rainy", icon: CloudRainIcon, color: "#3B82F6" },
  {
    emoji: "stormy",
    label: "Stormy",
    icon: CloudLightningIcon,
    color: "#6366F1",
  },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  visible,
  selectedFilters,
  onFilterToggle,
}) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(heightAnim, {
          toValue: 70,
          useNativeDriver: false,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [visible, heightAnim, opacityAnim]);

  if (!visible && heightAnim._value === 0) return null;

  return (
    <Animated.View
      style={{
        height: heightAnim,
        opacity: opacityAnim,
        overflow: "hidden",
        paddingHorizontal: 20,
        marginBottom: 8,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 4,
        }}
      >
        {FILTER_OPTIONS.map((filter) => {
          const isSelected = selectedFilters.includes(filter.emoji);
          const Icon = filter.icon;
          return (
            <TouchableOpacity
              key={filter.emoji}
              onPress={() => onFilterToggle(filter.emoji)}
              activeOpacity={0.7}
              style={{ marginRight: 12 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isSelected
                    ? filter.color
                    : "rgba(100, 116, 139, 0.5)",
                  backgroundColor: isSelected
                    ? `${filter.color}20`
                    : "transparent",
                }}
              >
                <Icon
                  size={18}
                  color={isSelected ? filter.color : "rgba(255,255,255,0.6)"}
                  weight={isSelected ? "fill" : "regular"}
                />
                <Text
                  style={{
                    color: isSelected ? "white" : "rgba(255,255,255,0.6)",
                    fontSize: 15,
                    fontWeight: isSelected ? "600" : "500",
                    marginLeft: 8,
                  }}
                >
                  {filter.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};
