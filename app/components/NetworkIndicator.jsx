import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { WifiOff } from "lucide-react-native";

import { networkIndicatorStyles } from "./styles/NetworkIndicatorStyles";

const OfflineOverlay = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const notificationOpacity = new Animated.Value(0);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setIsOffline(true);
      } else {
        setIsOffline(false);
        showOnlineNotification();
      }
    });

    return () => unsubscribe();
  }, [isOffline]);

  // const showOnlineNotification = () => {
  //   setShowNotification(true);
  //   Animated.timing(notificationOpacity, {
  //     toValue: 1,
  //     duration: 300,
  //     useNativeDriver: true,
  //   }).start();
  // };

  const showOnlineNotification = () => {
    setShowNotification(true);
    Animated.timing(notificationOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(notificationOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowNotification(false));
      }, 3500);
    });
  };

  if (!isOffline && !showNotification) return null;

  return (
    <>
      {isOffline && (
        <View style={networkIndicatorStyles.overlay}>
          <WifiOff size={60} color="#900" />

          <Text style={networkIndicatorStyles.title}>You are offline</Text>
          <Text style={networkIndicatorStyles.subtitle}>
            Check your internet connection to continue
          </Text>
        </View>
      )}
      {showNotification && (
        <Animated.View
          style={[
            networkIndicatorStyles.notification,
            { opacity: notificationOpacity },
          ]}
        >
          <Text style={networkIndicatorStyles.notificationText}>
            Back online
          </Text>
        </Animated.View>
      )}
    </>
  );
};

export default OfflineOverlay;
