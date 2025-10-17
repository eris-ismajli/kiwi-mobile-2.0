import { useRef, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { bottomNavStyles } from "./styles/BottomNavStyles";

const BottomNav = ({ activeRoute, onNavigate, currentUrl }) => {
  const [isCooldown, setIsCooldown] = useState(false);
  const cooldownRef = useRef(null);

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
    if (isCooldown) return;
    if (activeRoute !== item.id) {
      console.log("Navigating to:", item.route);
      onNavigate?.(item.route, item.id);
    }

    setIsCooldown(true);
    clearTimeout(cooldownRef.current);
    cooldownRef.current = setTimeout(() => {
      setIsCooldown(false);
    }, 500);
  };

  const cantDisplay = currentUrl.includes("login");

  if (cantDisplay) return null;

  return (
    <View style={bottomNavStyles.container}>
      <View style={bottomNavStyles.navBar}>
        {navItems.map((item) => {
          const isActive = activeRoute === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={bottomNavStyles.navItem}
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
                  bottomNavStyles.navLabel,
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


export default BottomNav;

