import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X } from "phosphor-react-native";

interface ChangePasswordModalProps {
  visible: boolean;
  currentPassword: string;
  newPassword: string;
  isLoading: boolean;
  onClose: () => void;
  onChangeCurrentPassword: (password: string) => void;
  onChangeNewPassword: (password: string) => void;
  onUpdate: () => void;
}

export const ChangePasswordModal = ({
  visible,
  currentPassword,
  newPassword,
  isLoading,
  onClose,
  onChangeCurrentPassword,
  onChangeNewPassword,
  onUpdate,
}: ChangePasswordModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            width: "85%",
            backgroundColor: "#192233",
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: "#1e293b",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
              Change Password
            </Text>
            <Pressable onPress={onClose} testID="close-modal-button">
              <X size={24} color="#94a3b8" />
            </Pressable>
          </View>
          <Text style={{ color: "#94a3b8", marginBottom: 16 }}>
            Enter your current password and a new secure password (min 6 chars).
          </Text>

          <TextInput
            style={{
              backgroundColor: "#0b1121",
              color: "white",
              padding: 16,
              borderRadius: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#1e293b",
            }}
            value={currentPassword}
            onChangeText={onChangeCurrentPassword}
            placeholder="Current Password"
            placeholderTextColor="#64748b"
            secureTextEntry
          />

          <TextInput
            style={{
              backgroundColor: "#0b1121",
              color: "white",
              padding: 16,
              borderRadius: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: "#1e293b",
            }}
            value={newPassword}
            onChangeText={onChangeNewPassword}
            placeholder="New Password"
            placeholderTextColor="#64748b"
            secureTextEntry
          />
          <Pressable
            onPress={onUpdate}
            disabled={isLoading}
            testID="update-button"
            style={{
              backgroundColor: "#135bec",
              padding: 16,
              borderRadius: 16,
              alignItems: "center",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              {isLoading ? "Updating..." : "Update Password"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
