import * as NavigationBar from "expo-navigation-bar";
import { act, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, StatusBar, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import BottomNav from "./components/BottomNav";
import GoBackHeaderNav from "./components/GoBackHeaderNav";
import OfflineOverlay from "./components/NetworkIndicator";
import PullToRefresh from "./components/PullToRefresh";

import * as customScripts from "./CustomScripts/InjectedScripts";

export default function Index() {
  const KIWI_URL = "https://demo.startkiwi.com/dashboard";

  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState("home");
  const [currentUrl, setCurrentUrl] = useState(KIWI_URL);
  const [historyStack, setHistoryStack] = useState([KIWI_URL]);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const insets = useSafeAreaInsets();
  const lastUrlRef = useRef(KIWI_URL);
  const isManualBackRef = useRef(false);
  const [activeClasses, setActiveClasses] = useState([]);

  useEffect(() => {
    if (lastUrlRef.current === currentUrl) return;

    if (isManualBackRef.current) {
      isManualBackRef.current = false;
      lastUrlRef.current = currentUrl;
      return;
    }

    setHistoryStack((prev) => {
      if (prev[prev.length - 1] === currentUrl) return prev;
      const newStack = [...prev, currentUrl];
      setCanGoBack(newStack.length > 1);
      return newStack;
    });

    lastUrlRef.current = currentUrl;
  }, [currentUrl]);

  useEffect(() => {
    if (Platform.OS === "android") {
      const setNavBar = async () => {
        await NavigationBar.setBackgroundColorAsync("#FFFFFF");
        await NavigationBar.setButtonStyleAsync("dark");
      };
      setNavBar();
    }
  }, []);

  const handleRefresh = () => {
    webviewRef.current?.reload();
  };

  const handleBottomNavPress = (route, routeId) => {
    setActiveRoute(routeId);

    webviewRef.current?.injectJavaScript(customScripts.smoothNavigation(route));
  };

  const onNavigationStateChange = (navState) => {
    const url = navState.url;

    if (lastUrlRef.current !== url) {
      setCurrentUrl(url);
    }

    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("/learning-plan")) setActiveRoute("learning-plan");
    else if (lowerUrl.includes("/library")) setActiveRoute("library");
    else if (lowerUrl.includes("/profile")) setActiveRoute("profile");
    else if (
      lowerUrl === KIWI_URL.toLowerCase() ||
      lowerUrl.includes("/dashboard")
    )
      setActiveRoute("home");
    else setActiveRoute("unknown");
  };

  const handleBackPress = () => {
    if (historyStack.length <= 1) return;

    const newStack = historyStack.slice(0, -1);
    const previousUrl = newStack[newStack.length - 1];

    isManualBackRef.current = true;

    setHistoryStack(newStack);
    setCanGoBack(newStack.length > 1);

    webviewRef.current?.injectJavaScript(
      customScripts.preventRefreshOnBack(previousUrl)
    );
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        // 🌐 Existing logic (keep this as is)
        case "urlChange":
          setCurrentUrl(data.url);
          break;

        case "scroll":
          setIsAtTop(data.scrollY === 0);
          break;

        case "activeClasses":
          setActiveClasses(data.value);
          break;

        default:
          console.log("Unhandled message type:", data.type);
          break;
      }
    } catch (error) {
      console.log("WebView message error:", error);
    }
  };

  // const customDialog = (title) => {
  //   if (Platform.OS === "android") {
  //     return (event) => {
  //       event.preventDefault();
  //       event.present(title);
  //     };
  //   }
  //   return undefined;
  // };

  const combinedScript = useMemo(
    () => `
    ${customScripts.scrollDetector}
    ${customScripts.preventZoom}
    ${customScripts.classActivityDetector}
    true;
  `,
    []
  );

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <OfflineOverlay />
        <StatusBar
          barStyle="light-content"
          translucent={false}
          backgroundColor="rgb(1, 160, 242)"
        />
        <GoBackHeaderNav
          insets={insets}
          canGoBack={canGoBack}
          goBack={handleBackPress}
          currentUrl={currentUrl}
          historyStack={historyStack}
        />
        <View style={{ flex: 1 }}>
          <PullToRefresh
            onRefresh={handleRefresh}
            isAtTop={isAtTop}
            currentUrl={currentUrl}
            activeClasses={activeClasses}
          >
            <WebView
              ref={webviewRef}
              source={{ uri: currentUrl }}
              style={{ flex: 1 }}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              onLoadEnd={() => setLoading(false)}
              injectedJavaScript={combinedScript}
              onNavigationStateChange={onNavigationStateChange}
              onMessage={handleWebViewMessage}
              renderLoading={() => null}
              // onJsAlert={customDialog("Alert")}
              // onJsConfirm={customDialog("Confirm")}
              // onJsPrompt={customDialog("Prompt")}
            />
          </PullToRefresh>
        </View>
        <BottomNav
          activeRoute={activeRoute}
          onNavigate={handleBottomNavPress}
          currentUrl={currentUrl}
        />
        <View style={{ height: insets.bottom, backgroundColor: "#FFFFFF" }} />
        {loading && (
          <ActivityIndicator
            color="#1A73E8"
            size="large"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [{ translateX: -25 }, { translateY: -25 }],
            }}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}
