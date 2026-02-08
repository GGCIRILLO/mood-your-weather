import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FilterChips } from "../FilterChips";

describe("FilterChips", () => {
  const mockFilters = ["All", "Anxiety", "Focus", "Sleep", "Meditation"];
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <FilterChips
        filters={mockFilters}
        activeFilter="All"
        onFilterChange={mockOnFilterChange}
      />,
    );

    mockFilters.forEach((filter) => {
      expect(getByText(filter)).toBeTruthy();
    });
  });

  it("matches snapshot", () => {
    const tree = render(
      <FilterChips
        filters={mockFilters}
        activeFilter="All"
        onFilterChange={mockOnFilterChange}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("calls onFilterChange when a filter is pressed", () => {
    const { getByText } = render(
      <FilterChips
        filters={mockFilters}
        activeFilter="All"
        onFilterChange={mockOnFilterChange}
      />,
    );

    fireEvent.press(getByText("Anxiety"));
    expect(mockOnFilterChange).toHaveBeenCalledWith("Anxiety");
  });

  it("highlights the active filter", () => {
    const { getByText } = render(
      <FilterChips
        filters={mockFilters}
        activeFilter="Focus"
        onFilterChange={mockOnFilterChange}
      />,
    );

    const focusChip = getByText("Focus");
    expect(focusChip).toBeTruthy();
    expect(focusChip.props.style).toMatchObject({
      color: "white",
      fontWeight: "600",
    });
  });

  it("renders with empty filters array", () => {
    const { toJSON } = render(
      <FilterChips
        filters={[]}
        activeFilter=""
        onFilterChange={mockOnFilterChange}
      />,
    );

    expect(toJSON()).toBeTruthy();
  });

  it("handles single filter", () => {
    const { getByText } = render(
      <FilterChips
        filters={["All"]}
        activeFilter="All"
        onFilterChange={mockOnFilterChange}
      />,
    );

    expect(getByText("All")).toBeTruthy();
  });

  it("allows changing from one filter to another", () => {
    const { getByText, rerender } = render(
      <FilterChips
        filters={mockFilters}
        activeFilter="All"
        onFilterChange={mockOnFilterChange}
      />,
    );

    fireEvent.press(getByText("Sleep"));
    expect(mockOnFilterChange).toHaveBeenCalledWith("Sleep");

    rerender(
      <FilterChips
        filters={mockFilters}
        activeFilter="Sleep"
        onFilterChange={mockOnFilterChange}
      />,
    );

    const sleepChip = getByText("Sleep");
    expect(sleepChip.props.style).toMatchObject({
      color: "white",
      fontWeight: "600",
    });
  });
});
