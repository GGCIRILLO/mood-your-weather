import { View, Text, Pressable } from "react-native";
import { CaretRight } from "phosphor-react-native";

interface AccountSettingsProps {
  onChangeName: () => void;
  onChangePassword: () => void;
}

export const AccountSettings = ({
  onChangeName,
  onChangePassword,
}: AccountSettingsProps) => {
  return (
    <View style={{ marginBottom: 32 }}>
      <Text
        style={{
          color: "#94a3b8",
          fontSize: 12,
          fontWeight: "bold",
          textTransform: "uppercase",
          paddingHorizontal: 24,
          marginBottom: 12,
          letterSpacing: 1,
        }}
      >
        Account Settings
      </Text>
      <View
        style={{
          backgroundColor: "#192233",
          marginHorizontal: 16,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#1e293b",
          overflow: "hidden",
        }}
      >
        <Pressable
          onPress={onChangeName}
          style={{
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#1e293b",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
            Change Name
          </Text>
          <CaretRight size={16} color="#94a3b8" />
        </Pressable>

        <Pressable
          onPress={onChangePassword}
          style={{
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
            Change Password
          </Text>
          <CaretRight size={16} color="#94a3b8" />
        </Pressable>
      </View>
    </View>
  );
};
