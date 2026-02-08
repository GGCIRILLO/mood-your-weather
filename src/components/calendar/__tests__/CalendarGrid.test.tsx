import React from "react";
import { render } from "@testing-library/react-native";
import CalendarGrid from "../CalendarGrid";

// Mock DayCell to avoid deep tree rendering
jest.mock("../DayCell", () => {
  const { Text } = require("react-native");
  return ({ dayData }: any) => <Text>{dayData.date.getDate()}</Text>;
});

describe("CalendarGrid", () => {
  const mockDays = [
    {
      date: new Date(2023, 11, 1),
      isCurrentMonth: true,
      entries: [],
      hasEntries: false,
    },
    {
      date: new Date(2023, 11, 2),
      isCurrentMonth: true,
      entries: [],
      hasEntries: false,
    },
  ];

  it("renders correctly with days", () => {
    const { getByText, getAllByText } = render(
      <CalendarGrid calendarDays={mockDays} onDayPress={() => {}} />,
    );

    // Day headers
    expect(getAllByText("S").length).toBeGreaterThan(0);
    expect(getByText("M")).toBeTruthy();

    // Day numbers
    expect(getByText("1")).toBeTruthy();
    expect(getByText("2")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const tree = render(
      <CalendarGrid calendarDays={mockDays} onDayPress={() => {}} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
