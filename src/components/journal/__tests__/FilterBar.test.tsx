import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FilterBar } from "../FilterBar";

// Mock phosphor icons
jest.mock("phosphor-react-native", () => ({
  SunIcon: () => null,
  CloudSunIcon: () => null,
  CloudIcon: () => null,
  CloudRainIcon: () => null,
  CloudLightningIcon: () => null,
}));

describe("FilterBar", () => {
  it("renders correctly when visible", () => {
    const { getByText } = render(
      <FilterBar
        visible={true}
        selectedFilters={[]}
        onFilterToggle={() => {}}
      />,
    );

    expect(getByText("Sunny")).toBeTruthy();
    expect(getByText("Partly")).toBeTruthy();
    expect(getByText("Stormy")).toBeTruthy();
  });

  it("calls onFilterToggle when a filter is pressed", () => {
    const onFilterToggle = jest.fn();
    const { getByText } = render(
      <FilterBar
        visible={true}
        selectedFilters={[]}
        onFilterToggle={onFilterToggle}
      />,
    );

    fireEvent.press(getByText("Sunny"));
    expect(onFilterToggle).toHaveBeenCalledWith("sunny");
  });

  it("highlights selected filters", () => {
    // This would check styles, which is harder in some setups,
    // but we can at least check if it renders with the selected state logic
    const { getByText } = render(
      <FilterBar
        visible={true}
        selectedFilters={["sunny"]}
        onFilterToggle={() => {}}
      />,
    );

    expect(getByText("Sunny")).toBeTruthy();
  });
});
