import React from "react";
import { render } from "@testing-library/react-native";
import { PatternAnalysisCard } from "../PatternAnalysisCard";

// Mock phosphor icons
jest.mock("phosphor-react-native", () => ({
  SparkleIcon: () => null,
}));

describe("PatternAnalysisCard", () => {
  it("renders coming soon state", () => {
    const { getByText } = render(<PatternAnalysisCard />);

    expect(getByText("Pattern Analysis")).toBeTruthy();
    expect(getByText("Coming Soon")).toBeTruthy();
    expect(getByText(/AI-powered insights/)).toBeTruthy();
  });

  it("matches snapshot", () => {
    const tree = render(<PatternAnalysisCard />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
