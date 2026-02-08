import { View, Text, Pressable, Switch } from "react-native";
import { BellRinging, PaperPlaneRight } from "phosphor-react-native";

interface ForecastAlertsProps {
  smartReminder: boolean;
  reminderTime: Date;
  formatTime: (date: Date) => string;
  onToggleReminder: (enabled: boolean) => void;
  onSetTime: () => void;
  onSendTest: () => void;
}

export const ForecastAlerts = ({
  smartReminder,
  reminderTime,
  formatTime,
  onToggleReminder,
  onSetTime,
  onSendTest,
}: ForecastAlertsProps) => {
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
        Forecast Alerts
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
        <View
          style={{
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: smartReminder ? 1 : 0,
            borderBottomColor: "#1e293b",
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <BellRinging size={24} color="#94a3b8" />
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                Smart Reminder
              </Text>
            </View>
            <Text
              style={{
                color: "#94a3b8",
                fontSize: 12,
                paddingLeft: 36,
                marginTop: 4,
              }}
            >
              Based on your activity patterns
            </Text>
          </View>
          <Switch
            value={smartReminder}
            onValueChange={onToggleReminder}
            trackColor={{ false: "#334155", true: "#135bec" }}
            thumbColor="white"
          />
        </View>

        {smartReminder && (
          <>
            <Pressable
              onPress={onSetTime}
              style={{
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#1e293b",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "500",
                  paddingLeft: 36,
                }}
              >
                Daily Check-in
              </Text>
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Courier",
                    fontWeight: "bold",
                  }}
                >
                  {formatTime(reminderTime)}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={onSendTest}
              style={{
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <PaperPlaneRight size={16} color="#135bec" />
              <Text style={{ color: "#135bec", fontWeight: "600" }}>
                Send Test Notification
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};
