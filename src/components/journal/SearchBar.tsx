import React, { useEffect, useRef } from "react";
import {
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
} from "react-native";
import { MagnifyingGlassIcon, XIcon } from "phosphor-react-native";
import { LinearGradient } from "expo-linear-gradient";

interface SearchBarProps {
  visible: boolean;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onDismiss: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  visible,
  searchQuery,
  onSearchChange,
  onDismiss,
}) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(heightAnim, {
          toValue: 60,
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
      // Focus input when visible
      setTimeout(() => inputRef.current?.focus(), 100);
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
      Keyboard.dismiss();
    }
  }, [visible, heightAnim, opacityAnim]);

  const handleDismiss = () => {
    onSearchChange("");
    onDismiss();
  };

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
      <LinearGradient
        colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.08)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <MagnifyingGlassIcon
          size={20}
          color="rgba(255,255,255,0.6)"
          weight="bold"
        />
        <TextInput
          ref={inputRef}
          style={{
            flex: 1,
            color: "white",
            fontSize: 16,
            marginLeft: 12,
          }}
          placeholder="Search your reflections..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <XIcon size={20} color="rgba(255,255,255,0.6)" weight="bold" />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </Animated.View>
  );
};
