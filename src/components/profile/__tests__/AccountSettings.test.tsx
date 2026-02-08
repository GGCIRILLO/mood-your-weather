import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AccountSettings } from "../AccountSettings";

describe("AccountSettings", () => {
  const mockOnChangeName = jest.fn();
  const mockOnChangePassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <AccountSettings
        onChangeName={mockOnChangeName}
        onChangePassword={mockOnChangePassword}
      />,
    );

    expect(getByText("Account Settings")).toBeTruthy();
    expect(getByText("Change Name")).toBeTruthy();
    expect(getByText("Change Password")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const tree = render(
      <AccountSettings
        onChangeName={mockOnChangeName}
        onChangePassword={mockOnChangePassword}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("calls onChangeName when Change Name is pressed", () => {
    const { getByText } = render(
      <AccountSettings
        onChangeName={mockOnChangeName}
        onChangePassword={mockOnChangePassword}
      />,
    );

    fireEvent.press(getByText("Change Name"));
    expect(mockOnChangeName).toHaveBeenCalledTimes(1);
    expect(mockOnChangePassword).not.toHaveBeenCalled();
  });

  it("calls onChangePassword when Change Password is pressed", () => {
    const { getByText } = render(
      <AccountSettings
        onChangeName={mockOnChangeName}
        onChangePassword={mockOnChangePassword}
      />,
    );

    fireEvent.press(getByText("Change Password"));
    expect(mockOnChangePassword).toHaveBeenCalledTimes(1);
    expect(mockOnChangeName).not.toHaveBeenCalled();
  });

  it("renders CaretRight icons", () => {
    const { UNSAFE_queryAllByType } = render(
      <AccountSettings
        onChangeName={mockOnChangeName}
        onChangePassword={mockOnChangePassword}
      />,
    );

    const CaretRight = require("phosphor-react-native").CaretRight;
    const icons = UNSAFE_queryAllByType(CaretRight);
    expect(icons.length).toBe(2);
  });

  it("has correct section title styling", () => {
    const { getByText } = render(
      <AccountSettings
        onChangeName={mockOnChangeName}
        onChangePassword={mockOnChangePassword}
      />,
    );

    const title = getByText("Account Settings");
    expect(title.props.style).toMatchObject(
      expect.objectContaining({
        textTransform: "uppercase",
        fontWeight: "bold",
      }),
    );
  });

  it("handles multiple presses of Change Name", () => {
    const { getByText } = render(
      <AccountSettings
        onChangeName={mockOnChangeName}
        onChangePassword={mockOnChangePassword}
      />,
    );

    const changeNameButton = getByText("Change Name");
    fireEvent.press(changeNameButton);
    fireEvent.press(changeNameButton);
    fireEvent.press(changeNameButton);

    expect(mockOnChangeName).toHaveBeenCalledTimes(3);
  });

  it("handles multiple presses of Change Password", () => {
    const { getByText } = render(
      <AccountSettings
        onChangeName={mockOnChangeName}
        onChangePassword={mockOnChangePassword}
      />,
    );

    const changePasswordButton = getByText("Change Password");
    fireEvent.press(changePasswordButton);
    fireEvent.press(changePasswordButton);

    expect(mockOnChangePassword).toHaveBeenCalledTimes(2);
  });
});
