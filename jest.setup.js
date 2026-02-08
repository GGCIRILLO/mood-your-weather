// Mock expo-av Audio module
jest.mock("expo-av", () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() =>
        Promise.resolve({
          sound: {
            playAsync: jest.fn(),
            pauseAsync: jest.fn(),
            stopAsync: jest.fn(),
            unloadAsync: jest.fn(),
            setPositionAsync: jest.fn(),
            getStatusAsync: jest.fn(() =>
              Promise.resolve({
                isLoaded: true,
                isPlaying: false,
                positionMillis: 0,
                durationMillis: 100000,
              })
            ),
            setOnPlaybackStatusUpdate: jest.fn(),
          },
          status: {
            isLoaded: true,
            isPlaying: false,
            positionMillis: 0,
            durationMillis: 100000,
          },
        })
      ),
    },
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
  },
}));

// Mock @react-native-community/slider
jest.mock("@react-native-community/slider", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props) => <View testID="slider" {...props} />,
  };
});

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});
