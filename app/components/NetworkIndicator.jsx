import NetInfo from "@react-native-community/netinfo";
import { WifiOff } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

import { networkIndicatorStyles } from "./styles/NetworkIndicatorStyles";

const OfflineOverlay = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setIsOffline(true);
      } else {
        if (isOffline) {
          setIsOffline(false);
          showBackOnlineToast();
        }
      }
    });

    return () => unsubscribe();
  }, [isOffline]);

  const showBackOnlineToast = () => {
    setShowToast(true);
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowToast(false));
      }, 3000);
    });
  };

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

      {showToast && (
        <Animated.View
          style={[networkIndicatorStyles.toast, { opacity: toastOpacity }]}
        >
          <Text style={networkIndicatorStyles.toastText}>Back online</Text>
        </Animated.View>
      )}
    </>
  );
};

export default OfflineOverlay;
