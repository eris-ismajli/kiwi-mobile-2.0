import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { goBackHeaderStyles } from "./styles/GoBackNavStyles";

import { useEffect } from "react";
import { BackHandler } from "react-native";

function GoBackHeaderNav({
  insets,
  canGoBack,
  goBack,
  currentUrl,
  historyStack,
}) {
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack) {
        goBack(); // Go back in the WebView
        return true; // ✅ prevent the app from closing
      }
      return false; // allow default behavior (exit app)
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [canGoBack, goBack]);

  const handleBackPress = () => {
    goBack();
  };

  const previousUrl = historyStack.length - 2;

  const cantGoBack =
    !canGoBack ||
    currentUrl.includes("login") ||
    historyStack[previousUrl]?.includes("login");

  if (cantGoBack) {
    return (
      <View
        style={{ height: insets.top, backgroundColor: "rgba(41, 172, 238, 1)" }}
      />
    );
  }

  return (
    <View style={[goBackHeaderStyles.header, { paddingTop: insets.top }]}>
      <View style={goBackHeaderStyles.leftSection}>
        <TouchableOpacity
          style={goBackHeaderStyles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={goBackHeaderStyles.headerTitle}>Kiwi LMS</Text>

      <View style={goBackHeaderStyles.rightSection} />
    </View>
  );
}

export default GoBackHeaderNav;
