import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import type { TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: string; // emoji
  rightIcon?: string; // emoji
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full">
      {/* Label */}
      {label && (
        <Text className="text-gray-700 font-medium mb-2 ml-1">{label}</Text>
      )}

      {/* Input container */}
      <View
        className={`flex-row items-center bg-white border-2 rounded-2xl px-4 py-3 ${
          error
            ? "border-red-400"
            : isFocused
            ? "border-blue-500"
            : "border-gray-200"
        }`}
      >
        {/* Left icon */}
        {leftIcon && <Text className="text-2xl mr-3">{leftIcon}</Text>}

        {/* Input */}
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right icon */}
        {rightIcon && (
          <Pressable onPress={onRightIconPress}>
            <Text className="text-2xl ml-3">{rightIcon}</Text>
          </Pressable>
        )}
      </View>

      {/* Error message */}
      {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}

      {/* Hint */}
      {hint && !error && (
        <Text className="text-gray-500 text-sm mt-1 ml-1">{hint}</Text>
      )}
    </View>
  );
}
