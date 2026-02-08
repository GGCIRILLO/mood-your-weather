import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CalendarHeader from "../CalendarHeader";

// Mock dependencies
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0 }),
}));

jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
}));

jest.mock("phosphor-react-native", () => ({
  ArrowLeftIcon: () => null,
  CaretLeftIcon: () => null,
  CaretRightIcon: () => null,
}));

describe("CalendarHeader", () => {
  const mockDate = new Date(2023, 11, 25); // December 2023

  it("renders correctly with date", () => {
    const { getByText } = render(
      <CalendarHeader
        currentDate={mockDate}
        onPrevMonth={() => {}}
        onNextMonth={() => {}}
        isNextDisabled={false}
      />,
    );

    expect(getByText("CALENDAR")).toBeTruthy();
    expect(getByText("December 2023")).toBeTruthy();
  });

  it("calls onPrevMonth when prev button is pressed", () => {
    const onPrevMonth = jest.fn();
    const { getAllByRole } = render(
      <CalendarHeader
        currentDate={mockDate}
        onPrevMonth={onPrevMonth}
        onNextMonth={() => {}}
        isNextDisabled={false}
      />,
    );

    // Pressables are buttons
    const buttons = getAllByRole("button");
    // 0: back, 1: prev, 2: next
    fireEvent.press(buttons[1]);
    expect(onPrevMonth).toHaveBeenCalled();
  });

  it("disables next button when isNextDisabled is true", () => {
    const onNextMonth = jest.fn();
    const { getAllByRole } = render(
      <CalendarHeader
        currentDate={mockDate}
        onPrevMonth={() => {}}
        onNextMonth={onNextMonth}
        isNextDisabled={true}
      />,
    );

    const buttons = getAllByRole("button");
    fireEvent.press(buttons[2]);
    expect(onNextMonth).not.toHaveBeenCalled();
  });

  it("disables next button when isNextDisabled is true", () => {
    const onNextMonth = jest.fn();
    const { getAllByRole } = render(
      <CalendarHeader
        currentDate={mockDate}
        onPrevMonth={() => {}}
        onNextMonth={onNextMonth}
        isNextDisabled={true}
      />,
    );

    const buttons = getAllByRole("button");
    fireEvent.press(buttons[2]);
    expect(onNextMonth).not.toHaveBeenCalled();
  });
});
