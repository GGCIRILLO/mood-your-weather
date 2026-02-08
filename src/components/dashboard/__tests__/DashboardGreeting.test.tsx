import { render } from "@testing-library/react-native";
import { DashboardGreeting } from "../DashboardGreeting";

describe("DashboardGreeting Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders user name correctly", () => {
    const { getByText } = render(<DashboardGreeting userName="Luigi" />);
    expect(getByText(/Luigi/)).toBeTruthy();
  });

  it("shows Good Morning before 12:00", () => {
    jest.setSystemTime(new Date(2024, 0, 1, 9, 0)); // 9 AM
    const { getByText } = render(<DashboardGreeting userName="Luigi" />);
    expect(getByText(/Good Morning/)).toBeTruthy();
  });

  it("shows Good Afternoon between 12:00 and 18:00", () => {
    jest.setSystemTime(new Date(2024, 0, 1, 14, 0)); // 2 PM
    const { getByText } = render(<DashboardGreeting userName="Luigi" />);
    expect(getByText(/Good Afternoon/)).toBeTruthy();
  });

  it("shows Good Evening after 18:00", () => {
    jest.setSystemTime(new Date(2024, 0, 1, 20, 0)); // 8 PM
    const { getByText } = render(<DashboardGreeting userName="Luigi" />);
    expect(getByText(/Good Evening/)).toBeTruthy();
  });
});
