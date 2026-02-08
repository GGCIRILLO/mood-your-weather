import React from "react";
import { render } from "@testing-library/react-native";
import { StatsGrid } from "../StatsGrid";

// Mock phosphor icons
jest.mock("phosphor-react-native", () => ({
  FireIcon: () => null,
  TrophyIcon: () => null,
  TrendUpIcon: () => null,
}));

describe("StatsGrid", () => {
  const mockStats = {
    totalEntries: 42,
    currentStreak: 5,
    longestStreak: 12,
    averageIntensity: 75.5,
    topMoods: [],
    monthlyGrowth: 10,
  };

  it("renders correctly with stats", () => {
    const { getAllByText, getByText } = render(<StatsGrid stats={mockStats} />);

    expect(getAllByText("42").length).toBeGreaterThan(0);
    expect(getByText("Total Entries")).toBeTruthy();
    expect(getAllByText("5").length).toBeGreaterThan(0);
    expect(getByText("Day Streak")).toBeTruthy();
    expect(getAllByText("12").length).toBeGreaterThan(0);
    expect(getByText("Best Streak")).toBeTruthy();
    expect(getAllByText("76%").length).toBeGreaterThan(0); // rounded toFixed(0)
    expect(getByText("Avg Intensity")).toBeTruthy();
  });

  it("renders default values with no stats", () => {
    const { getAllByText } = render(<StatsGrid stats={undefined} />);

    // totalEntries, currentStreak, longestStreak all 0
    // averageIntensity 0%
    const zeros = getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(3);
    expect(getAllByText("0%").length).toBe(1);
  });
});
