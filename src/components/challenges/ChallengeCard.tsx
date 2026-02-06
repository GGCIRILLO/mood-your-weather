import React from "react";
import { View, Text } from "react-native";
import {
  SunIcon,
  BookOpenIcon,
  WindIcon,
  FlaskIcon,
  DropIcon,
  LockIcon,
} from "phosphor-react-native";
import type { Challenge } from "@/types/challenges";

// Icon mapping for dynamic icon rendering
const ICON_MAP: Record<string, any> = {
  vibrant_sun: SunIcon,
  book_open: BookOpenIcon,
  wind_wave: WindIcon,
  flask: FlaskIcon,
};

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const Icon = ICON_MAP[challenge.icon] || DropIcon;
  const isLocked = challenge.status === "locked";
  const isCompleted = challenge.status === "completed";

  return (
    <View
      className={`rounded-3xl p-4 gap-3 border ${
        isLocked
          ? "bg-[#192233]/50 opacity-100 border-[#1e293b]/50"
          : "bg-[#192233] opacity-100 border-[#1e293b]"
      } ${isCompleted ? "border-blue-500/30" : ""}`}
    >
      {isCompleted ? (
        <View className="flex-row justify-between">
          <Icon size={24} color="#3B82F6" weight="fill" />
          <Text className="text-blue-500 text-[10px] font-bold bg-blue-500/20 px-2 py-1 rounded-xl">
            Done
          </Text>
        </View>
      ) : (
        <Icon
          size={24}
          color={isLocked ? "#94a3b8" : "#3B82F6"}
          weight={isLocked ? "regular" : "fill"}
        />
      )}

      <View>
        <Text
          className={`font-bold ${isLocked ? "text-white/70" : "text-white"}`}
        >
          {challenge.name}
        </Text>
        {isLocked && (
          <View className="flex-row items-center gap-1 mt-1">
            <LockIcon size={14} color="#94a3b8" />
            <Text className="text-xs text-slate-400">Locked</Text>
          </View>
        )}

        {isCompleted && (
          <Text className="text-xs text-slate-400 mt-1">{challenge.goal}</Text>
        )}
      </View>

      {isLocked && (
        <Text className="text-[11px] text-slate-500 mt-1">
          {challenge.goal}
        </Text>
      )}
    </View>
  );
};
