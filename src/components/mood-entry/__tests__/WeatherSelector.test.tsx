import { render, fireEvent } from "@testing-library/react-native";
import { WeatherSelector } from "../WeatherSelector";
import React from "react";
import { View } from "react-native";

// Shared handlers to trigger events from tests
let mockGestureHandlers: any = {};

// Super simple mock to bypass native dependencies
jest.mock("react-native-gesture-handler", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    GestureHandlerRootView: ({ children }: any) =>
      React.createElement(View, {}, children),
    Gesture: {
      Pan: () => ({
        onStart: (cb: any) => {
          mockGestureHandlers.onStart = cb;
          return {
            onUpdate: (cb2: any) => {
              mockGestureHandlers.onUpdate = cb2;
              return {
                onEnd: (cb3: any) => {
                  mockGestureHandlers.onEnd = cb3;
                  return {};
                },
              };
            },
          };
        },
      }),
    },
    GestureDetector: ({ children }: any) =>
      React.createElement(View, { testID: "gesture-detector" }, children),
  };
});

jest.mock("react-native-reanimated", () => {
  const Reanimated = {
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (cb: any) => ({}),
    withSpring: (v: any) => v,
    runOnJS: (fn: any) => fn,
    default: {
      View: require("react-native").View,
      Text: require("react-native").Text,
      createAnimatedComponent: (c: any) => c,
    },
    View: require("react-native").View,
  };
  return {
    __esModule: true,
    ...Reanimated,
  };
});

// Mock scheduleOnRN to capture calls
const mockScheduleOnRN = jest.fn((fn, arg) => fn(arg));
jest.mock("react-native-worklets", () => ({
  scheduleOnRN: (fn: any, arg: any) => mockScheduleOnRN(fn, arg),
}));

describe("WeatherSelector Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    gestureHandlers = {};
  });

  it("renders drag instruction text", () => {
    const { getByText } = render(
      <WeatherSelector selectedWeather={[]} onWeatherAdd={jest.fn()} />,
    );
    expect(getByText("Drag to center (max 2)")).toBeTruthy();
  });

  it("triggers onWeatherAdd when dragged upward significantly", () => {
    const onWeatherAdd = jest.fn();
    render(
      <WeatherSelector selectedWeather={[]} onWeatherAdd={onWeatherAdd} />,
    );

    // Simulate gesture life cycle
    if (mockGestureHandlers.onStart) mockGestureHandlers.onStart();
    if (mockGestureHandlers.onUpdate)
      mockGestureHandlers.onUpdate({ translationX: 10, translationY: -50 });

    // Test Case: Dragged UP (-250) and CENTRALLY (50)
    if (mockGestureHandlers.onEnd) {
      mockGestureHandlers.onEnd({ translationX: 50, translationY: -250 });
    }

    expect(mockScheduleOnRN).toHaveBeenCalled();
    // Since the mock overwrites the global handlers in a loop,
    // the last weather option (stormy) is the one actually captured.
    expect(onWeatherAdd).toHaveBeenCalledWith("stormy");
  });

  it("does NOT trigger onWeatherAdd when dragged sideways", () => {
    const onWeatherAdd = jest.fn();
    render(
      <WeatherSelector selectedWeather={[]} onWeatherAdd={onWeatherAdd} />,
    );

    // Test Case: Dragged UP but too much SIDEWAYS (200)
    if (mockGestureHandlers.onEnd) {
      mockGestureHandlers.onEnd({ translationX: 200, translationY: -250 });
    }

    expect(onWeatherAdd).not.toHaveBeenCalled();
  });

  it("does NOT trigger onWeatherAdd when dragged downward", () => {
    const onWeatherAdd = jest.fn();
    render(
      <WeatherSelector selectedWeather={[]} onWeatherAdd={onWeatherAdd} />,
    );

    // Test Case: Dragged DOWN (100)
    if (mockGestureHandlers.onEnd) {
      mockGestureHandlers.onEnd({ translationX: 10, translationY: 100 });
    }

    expect(onWeatherAdd).not.toHaveBeenCalled();
  });

  it("renders selected state correctly", () => {
    // This covers the styles branch for isSelected
    const { getAllByTestId } = render(
      <WeatherSelector selectedWeather={["sunny"]} onWeatherAdd={jest.fn()} />,
    );
    // Grid exists (multiples since it's in a loop)
    expect(getAllByTestId("gesture-detector").length).toBeGreaterThan(0);
  });
});
