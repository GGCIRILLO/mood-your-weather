import { Modal, View, Text, Pressable, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { X } from "phosphor-react-native";

interface TimePickerModalProps {
  visible: boolean;
  reminderTime: Date;
  onClose: () => void;
  onTimeChange: (event: any, selectedTime?: Date) => void;
}

export const TimePickerModal = ({
  visible,
  reminderTime,
  onClose,
  onTimeChange,
}: TimePickerModalProps) => {
  if (Platform.OS === "android") {
    return visible ? (
      <DateTimePicker
        value={reminderTime}
        mode="time"
        display="default"
        onChange={onTimeChange}
      />
    ) : null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: "#192233",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            borderTopWidth: 1,
            borderColor: "#1e293b",
          }}
          onStartShouldSetResponder={() => true}
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
              Set Reminder Time
            </Text>
            <Pressable onPress={onClose}>
              <X size={24} color="#94a3b8" />
            </Pressable>
          </View>

          <DateTimePicker
            value={reminderTime}
            mode="time"
            display="spinner"
            onChange={onTimeChange}
            textColor="#ffffff"
            style={{ backgroundColor: "#192233" }}
          />

          <Pressable
            onPress={onClose}
            style={{
              backgroundColor: "#135bec",
              padding: 16,
              borderRadius: 16,
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Done
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};
