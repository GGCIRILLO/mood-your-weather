import { View, Text } from "react-native";
import {
  SunIcon,
  BookOpenIcon,
  WindIcon,
  FlaskIcon,
  MedalIcon,
} from "phosphor-react-native";

const BADGE_MAP: Record<
  string,
  { icon: any; title: string; color: string }
> = {
  "7_day_streak": { icon: SunIcon, title: "7-Day Streak", color: "#F59E0B" },
  "storyteller": { icon: BookOpenIcon, title: "Storyteller", color: "#3B82F6" },
  "mindful_moment": { icon: WindIcon, title: "Mindful Moment", color: "#10B981" },
  "weather_mixologist": { icon: FlaskIcon, title: "Weather Mixologist", color: "#A855F7" },
};

interface UnlockedBadgesCardProps {
  badges?: string[];
}

export const UnlockedBadgesCard = ({ badges }: UnlockedBadgesCardProps) => {
  return (
    <View className="bg-[#192233] rounded-3xl border border-slate-800 p-6">
      <View className="flex-row items-center gap-2 mb-4">
        <MedalIcon size={20} color="#F59E0B" weight="fill" />
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Unlocked Badges
        </Text>
      </View>
      {badges && badges.length > 0 ? (
        <View className="gap-2">
          {badges.map((badgeId, index) => {
            const badge = BADGE_MAP[badgeId] || {
              icon: MedalIcon,
              title: badgeId,
              color: "#94A3B8",
            };
            const BadgeIcon = badge.icon;

            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                    backgroundColor: `${badge.color}20`,
                  }}
                >
                  <BadgeIcon
                    size={20}
                    color={badge.color}
                    weight="fill"
                  />
                </View>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "500",
                    flex: 1,
                  }}
                >
                  {badge.title}
                </Text>
              </View>
            );
          })}
        </View>
      ) : (
        <View className="items-center py-4">
          <Text className="text-slate-400 text-sm text-center">
            No badges unlocked yet. Keep tracking your moods!
          </Text>
        </View>
      )}
    </View>
  );
};
