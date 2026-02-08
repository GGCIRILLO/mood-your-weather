import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ChangePasswordModal } from "../ChangePasswordModal";

describe("ChangePasswordModal", () => {
  const mockOnClose = jest.fn();
  const mockOnChangeCurrentPassword = jest.fn();
  const mockOnChangeNewPassword = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when visible", () => {
    const { getByText, getByPlaceholderText } = render(
      <ChangePasswordModal
        visible={true}
        currentPassword=""
        newPassword=""
        isLoading={false}
        onClose={mockOnClose}
        onChangeCurrentPassword={mockOnChangeCurrentPassword}
        onChangeNewPassword={mockOnChangeNewPassword}
        onUpdate={mockOnUpdate}
      />,
    );

    expect(getByText("Change Password")).toBeTruthy();
    expect(
      getByText(
        "Enter your current password and a new secure password (min 6 chars).",
      ),
    ).toBeTruthy();
    expect(getByPlaceholderText("Current Password")).toBeTruthy();
    expect(getByPlaceholderText("New Password")).toBeTruthy();
    expect(getByText("Update Password")).toBeTruthy();
  });

  it("matches snapshot when visible", () => {
    const tree = render(
      <ChangePasswordModal
        visible={true}
        currentPassword=""
        newPassword=""
        isLoading={false}
        onClose={mockOnClose}
        onChangeCurrentPassword={mockOnChangeCurrentPassword}
        onChangeNewPassword={mockOnChangeNewPassword}
        onUpdate={mockOnUpdate}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <ChangePasswordModal
        visible={false}
        currentPassword=""
        newPassword=""
        isLoading={false}
        onClose={mockOnClose}
        onChangeCurrentPassword={mockOnChangeCurrentPassword}
        onChangeNewPassword={mockOnChangeNewPassword}
        onUpdate={mockOnUpdate}
      />,
    );

    expect(queryByText("Change Password")).toBeNull();
  });

  it("calls onClose when X button is pressed", () => {
    const { getByTestId } = render(
      <ChangePasswordModal
        visible={true}
        currentPassword=""
        newPassword=""
        isLoading={false}
        onClose={mockOnClose}
        onChangeCurrentPassword={mockOnChangeCurrentPassword}
        onChangeNewPassword={mockOnChangeNewPassword}
        onUpdate={mockOnUpdate}
      />,
    );

    const closeButton = getByTestId("close-modal-button");
    fireEvent.press(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onChangeCurrentPassword when current password input changes", () => {
    const { getByPlaceholderText } = render(
      <ChangePasswordModal
        visible={true}
        currentPassword=""
        newPassword=""
        isLoading={false}
        onClose={mockOnClose}
        onChangeCurrentPassword={mockOnChangeCurrentPassword}
        onChangeNewPassword={mockOnChangeNewPassword}
        onUpdate={mockOnUpdate}
      />,
    );

    const input = getByPlaceholderText("Current Password");
    fireEvent.changeText(input, "oldpassword123");

    expect(mockOnChangeCurrentPassword).toHaveBeenCalledWith("oldpassword123");
  });

  it("calls onChangeNewPassword when new password input changes", () => {
    const { getByPlaceholderText } = render(
      <ChangePasswordModal
        visible={true}
        currentPassword=""
        newPassword=""
        isLoading={false}
        onClose={mockOnClose}
        onChangeCurrentPassword={mockOnChangeCurrentPassword}
        onChangeNewPassword={mockOnChangeNewPassword}
        onUpdate={mockOnUpdate}
      />,
    );

    const input = getByPlaceholderText("New Password");
    fireEvent.changeText(input, "newpassword456");

    expect(mockOnChangeNewPassword).toHaveBeenCalledWith("newpassword456");
  });

  it("calls onUpdate when Update Password button is pressed", () => {
    const { getByText } = render(
      <ChangePasswordModal
        visible={true}
        currentPassword="old"
        newPassword="new"
        isLoading={false}
        onClose={mockOnClose}
        onChangeCurrentPassword={mockOnChangeCurrentPassword}
        onChangeNewPassword={mockOnChangeNewPassword}
        onUpdate={mockOnUpdate}
      />,
    );

    fireEvent.press(getByText("Update Password"));
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when isLoading is true", () => {
    const { getByText, queryByText } = render(
      <ChangePasswordModal
        visible={true}
        currentPassword="old"
        newPassword="new"
        isLoading={true}
        onClose={mockOnClose}
        onChangeCurrentPassword={mockOnChangeCurrentPassword}
        onChangeNewPassword={mockOnChangeNewPassword}
        onUpdate={mockOnUpdate}
      />,
    );

    expect(getByText("Updating...")).toBeTruthy();
    expect(queryByText("Update Password")).toBeNull();
  });

  it("disables update button when isLoading is true", () => {
    const { getByTestId } = render(
      <ChangePasswordModal
        visible={true}
        currentPassword=""
        newPassword=""
        isLoading={true}
        onClose={mockOnClose}
        onChangeCurrentPassword={mockOnChangeCurrentPassword}
        onChangeNewPassword={mockOnChangeNewPassword}
        onUpdate={mockOnUpdate}
      />,
    );

    const button = getByTestId("update-button");
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it("has secureTextEntry on both password inputs", () => {
    const { getByPlaceholderText } = render(
      <ChangePasswordModal
        visible={true}
        currentPassword=""
        newPassword=""
        isLoading={false}
        onClose={mockOnClose}
        onChangeCurrentPassword={mockOnChangeCurrentPassword}
        onChangeNewPassword={mockOnChangeNewPassword}
        onUpdate={mockOnUpdate}
      />,
    );

    const currentPasswordInput = getByPlaceholderText("Current Password");
    const newPasswordInput = getByPlaceholderText("New Password");

    expect(currentPasswordInput.props.secureTextEntry).toBe(true);
    expect(newPasswordInput.props.secureTextEntry).toBe(true);
  });

  it("renders X icon for close button", () => {
    const { UNSAFE_getByType } = render(
      <ChangePasswordModal
        visible={true}
        currentPassword=""
        newPassword=""
        isLoading={false}
        onClose={mockOnClose}
        onChangeCurrentPassword={mockOnChangeCurrentPassword}
        onChangeNewPassword={mockOnChangeNewPassword}
        onUpdate={mockOnUpdate}
      />,
    );

    const XIcon = require("phosphor-react-native").X;
    expect(() => UNSAFE_getByType(XIcon)).not.toThrow();
  });
});
