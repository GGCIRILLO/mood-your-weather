import React from "react";
import { render } from "@testing-library/react-native";
import { StatsGrid } from "../StatsGrid";

describe("StatsGrid", () => {
  it("renders correctly with all props", () => {
    const { getByText } = render(
      <StatsGrid totalEntries={42} currentStreak={7} dominantMood="sunny" />,
    );

    expect(getByText("42")).toBeTruthy();
    expect(getByText("7")).toBeTruthy();
    expect(getByText("Entries")).toBeTruthy();
    expect(getByText("Day Streak")).toBeTruthy();
    expect(getByText("Fav Weather")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const tree = render(
      <StatsGrid totalEntries={42} currentStreak={7} dominantMood="sunny" />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with zero values", () => {
    const { getAllByText } = render(
      <StatsGrid totalEntries={0} currentStreak={0} dominantMood={undefined} />,
    );

    const zeros = getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it("renders with undefined values showing defaults", () => {
    const { getAllByText } = render(<StatsGrid />);

    // Should show 0 for undefined numeric values
    const zeros = getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it("displays sunny weather icon", () => {
    const { UNSAFE_getByType } = render(
      <StatsGrid totalEntries={10} currentStreak={5} dominantMood="sunny" />,
    );

    const SunIcon = require("phosphor-react-native").SunIcon;
    expect(() => UNSAFE_getByType(SunIcon)).not.toThrow();
  });

  it("displays partly cloudy weather icon", () => {
    const { UNSAFE_getByType } = render(
      <StatsGrid totalEntries={10} currentStreak={5} dominantMood="partly" />,
    );

    const CloudSunIcon = require("phosphor-react-native").CloudSunIcon;
    expect(() => UNSAFE_getByType(CloudSunIcon)).not.toThrow();
  });

  it("displays cloudy weather icon", () => {
    const { UNSAFE_getByType } = render(
      <StatsGrid totalEntries={10} currentStreak={5} dominantMood="cloudy" />,
    );

    const CloudIcon = require("phosphor-react-native").CloudIcon;
    expect(() => UNSAFE_getByType(CloudIcon)).not.toThrow();
  });

  it("displays rainy weather icon", () => {
    const { UNSAFE_getByType } = render(
      <StatsGrid totalEntries={10} currentStreak={5} dominantMood="rainy" />,
    );

    const CloudRain = require("phosphor-react-native").CloudRain;
    expect(() => UNSAFE_getByType(CloudRain)).not.toThrow();
  });

  it("displays stormy weather icon", () => {
    const { UNSAFE_getByType } = render(
      <StatsGrid totalEntries={10} currentStreak={5} dominantMood="stormy" />,
    );

    const CloudLightning = require("phosphor-react-native").CloudLightning;
    expect(() => UNSAFE_getByType(CloudLightning)).not.toThrow();
  });

  it("displays default icon when dominantMood is undefined", () => {
    const { UNSAFE_getByType } = render(
      <StatsGrid
        totalEntries={10}
        currentStreak={5}
        dominantMood={undefined}
      />,
    );

    const CloudLightning = require("phosphor-react-native").CloudLightning;
    expect(() => UNSAFE_getByType(CloudLightning)).not.toThrow();
  });

  it("displays high streak values", () => {
    const { getByText } = render(
      <StatsGrid totalEntries={365} currentStreak={100} dominantMood="sunny" />,
    );

    expect(getByText("365")).toBeTruthy();
    expect(getByText("100")).toBeTruthy();
  });

  it("has correct layout structure", () => {
    const { getByText } = render(
      <StatsGrid totalEntries={42} currentStreak={7} dominantMood="sunny" />,
    );

    // All three sections should be present
    expect(getByText("Entries")).toBeTruthy();
    expect(getByText("Day Streak")).toBeTruthy();
    expect(getByText("Fav Weather")).toBeTruthy();
  });
});
