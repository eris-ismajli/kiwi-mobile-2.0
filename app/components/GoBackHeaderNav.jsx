import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  BackHandler,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

function GoBackHeaderNav({ insets, canGoBack, goBack, currentUrl }) {
  const handleBackPress = () => {
    goBack();
  };

  if (!canGoBack || currentUrl.includes("messages")) {
    return (
      <View
        style={{ height: insets.top, backgroundColor: "rgba(41, 172, 238, 1)" }}
      />
    );
  }

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.headerTitle}>Kiwi LMS</Text>

      <View style={styles.rightSection} />
    </View>
  );
}

const styles = StyleSheet.create({
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

export default GoBackHeaderNav;
