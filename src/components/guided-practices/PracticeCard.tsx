import { View, Text, Pressable, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Clock, Play } from "phosphor-react-native";
import { Practice } from "@/utils/practicesData";

interface PracticeCardProps {
  practice: Practice;
  audioDuration?: string;
  onBeginJourney: (practice: Practice) => void;
}

export const PracticeCard = ({
  practice,
  audioDuration,
  onBeginJourney,
}: PracticeCardProps) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          height: 550,
          borderRadius: 40,
          overflow: "hidden",
          backgroundColor: "#192233",
        }}
      >
        <ImageBackground
          source={{ uri: practice.image }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "transparent", "rgba(11,17,33,0.95)"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <LinearGradient
            colors={["transparent", "rgba(11,17,33,0.8)"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <View
            style={{ flex: 1, padding: 32, justifyContent: "space-between" }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(25, 34, 51, 0.6)",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                  }}
                >
                  {practice.tag}
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <practice.icon
                size={84}
                color="rgba(255,255,255,0.9)"
                weight="fill"
              />
            </View>

            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 32,
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  {practice.title}
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Clock size={16} color="#92a4c9" />
                  <Text style={{ color: "#92a4c9", fontSize: 14 }}>
                    {audioDuration || practice.duration}
                  </Text>
                  <Text style={{ color: "#92a4c9", fontSize: 14 }}>•</Text>
                  <Text style={{ color: "#92a4c9", fontSize: 14 }}>
                    {practice.type}
                  </Text>
                </View>
              </View>
              <Text
                style={{ color: "#92a4c9", fontSize: 14, lineHeight: 22 }}
                numberOfLines={2}
              >
                {practice.description}
              </Text>
              <Pressable
                onPress={() => onBeginJourney(practice)}
                style={{
                  width: "100%",
                  height: 56,
                  backgroundColor: practice.color,
                  borderRadius: 28,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  shadowColor: practice.color,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.4,
                  shadowRadius: 25,
                }}
              >
                <Play size={24} color="white" weight="fill" />
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  Begin Journey
                </Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};
