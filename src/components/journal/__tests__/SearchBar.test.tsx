import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SearchBar } from "../SearchBar";

// Mock dependencies
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: any) => <>{children}</>,
}));

jest.mock("phosphor-react-native", () => ({
  MagnifyingGlassIcon: () => null,
  XIcon: ({ onPress }: any) => <div testID="x-icon" onClick={onPress} />,
}));

describe("SearchBar", () => {
  it("renders correctly when visible", () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        visible={true}
        searchQuery=""
        onSearchChange={() => {}}
        onDismiss={() => {}}
      />,
    );

    expect(getByPlaceholderText("Search your reflections...")).toBeTruthy();
  });

  it("calls onSearchChange when text changes", () => {
    const onSearchChange = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar
        visible={true}
        searchQuery=""
        onSearchChange={onSearchChange}
        onDismiss={() => {}}
      />,
    );

    fireEvent.changeText(
      getByPlaceholderText("Search your reflections..."),
      "happy",
    );
    expect(onSearchChange).toHaveBeenCalledWith("happy");
  });

  it("calls onDismiss and clears search when closed", () => {
    const onDismiss = jest.fn();
    const onSearchChange = jest.fn();
    const { getByTestId } = render(
      <SearchBar
        visible={true}
        searchQuery="something"
        onSearchChange={onSearchChange}
        onDismiss={onDismiss}
      />,
    );

    // Using a hacky way since phosphor icons are typically just views, but I mocked it as a div with testID
    const xButton = getByTestId("x-icon");
    fireEvent.press(xButton);

    expect(onSearchChange).toHaveBeenCalledWith("");
    expect(onDismiss).toHaveBeenCalled();
  });
});
