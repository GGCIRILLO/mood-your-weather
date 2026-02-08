import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { UserCircle, PencilSimple } from "phosphor-react-native";

interface ProfileHeaderProps {
  displayName: string;
  profileImage: string | null;
  onPickImage: () => void;
}

export const ProfileHeader = ({
  displayName,
  profileImage,
  onPickImage,
}: ProfileHeaderProps) => {
  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 24,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ position: "relative", marginBottom: 16 }}>
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#135bec",
            borderRadius: 9999,
            opacity: 0.2,
            transform: [{ scale: 1.2 }],
          }}
        />
        <Pressable
          onPress={onPickImage}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 4,
            borderColor: "#0b1121",
            overflow: "hidden",
            backgroundColor: "#163a5f",
          }}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserCircle
                size={80}
                color="rgba(255,255,255,0.3)"
                weight="fill"
              />
            </View>
          )}
        </Pressable>
        <Pressable
          onPress={onPickImage}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "#135bec",
            padding: 6,
            borderRadius: 20,
            borderWidth: 4,
            borderColor: "#0b1121",
          }}
        >
          <PencilSimple size={16} color="white" weight="fill" />
        </Pressable>
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "white",
          marginBottom: 4,
        }}
      >
        {displayName || "Alex Storm"}
      </Text>
    </View>
  );
};
