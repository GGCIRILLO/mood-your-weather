import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ForecastAlerts } from "../ForecastAlerts";

describe("ForecastAlerts", () => {
  const mockOnToggleReminder = jest.fn();
  const mockOnSetTime = jest.fn();
  const mockOnSendTest = jest.fn();
  const mockFormatTime = jest.fn((date) => "09:00");
  const mockReminderTime = new Date("2024-01-01T09:00:00");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with smart reminder enabled", () => {
    const { getByText } = render(
      <ForecastAlerts
        smartReminder={true}
        reminderTime={mockReminderTime}
        formatTime={mockFormatTime}
        onToggleReminder={mockOnToggleReminder}
        onSetTime={mockOnSetTime}
        onSendTest={mockOnSendTest}
      />,
    );

    expect(getByText("Forecast Alerts")).toBeTruthy();
    expect(getByText("Smart Reminder")).toBeTruthy();
    expect(getByText("Based on your activity patterns")).toBeTruthy();
    expect(getByText("Daily Check-in")).toBeTruthy();
    expect(getByText("Send Test Notification")).toBeTruthy();
  });

  it("matches snapshot with smart reminder enabled", () => {
    const tree = render(
      <ForecastAlerts
        smartReminder={true}
        reminderTime={mockReminderTime}
        formatTime={mockFormatTime}
        onToggleReminder={mockOnToggleReminder}
        onSetTime={mockOnSetTime}
        onSendTest={mockOnSendTest}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("matches snapshot with smart reminder disabled", () => {
    const tree = render(
      <ForecastAlerts
        smartReminder={false}
        reminderTime={mockReminderTime}
        formatTime={mockFormatTime}
        onToggleReminder={mockOnToggleReminder}
        onSetTime={mockOnSetTime}
        onSendTest={mockOnSendTest}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("hides time settings when smart reminder is disabled", () => {
    const { queryByText } = render(
      <ForecastAlerts
        smartReminder={false}
        reminderTime={mockReminderTime}
        formatTime={mockFormatTime}
        onToggleReminder={mockOnToggleReminder}
        onSetTime={mockOnSetTime}
        onSendTest={mockOnSendTest}
      />,
    );

    expect(queryByText("Daily Check-in")).toBeNull();
    expect(queryByText("Send Test Notification")).toBeNull();
  });

  it("calls onToggleReminder when switch is toggled", () => {
    const { UNSAFE_getByType } = render(
      <ForecastAlerts
        smartReminder={false}
        reminderTime={mockReminderTime}
        formatTime={mockFormatTime}
        onToggleReminder={mockOnToggleReminder}
        onSetTime={mockOnSetTime}
        onSendTest={mockOnSendTest}
      />,
    );

    const Switch = require("react-native").Switch;
    const switchComponent = UNSAFE_getByType(Switch);

    fireEvent(switchComponent, "onValueChange", true);
    expect(mockOnToggleReminder).toHaveBeenCalledWith(true);
  });

  it("calls onSetTime when Daily Check-in is pressed", () => {
    const { getByText } = render(
      <ForecastAlerts
        smartReminder={true}
        reminderTime={mockReminderTime}
        formatTime={mockFormatTime}
        onToggleReminder={mockOnToggleReminder}
        onSetTime={mockOnSetTime}
        onSendTest={mockOnSendTest}
      />,
    );

    fireEvent.press(getByText("Daily Check-in"));
    expect(mockOnSetTime).toHaveBeenCalledTimes(1);
  });

  it("calls onSendTest when Send Test Notification is pressed", () => {
    const { getByText } = render(
      <ForecastAlerts
        smartReminder={true}
        reminderTime={mockReminderTime}
        formatTime={mockFormatTime}
        onToggleReminder={mockOnToggleReminder}
        onSetTime={mockOnSetTime}
        onSendTest={mockOnSendTest}
      />,
    );

    fireEvent.press(getByText("Send Test Notification"));
    expect(mockOnSendTest).toHaveBeenCalledTimes(1);
  });

  it("displays formatted reminder time", () => {
    mockFormatTime.mockReturnValue("14:30");

    const { getByText } = render(
      <ForecastAlerts
        smartReminder={true}
        reminderTime={mockReminderTime}
        formatTime={mockFormatTime}
        onToggleReminder={mockOnToggleReminder}
        onSetTime={mockOnSetTime}
        onSendTest={mockOnSendTest}
      />,
    );

    expect(getByText("14:30")).toBeTruthy();
    expect(mockFormatTime).toHaveBeenCalledWith(mockReminderTime);
  });

  it("renders BellRinging icon", () => {
    const { UNSAFE_getByType } = render(
      <ForecastAlerts
        smartReminder={true}
        reminderTime={mockReminderTime}
        formatTime={mockFormatTime}
        onToggleReminder={mockOnToggleReminder}
        onSetTime={mockOnSetTime}
        onSendTest={mockOnSendTest}
      />,
    );

    const BellRinging = require("phosphor-react-native").BellRinging;
    expect(() => UNSAFE_getByType(BellRinging)).not.toThrow();
  });

  it("renders PaperPlaneRight icon when reminder is enabled", () => {
    const { UNSAFE_getByType } = render(
      <ForecastAlerts
        smartReminder={true}
        reminderTime={mockReminderTime}
        formatTime={mockFormatTime}
        onToggleReminder={mockOnToggleReminder}
        onSetTime={mockOnSetTime}
        onSendTest={mockOnSendTest}
      />,
    );

    const PaperPlaneRight = require("phosphor-react-native").PaperPlaneRight;
    expect(() => UNSAFE_getByType(PaperPlaneRight)).not.toThrow();
  });

  it("switch shows correct value", () => {
    const { UNSAFE_getByType } = render(
      <ForecastAlerts
        smartReminder={true}
        reminderTime={mockReminderTime}
        formatTime={mockFormatTime}
        onToggleReminder={mockOnToggleReminder}
        onSetTime={mockOnSetTime}
        onSendTest={mockOnSendTest}
      />,
    );

    const Switch = require("react-native").Switch;
    const switchComponent = UNSAFE_getByType(Switch);
    expect(switchComponent.props.value).toBe(true);
  });
});
