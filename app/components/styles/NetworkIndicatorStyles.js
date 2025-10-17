import { StyleSheet } from "react-native";

export const networkIndicatorStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "#3d3d3d",
    fontSize: 16,
    textAlign: "center",
  },
  notification: {
    position: "absolute",
    bottom: 120,
    width: "100%",
    padding: 4,
    backgroundColor: "#34C759",
    alignItems: "center",
    zIndex: 9999,
  },
  notificationText: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 16,
  },
});
