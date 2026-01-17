// ============================================
// UI COMPONENTS - Button
// ============================================

import { Pressable, Text, ActivityIndicator, View } from "react-native";
import type { PressableProps } from "react-native";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: string; // emoji
  rightIcon?: string; // emoji
}

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: "bg-blue-500 active:bg-blue-600",
    secondary: "bg-gray-500 active:bg-gray-600",
    outline: "bg-transparent border-2 border-blue-500 active:bg-blue-50",
    ghost: "bg-transparent active:bg-gray-100",
  };

  const textVariantStyles = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-blue-500",
    ghost: "text-gray-700",
  };

  const sizeStyles = {
    sm: "py-2 px-4",
    md: "py-3 px-6",
    lg: "py-4 px-8",
  };

  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <Pressable
      className={`rounded-full items-center justify-center flex-row ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${disabled ? "opacity-50" : ""}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost" ? "#3B82F6" : "#FFF"
          }
        />
      ) : (
        <View className="flex-row items-center">
          {leftIcon && <Text className="text-xl mr-2">{leftIcon}</Text>}
          <Text
            className={`font-semibold ${textVariantStyles[variant]} ${textSizeStyles[size]}`}
          >
            {title}
          </Text>
          {rightIcon && <Text className="text-xl ml-2">{rightIcon}</Text>}
        </View>
      )}
    </Pressable>
  );
}
