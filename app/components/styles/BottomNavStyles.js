import { StyleSheet } from "react-native";

export const bottomNavStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FBFBFD",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 8,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
    letterSpacing: -0.24,
  },
});
