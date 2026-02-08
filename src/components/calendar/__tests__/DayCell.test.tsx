import { render, fireEvent } from "@testing-library/react-native";
import DayCell from "../DayCell";

describe("DayCell Component", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultDayData = {
    date: new Date(),
    entries: [],
    isOutsideMonth: false,
    isToday: false,
    isFuture: false,
  };

  it("renders empty cell when no entries", () => {
    const { getByText } = render(
      <DayCell dayData={defaultDayData} onPress={mockOnPress} />,
    );
    expect(getByText(defaultDayData.date.getDate().toString())).toBeTruthy();
  });

  it("renders mood icon and calls onPress when entries exist", () => {
    const dayData = {
      ...defaultDayData,
      entries: [
        {
          id: "1",
          emojis: ["sunny"],
          intensity: 80,
          timestamp: new Date().toISOString(),
        },
      ] as any,
    };

    const { getByText } = render(
      <DayCell dayData={dayData} onPress={mockOnPress} />,
    );

    fireEvent.press(getByText(dayData.date.getDate().toString()));
    expect(mockOnPress).toHaveBeenCalledWith(dayData.date, dayData.entries);
  });

  it("indicates today correctly", () => {
    const dayData = {
      ...defaultDayData,
      isToday: true,
      entries: [{ id: "1", emojis: ["sunny"] }] as any,
    };
    const { getByText } = render(
      <DayCell dayData={dayData} onPress={mockOnPress} />,
    );
    expect(getByText("TODAY")).toBeTruthy();
  });

  it("is disabled when future or no entries", () => {
    const dayData = { ...defaultDayData, isFuture: true, entries: [] };
    const { getByText } = render(
      <DayCell dayData={dayData} onPress={mockOnPress} />,
    );

    fireEvent.press(getByText(dayData.date.getDate().toString()));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("renders correctly when outside month", () => {
    const dayData = { ...defaultDayData, isOutsideMonth: true };
    const { queryByText } = render(
      <DayCell dayData={dayData} onPress={mockOnPress} />,
    );
    expect(queryByText(dayData.date.getDate().toString())).toBeNull();
  });

  it("renders correctly with multiple mood types", () => {
    const dayData = {
      ...defaultDayData,
      entries: [
        { id: "1", emojis: ["sunny"], intensity: 80, timestamp: "2023-01-01" },
        { id: "2", emojis: ["rainy"], intensity: 20, timestamp: "2023-01-01" },
      ] as any,
    };
    const { getByText } = render(
      <DayCell dayData={dayData} onPress={mockOnPress} />,
    );
    expect(getByText(dayData.date.getDate().toString())).toBeTruthy();
    // Test implicitly covers the gradient branch for unique types
  });
});
