import React from "react";
import { render } from "@testing-library/react-native";
import BlueGlow from "../BlueGlow";

// Mock Svg
jest.mock("react-native-svg", () => {
  const React = require("react");
  const Mock = (props: any) =>
    React.createElement("SvgMock", props, props.children);
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

describe("BlueGlow", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<BlueGlow />);
    expect(toJSON()).toBeTruthy();
  });

  it("applies custom props", () => {
    const { toJSON } = render(
      <BlueGlow width={400} height={400} intensity={0.8} />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
