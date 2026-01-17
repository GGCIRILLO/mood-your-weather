import { View, Text, StyleSheet } from "react-native";

export function InsightBubble() {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.dot} />
        <Text style={styles.text}>Looking up...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "10%",
    right: "10%",
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#135bec",
  },
  text: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});
