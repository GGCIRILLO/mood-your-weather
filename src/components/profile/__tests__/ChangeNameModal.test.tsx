import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ChangeNameModal } from "../ChangeNameModal";

describe("ChangeNameModal", () => {
  const mockOnClose = jest.fn();
  const mockOnChangeName = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when visible", () => {
    const { getByText, getByPlaceholderText } = render(
      <ChangeNameModal
        visible={true}
        name="John Doe"
        isLoading={false}
        onClose={mockOnClose}
        onChangeName={mockOnChangeName}
        onUpdate={mockOnUpdate}
      />,
    );

    expect(getByText("Change Name")).toBeTruthy();
    expect(getByText("Enter your new display name.")).toBeTruthy();
    expect(getByPlaceholderText("Display Name")).toBeTruthy();
    expect(getByText("Update Name")).toBeTruthy();
  });

  it("matches snapshot when visible", () => {
    const tree = render(
      <ChangeNameModal
        visible={true}
        name="John Doe"
        isLoading={false}
        onClose={mockOnClose}
        onChangeName={mockOnChangeName}
        onUpdate={mockOnUpdate}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <ChangeNameModal
        visible={false}
        name="John Doe"
        isLoading={false}
        onClose={mockOnClose}
        onChangeName={mockOnChangeName}
        onUpdate={mockOnUpdate}
      />,
    );

    expect(queryByText("Change Name")).toBeNull();
  });

  it("calls onClose when X button is pressed", () => {
    const { getByTestId } = render(
      <ChangeNameModal
        visible={true}
        name="John Doe"
        isLoading={false}
        onClose={mockOnClose}
        onChangeName={mockOnChangeName}
        onUpdate={mockOnUpdate}
      />,
    );

    // Find the close button by testID
    const closeButton = getByTestId("close-modal-button");
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onChangeName when text input changes", () => {
    const { getByPlaceholderText } = render(
      <ChangeNameModal
        visible={true}
        name="John Doe"
        isLoading={false}
        onClose={mockOnClose}
        onChangeName={mockOnChangeName}
        onUpdate={mockOnUpdate}
      />,
    );

    const input = getByPlaceholderText("Display Name");
    fireEvent.changeText(input, "Jane Smith");

    expect(mockOnChangeName).toHaveBeenCalledWith("Jane Smith");
  });

  it("calls onUpdate when Update Name button is pressed", () => {
    const { getByText } = render(
      <ChangeNameModal
        visible={true}
        name="John Doe"
        isLoading={false}
        onClose={mockOnClose}
        onChangeName={mockOnChangeName}
        onUpdate={mockOnUpdate}
      />,
    );

    fireEvent.press(getByText("Update Name"));
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when isLoading is true", () => {
    const { getByText, queryByText } = render(
      <ChangeNameModal
        visible={true}
        name="John Doe"
        isLoading={true}
        onClose={mockOnClose}
        onChangeName={mockOnChangeName}
        onUpdate={mockOnUpdate}
      />,
    );

    expect(getByText("Updating...")).toBeTruthy();
    expect(queryByText("Update Name")).toBeNull();
  });

  it("disables update button when isLoading is true", () => {
    const { getByTestId } = render(
      <ChangeNameModal
        visible={true}
        name="John Doe"
        isLoading={true}
        onClose={mockOnClose}
        onChangeName={mockOnChangeName}
        onUpdate={mockOnUpdate}
      />,
    );

    const button = getByTestId("update-button");
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it("displays the current name in the input", () => {
    const { getByDisplayValue } = render(
      <ChangeNameModal
        visible={true}
        name="John Doe"
        isLoading={false}
        onClose={mockOnClose}
        onChangeName={mockOnChangeName}
        onUpdate={mockOnUpdate}
      />,
    );

    expect(getByDisplayValue("John Doe")).toBeTruthy();
  });

  it("renders X icon for close button", () => {
    const { UNSAFE_getByType } = render(
      <ChangeNameModal
        visible={true}
        name="John Doe"
        isLoading={false}
        onClose={mockOnClose}
        onChangeName={mockOnChangeName}
        onUpdate={mockOnUpdate}
      />,
    );

    const XIcon = require("phosphor-react-native").X;
    expect(() => UNSAFE_getByType(XIcon)).not.toThrow();
  });
});
