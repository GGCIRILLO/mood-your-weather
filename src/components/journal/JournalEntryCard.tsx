import React from "react";
import { View, Text } from "react-native";
import {
  SunIcon,
  CloudSunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudLightningIcon,
  MapPinIcon,
  ClockIcon,
} from "phosphor-react-native";
import type { MoodEmojiType } from "@/types";

interface JournalEntryCardProps {
  date: string;
  emojis: MoodEmojiType[];
  intensity: number;
  note: string;
  externalWeather?: {
    condition: string;
    temperature: number;
  };
  location?: string;
  time: string;
  searchQuery?: string;
  nlpSentiment?: "positive" | "negative" | "neutral";
  nlpScore?: number;
  nlpMagnitude?: number;
}

const MOOD_ICON_MAP: Record<MoodEmojiType, any> = {
  sunny: SunIcon,
  partly: CloudSunIcon,
  cloudy: CloudIcon,
  rainy: CloudRainIcon,
  stormy: CloudLightningIcon,
};

const MOOD_COLORS: Record<MoodEmojiType, string> = {
  sunny: "#F59E0B",
  partly: "#3B82F6",
  cloudy: "#64748B",
  rainy: "#3B82F6",
  stormy: "#6366F1",
};

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  date,
  emojis,
  intensity,
  note,
  externalWeather,
  location,
  time,
  searchQuery,
  nlpSentiment,
  nlpScore,
  nlpMagnitude,
}) => {
  // Format intensity as percentage
  const intensityPercent = Math.round(intensity);

  // NLP Sentiment colors
  const sentimentColors = {
    positive: "#10b981",
    negative: "#ef4444",
    neutral: "#64748b",
  };

  const sentimentLabels = {
    positive: "Positive",
    negative: "Negative",
    neutral: "Neutral",
  };

  // Highlight search query in text
  const highlightText = (text: string, query?: string) => {
    if (!query || query.trim() === "") {
      return (
        <Text style={{ color: "#e2e8f0", fontSize: 16, lineHeight: 24 }}>
          {text}
        </Text>
      );
    }

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <Text style={{ color: "#e2e8f0", fontSize: 16, lineHeight: 24 }}>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Text
              key={index}
              style={{ backgroundColor: "rgba(245, 158, 11, 0.3)" }}
            >
              {part}
            </Text>
          ) : (
            part
          ),
        )}
      </Text>
    );
  };

  return (
    <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
      <View
        style={{
          backgroundColor: "#192233",
          borderRadius: 24,
          padding: 20,
          borderWidth: 1,
          borderColor: "#1e293b",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Date and Weather Icons */}
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              color: "#94a3b8",
              fontSize: 14,
              fontWeight: "500",
              marginBottom: 8,
            }}
          >
            {date}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            {emojis.map((emoji, index) => {
              const Icon = MOOD_ICON_MAP[emoji];
              const color = MOOD_COLORS[emoji];
              return (
                <View
                  key={index}
                  style={{
                    marginRight: 8,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${color}20`,
                  }}
                >
                  <Icon size={22} color={color} weight="fill" />
                </View>
              );
            })}
            <Text
              style={{
                color: "white",
                fontSize: 16,
                marginLeft: 8,
                fontWeight: "600",
              }}
            >
              {emojis
                .map(
                  (emoji) =>
                    emoji.charAt(0).toUpperCase() +
                    emoji.slice(1).toLowerCase(),
                )
                .join(" & ")}
            </Text>
          </View>

          {/* Intensity Bar - Continuous */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "#94a3b8", fontSize: 14, marginRight: 12 }}>
              Intensity:
            </Text>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  flex: 1,
                  height: 8,
                  backgroundColor: "#334155",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${intensityPercent}%`,
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderRadius: 4,
                  }}
                />
              </View>
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  marginLeft: 8,
                  fontWeight: "600",
                }}
              >
                {intensityPercent}%
              </Text>
            </View>
          </View>

          {/* NLP Analysis Badges */}
          {nlpSentiment && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
                gap: 8,
              }}
            >
              {/* Sentiment Badge */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                  backgroundColor: `${sentimentColors[nlpSentiment]}20`,
                  borderWidth: 1,
                  borderColor: sentimentColors[nlpSentiment],
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: sentimentColors[nlpSentiment],
                    marginRight: 6,
                  }}
                />
                <Text
                  style={{
                    color: sentimentColors[nlpSentiment],
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {sentimentLabels[nlpSentiment]}
                </Text>
              </View>

              {/* Confidence Score */}
              {nlpScore !== undefined && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: "rgba(99, 102, 241, 0.15)",
                    borderWidth: 1,
                    borderColor: "#6366f1",
                  }}
                >
                  <Text
                    style={{
                      color: "#818cf8",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {Math.round(Math.abs(nlpScore) * 100)}% confident
                  </Text>
                </View>
              )}

              {/* Magnitude/Intensity Indicator */}
              {nlpMagnitude !== undefined && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: "rgba(168, 85, 247, 0.15)",
                    borderWidth: 1,
                    borderColor: "#a855f7",
                  }}
                >
                  <Text
                    style={{
                      color: "#c084fc",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {nlpMagnitude.toFixed(1)} intensity
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: "#334155",
            marginVertical: 16,
          }}
        />

        {/* Journal Note */}
        <View>
          {highlightText(note, searchQuery)}
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: "#334155",
            marginTop: 16,
            marginBottom: 16,
          }}
        />

        {/* Footer: External Weather + Location + Time */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            {externalWeather && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <CloudRainIcon size={14} color="#94a3b8" weight="fill" />
                <Text style={{ color: "#94a3b8", fontSize: 14, marginLeft: 4 }}>
                  {externalWeather.condition},{" "}
                  {Math.round(externalWeather.temperature)}°C
                </Text>
              </View>
            )}
            {location && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MapPinIcon size={14} color="#94a3b8" weight="fill" />
                <Text style={{ color: "#94a3b8", fontSize: 14, marginLeft: 4 }}>
                  {location}
                </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ClockIcon size={14} color="#94a3b8" weight="fill" />
            <Text style={{ color: "#94a3b8", fontSize: 14, marginLeft: 4 }}>
              {time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
