import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TimePickerModal } from "../TimePickerModal";
import { Platform } from "react-native";

// Mock DateTimePicker
jest.mock("@react-native-community/datetimepicker", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) => <View testID="date-time-picker" {...props} />,
  };
});

describe("TimePickerModal", () => {
  const mockOnClose = jest.fn();
  const mockOnTimeChange = jest.fn();
  const mockReminderTime = new Date("2024-01-01T09:00:00");

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Platform.OS before each test (default to ios)
    Platform.OS = "ios";
  });

  describe("iOS Platform", () => {
    it("renders correctly when visible", () => {
      Platform.OS = "ios";
      const { getByTestId, getByText } = render(
        <TimePickerModal
          visible={true}
          reminderTime={mockReminderTime}
          onClose={mockOnClose}
          onTimeChange={mockOnTimeChange}
        />,
      );

      expect(getByTestId("date-time-picker")).toBeTruthy();
      expect(getByText("Set Reminder Time")).toBeTruthy();
    });

    it("calls onClose when backdrop or Close button is pressed", () => {
      Platform.OS = "ios";
      const { getByTestId } = render(
        <TimePickerModal
          visible={true}
          reminderTime={mockReminderTime}
          onClose={mockOnClose}
          onTimeChange={mockOnTimeChange}
        />,
      );

      fireEvent.press(getByTestId("close-modal-button"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);

      fireEvent.press(getByTestId("done-modal-button"));
      expect(mockOnClose).toHaveBeenCalledTimes(2);
    });

    it("does not render when not visible", () => {
      Platform.OS = "ios";
      const { queryByTestId } = render(
        <TimePickerModal
          visible={false}
          reminderTime={mockReminderTime}
          onClose={mockOnClose}
          onTimeChange={mockOnTimeChange}
        />,
      );

      expect(queryByTestId("date-time-picker")).toBeNull();
    });
  });

  describe("Android Platform", () => {
    it("renders only DateTimePicker when visible", () => {
      Platform.OS = "android";
      const { getByTestId, queryByText } = render(
        <TimePickerModal
          visible={true}
          reminderTime={mockReminderTime}
          onClose={mockOnClose}
          onTimeChange={mockOnTimeChange}
        />,
      );

      expect(getByTestId("date-time-picker")).toBeTruthy();
      expect(queryByText("Set Reminder Time")).toBeNull();
    });

    it("renders nothing when not visible", () => {
      Platform.OS = "android";
      const { queryByTestId } = render(
        <TimePickerModal
          visible={false}
          reminderTime={mockReminderTime}
          onClose={mockOnClose}
          onTimeChange={mockOnTimeChange}
        />,
      );

      expect(queryByTestId("date-time-picker")).toBeNull();
    });
  });

  it("passes reminderTime and onChange to DateTimePicker", () => {
    Platform.OS = "ios";
    const { getByTestId } = render(
      <TimePickerModal
        visible={true}
        reminderTime={mockReminderTime}
        onClose={mockOnClose}
        onTimeChange={mockOnTimeChange}
      />,
    );

    const picker = getByTestId("date-time-picker");
    expect(picker.props.value).toBe(mockReminderTime);
    expect(picker.props.onChange).toBe(mockOnTimeChange);
  });
});
