import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CalendarHeader from "../CalendarHeader";
import { router } from "expo-router";

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it("calls router.back when back button is pressed", () => {
    const { getAllByRole } = render(
      <CalendarHeader
        currentDate={mockDate}
        onPrevMonth={() => {}}
        onNextMonth={() => {}}
        isNextDisabled={false}
      />,
    );

    const buttons = getAllByRole("button");
    fireEvent.press(buttons[0]); // back button
    expect(router.back).toHaveBeenCalled();
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

    const buttons = getAllByRole("button");
    fireEvent.press(buttons[1]); // prev button
    expect(onPrevMonth).toHaveBeenCalled();
  });

  it("calls onNextMonth when next button is pressed and not disabled", () => {
    const onNextMonth = jest.fn();
    const { getAllByRole } = render(
      <CalendarHeader
        currentDate={mockDate}
        onPrevMonth={() => {}}
        onNextMonth={onNextMonth}
        isNextDisabled={false}
      />,
    );

    const buttons = getAllByRole("button");
    fireEvent.press(buttons[2]); // next button
    expect(onNextMonth).toHaveBeenCalled();
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
    fireEvent.press(buttons[2]); // next button
    expect(onNextMonth).not.toHaveBeenCalled();

    // Check opacity or specific style if possible, but the fireEvent test is more functional
  });
});
