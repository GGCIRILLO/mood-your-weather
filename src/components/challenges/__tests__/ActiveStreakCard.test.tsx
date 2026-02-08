import React from "react";
import { render } from "@testing-library/react-native";
import { ActiveStreakCard } from "../ActiveStreakCard";

// Mock dependencies
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("phosphor-react-native", () => ({
  DropIcon: () => null,
}));

describe("ActiveStreakCard", () => {
  const mockChallenge = {
    id: "streak-1",
    title: "7-Day Streak",
    description: "Keep it up for a week!",
    reward: "Weekly Report",
    target: 7,
    current: 3,
    completed: false,
    icon: "drop",
  };

  it("renders correctly with streak data", () => {
    const { getByText } = render(
      <ActiveStreakCard
        currentStreak={3}
        streakChallenge={mockChallenge}
        streakProgress={42}
      />,
    );

    expect(getByText("Active Streak")).toBeTruthy();
    expect(getByText(/3/)).toBeTruthy();
    expect(getByText(/\/7 Days/)).toBeTruthy();
    expect(getByText("Keep it up for a week!")).toBeTruthy();
  });

  it("renders default description when no challenge provided", () => {
    const { getByText } = render(
      <ActiveStreakCard currentStreak={0} streakProgress={0} />,
    );

    expect(
      getByText(
        "Build a consistent habit to unlock your weekly emotional weather report.",
      ),
    ).toBeTruthy();
  });
});
