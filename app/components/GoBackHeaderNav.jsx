import {
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { goBackHeaderStyles } from "./styles/GoBackNavStyles";

function GoBackHeaderNav({ insets, canGoBack, goBack, currentUrl }) {
  const handleBackPress = () => {
    goBack();
  };

  const cantGoBack = !canGoBack || currentUrl.includes("messages") || currentUrl.includes("login")

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
