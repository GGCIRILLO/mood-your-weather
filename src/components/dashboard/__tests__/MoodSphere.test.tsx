import React from "react";
import { render } from "@testing-library/react-native";
import { MoodSphere } from "../MoodSphere";
import { View } from "react-native";

// Simple mock for reanimated
jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Reanimated = {
    View: View,
    createAnimatedComponent: (c: any) => c,
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withRepeat: (v: any) => v,
    withTiming: (v: any) => v,
    withSequence: (v: any) => v,
    Easing: {
      inOut: (v: any) => v,
      ease: (v: any) => v,
    },
  };
  return {
    __esModule: true,
    ...Reanimated,
    default: Reanimated,
  };
});

// Simple mock for svg
jest.mock("react-native-svg", () => {
  const React = require("react");
  const Mock = (props: any) =>
    React.createElement("Mock", props, props.children);
  return {
    __esModule: true,
    default: Mock,
    Svg: Mock,
    Defs: Mock,
    RadialGradient: Mock,
    Stop: Mock,
    Circle: Mock,
  };
});

describe("MoodSphere", () => {
  it("renders correctly for sunny mood", () => {
    const { toJSON } = render(<MoodSphere mood="sunny" />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders correctly for stormy mood", () => {
    const { toJSON } = render(<MoodSphere mood="stormy" />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders correctly when empty", () => {
    const { toJSON } = render(<MoodSphere isEmpty={true} />);
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot for sunny mood", () => {
    const tree = render(<MoodSphere mood="sunny" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("matches snapshot when empty", () => {
    const tree = render(<MoodSphere isEmpty={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
