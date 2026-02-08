import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { WeatherDisplay } from "../WeatherDisplay";

// Mock dependencies
jest.mock("react-native-reanimated", () => {
  const Animated = require("react-native-reanimated/mock");
  return {
    ...Animated,
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (cb: any) => cb(),
  };
});

jest.mock("phosphor-react-native", () => ({
  SunIcon: () => null,
  CloudSunIcon: () => null,
  CloudIcon: () => null,
  CloudRainIcon: () => null,
  CloudLightningIcon: () => null,
}));

describe("WeatherDisplay", () => {
  it("renders placeholder when no weather selected", () => {
    const { toJSON } = render(
      <WeatherDisplay
        selectedWeather={[]}
        pulseStyle={{}}
        onWeatherRemove={() => {}}
        onWeatherAdd={() => {}}
      />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders selected weather icons", () => {
    const onWeatherRemove = jest.fn();
    const { getByRole, getAllByRole } = render(
      <WeatherDisplay
        selectedWeather={["sunny", "rainy"]}
        pulseStyle={{}}
        onWeatherRemove={onWeatherRemove}
        onWeatherAdd={() => {}}
      />,
    );

    const icons = getAllByRole("button");
    expect(icons.length).toBe(2);

    fireEvent.press(icons[0]);
    expect(onWeatherRemove).toHaveBeenCalledWith("sunny");
  });

  it("matches snapshot with selected weather", () => {
    const tree = render(
      <WeatherDisplay
        selectedWeather={["sunny", "rainy"]}
        pulseStyle={{}}
        onWeatherRemove={() => {}}
        onWeatherAdd={() => {}}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
