import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BottomNav = ({ activeRoute, onNavigate, currentUrl }) => {

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: "home-outline",
      activeIcon: "home",
      route: "/dashboard",
    },
    {
      id: "learning-plan",
      label: "Learning Plan",
      icon: "school-outline",
      activeIcon: "school",
      route: "/learning-plan",
    },
    {
      id: "library",
      label: "Library",
      icon: "folder-outline",
      activeIcon: "folder",
      route: "/library",
    },
    {
      id: "profile",
      label: "Profile",
      icon: "person-outline",
      activeIcon: "person",
      route: "/profile",
    },
  ];

  const handlePress = (item) => {
    if (activeRoute !== item.id) {
      console.log("Navigating to:", item.route);
      onNavigate?.(item.route, item.id);
    }
  };

  const cantDisplay = currentUrl.includes("login")

  if (cantDisplay) {
    return
  }

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {navItems.map((item) => {
          const isActive = activeRoute === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={24}
                color={isActive ? "#01a0f2" : "#8E8E93"}
              />
              <Text
                style={[
                  styles.navLabel,
                  { color: isActive ? "#01a0f2" : "#8E8E93" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default BottomNav;

//--------------------------------------------------------------------
