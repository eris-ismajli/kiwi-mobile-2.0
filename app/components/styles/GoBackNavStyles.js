import { StyleSheet } from "react-native";

export const goBackHeaderStyles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "rgba(42, 171, 235, 1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 8,
  },
  leftSection: {
    width: 50,
    alignItems: "flex-start",
  },
  rightSection: {
    width: 50,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
