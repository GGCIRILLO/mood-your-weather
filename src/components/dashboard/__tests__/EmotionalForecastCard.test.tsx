import React from "react";
import { render } from "@testing-library/react-native";
import { EmotionalForecastCard } from "../EmotionalForecastCard";
import { MoodEntryType } from "@/types";

// Mock dependencies
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children, style }: any) => (
    <div style={style}>{children}</div>
  ),
}));

jest.mock("phosphor-react-native", () => ({
  ThermometerSimpleIcon: () => null,
  SunIcon: () => null,
  CloudIcon: () => null,
  RainIcon: () => null,
  CloudLightningIcon: () => null,
  CloudSunIcon: () => null,
}));

describe("EmotionalForecastCard", () => {
  const mockMood = {
    id: "1",
    userId: "u1",
    emojis: ["sunny", "partly"] as MoodEntryType["emojis"],
    intensity: 85,
    note: "Feeling great today!",
    timestamp: new Date().toISOString(),
  };

  it("renders correctly with a mood", () => {
    const { getByText } = render(
      <EmotionalForecastCard latestMood={mockMood as any} />,
    );

    expect(getByText("Sunny + Partly")).toBeTruthy();
    expect(getByText("Intensity: 85%")).toBeTruthy();
    expect(getByText('"Feeling great today!"')).toBeTruthy();
  });

  it("renders empty state correctly", () => {
    const { getByText } = render(<EmotionalForecastCard isEmpty={true} />);

    expect(getByText(/Your emotional sky is a blank canvas/)).toBeTruthy();
  });

  it('renders "No mood logged yet" when not empty but no mood provided', () => {
    const { getByText } = render(
      <EmotionalForecastCard latestMood={undefined} />,
    );
    expect(getByText("No mood logged yet")).toBeTruthy();
  });

  it("matches snapshot with mood", () => {
    const tree = render(
      <EmotionalForecastCard latestMood={mockMood as any} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("matches snapshot in empty state", () => {
    const tree = render(<EmotionalForecastCard isEmpty={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
