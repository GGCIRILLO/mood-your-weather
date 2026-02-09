import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { NotePencil, MagnifyingGlass, FunnelX } from "phosphor-react-native";

interface EmptyStateProps {
  type: "noEntries" | "noResults" | "noFilters";
  searchQuery?: string;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchQuery,
  onClearFilters,
}) => {
  const renderContent = () => {
    switch (type) {
      case "noEntries":
        return (
          <>
            <View className="w-24 h-24 rounded-full bg-slate-800/50 items-center justify-center mb-6">
              <NotePencil size={48} color="#64748B" weight="regular" />
            </View>
            <Text className="text-white text-lg font-semibold mb-3">
              No journal entries yet
            </Text>
            <Text className="text-slate-400 text-base text-center mb-6 px-8">
              Add text or voice notes to your mood entries to see them here.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/mood-entry")}
              className="px-8 py-3 rounded-full bg-indigo-600 active:bg-indigo-700"
            >
              <Text className="text-white font-semibold text-base">
                Start Writing
              </Text>
            </TouchableOpacity>
          </>
        );

      case "noResults":
        return (
          <>
            <View className="w-24 h-24 rounded-full bg-slate-800/50 items-center justify-center mb-6">
              <MagnifyingGlass size={48} color="#64748B" weight="regular" />
            </View>
            <Text className="text-white text-lg font-semibold mb-3">
              No entries found for "{searchQuery}"
            </Text>
            <Text className="text-slate-400 text-base text-center px-8">
              Try different keywords or check your filters.
            </Text>
          </>
        );

      case "noFilters":
        return (
          <>
            <View className="w-24 h-24 rounded-full bg-slate-800/50 items-center justify-center mb-6">
              <FunnelX size={48} color="#64748B" weight="regular" />
            </View>
            <Text className="text-white text-lg font-semibold mb-3">
              No entries match your filters
            </Text>
            <TouchableOpacity
              onPress={onClearFilters}
              className="px-8 py-3 rounded-full mt-4 bg-indigo-600 active:bg-indigo-700"
            >
              <Text className="text-white font-semibold text-base">
                Clear Filters
              </Text>
            </TouchableOpacity>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View key={type} className="flex-1 justify-center items-center px-8 py-20">
      {renderContent()}
    </View>
  );
};
