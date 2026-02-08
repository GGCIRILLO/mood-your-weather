import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ProfileHeader } from "../ProfileHeader";

describe("ProfileHeader", () => {
  const mockOnPickImage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with display name", () => {
    const { getByText } = render(
      <ProfileHeader
        displayName="John Doe"
        profileImage={null}
        onPickImage={mockOnPickImage}
      />,
    );

    expect(getByText("John Doe")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const tree = render(
      <ProfileHeader
        displayName="John Doe"
        profileImage={null}
        onPickImage={mockOnPickImage}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with profile image", () => {
    const { UNSAFE_getByType } = render(
      <ProfileHeader
        displayName="John Doe"
        profileImage="https://example.com/profile.jpg"
        onPickImage={mockOnPickImage}
      />,
    );

    const Image = require("expo-image").Image;
    expect(() => UNSAFE_getByType(Image)).not.toThrow();
  });

  it("renders placeholder icon when no profile image", () => {
    const { UNSAFE_getByType } = render(
      <ProfileHeader
        displayName="John Doe"
        profileImage={null}
        onPickImage={mockOnPickImage}
      />,
    );

    const UserCircle = require("phosphor-react-native").UserCircle;
    expect(() => UNSAFE_getByType(UserCircle)).not.toThrow();
  });

  it("displays default name when display name is empty", () => {
    const { getByText } = render(
      <ProfileHeader
        displayName=""
        profileImage={null}
        onPickImage={mockOnPickImage}
      />,
    );

    expect(getByText("Alex Storm")).toBeTruthy();
  });

  it("calls onPickImage when avatar is pressed", () => {
    const { getByTestId } = render(
      <ProfileHeader
        displayName="John Doe"
        profileImage={null}
        onPickImage={mockOnPickImage}
      />,
    );

    // Press the main avatar button
    fireEvent.press(getByTestId("profile-avatar-button"));
    expect(mockOnPickImage).toHaveBeenCalledTimes(1);
  });

  it("calls onPickImage when edit button is pressed", () => {
    const { getByTestId } = render(
      <ProfileHeader
        displayName="John Doe"
        profileImage={null}
        onPickImage={mockOnPickImage}
      />,
    );

    // Press the edit button
    fireEvent.press(getByTestId("edit-avatar-button"));
    expect(mockOnPickImage).toHaveBeenCalledTimes(1);
  });

  it("renders PencilSimple icon for edit button", () => {
    const { UNSAFE_getByType } = render(
      <ProfileHeader
        displayName="John Doe"
        profileImage={null}
        onPickImage={mockOnPickImage}
      />,
    );

    const PencilSimple = require("phosphor-react-native").PencilSimple;
    expect(() => UNSAFE_getByType(PencilSimple)).not.toThrow();
  });
});
