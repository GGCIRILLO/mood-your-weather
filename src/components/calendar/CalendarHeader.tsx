import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { memo } from "react";
import { router } from "expo-router";
import {
  ArrowLeftIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "phosphor-react-native";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isNextDisabled: boolean;
}

const CalendarHeader = memo(
  ({
    currentDate,
    onPrevMonth,
    onNextMonth,
    isNextDisabled,
  }: CalendarHeaderProps) => {
    const insets = useSafeAreaInsets();

    return (
      <>
        {/* Main Header */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: 16,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeftIcon size={24} color="#FFF" />
          </Pressable>

          <Text className="text-sm font-bold uppercase tracking-widest text-slate-400">
            CALENDAR
          </Text>

          <View style={styles.placeholderButton} />
        </View>

        {/* Month Navigator */}
        <View className="px-4 pb-4 flex-row items-center justify-center gap-3">
          <Pressable
            onPress={onPrevMonth}
            style={styles.navButton}
            accessibilityRole="button"
            accessibilityLabel="Previous month"
          >
            <CaretLeftIcon size={20} color="white" />
          </Pressable>
          <Text className="text-2xl font-extrabold text-white tracking-tight min-w-50 text-center">
            {format(currentDate, "MMMM yyyy")}
          </Text>
          <Pressable
            onPress={onNextMonth}
            disabled={isNextDisabled}
            accessibilityRole="button"
            accessibilityLabel="Next month"
            style={[
              styles.navButton,
              isNextDisabled && styles.navButtonDisabled,
            ]}
          >
            <CaretRightIcon
              size={20}
              color={isNextDisabled ? "#64748B" : "white"}
            />
          </Pressable>
        </View>
      </>
    );
  },
);

CalendarHeader.displayName = "CalendarHeader";

const styles = StyleSheet.create({
  backButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  placeholderButton: {
    width: 48,
    height: 48,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  navButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.05)",
    opacity: 0.5,
  },
});

export default CalendarHeader;
