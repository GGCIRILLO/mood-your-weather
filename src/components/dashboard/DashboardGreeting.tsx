
import React from "react";
import { View, Text } from "react-native";

interface DashboardGreetingProps {
  userName: string;
}

export const DashboardGreeting = ({ userName }: DashboardGreetingProps) => {
  const greeting =
    new Date().getHours() < 12
      ? "Good Morning"
      : new Date().getHours() < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <View className="px-6 pt-2 pb-4">
      <Text
        style={{
          textShadowColor: "rgba(0,0,0,0.3)",
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 4,
          fontSize: 32,
          fontWeight: "bold",
          lineHeight: 38,
          letterSpacing: -0.5,
          color: "white",
          zIndex: 10,
        }}
      >
        {greeting}, {userName}
      </Text>
      <Text
        style={{
          textShadowColor: "rgba(0,0,0,0.3)",
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 4,
          fontSize: 18,
          fontWeight: "500",
          color: "white",
          zIndex: 10,
        }}
      >
        The sky is clearing up.
      </Text>
    </View>
  );
};
