import { View, Text, ScrollView, Pressable } from "react-native";

interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterChips = ({
  filters,
  activeFilter,
  onFilterChange,
}: FilterChipsProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 24 }}
    >
      <View style={{ flexDirection: "row", gap: 12 }}>
        {filters.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => onFilterChange(filter)}
            testID={`filter-chip-${filter}`}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: activeFilter === filter ? "#135bec" : "#192233",
              shadowColor: activeFilter === filter ? "#135bec" : "transparent",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 15,
            }}
          >
            <Text
              style={{
                color: activeFilter === filter ? "white" : "#92a4c9",
                fontSize: 14,
                fontWeight: activeFilter === filter ? "600" : "500",
              }}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};
