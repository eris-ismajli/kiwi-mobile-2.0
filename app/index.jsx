import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StatusBar,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import * as NavigationBar from "expo-navigation-bar";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import BottomNav from "./components/BottomNav";
import GoBackHeaderNav from "./components/GoBackHeaderNav";
import PullToRefresh from "./components/PullToRefresh";

export default function Index() {
  const KIWI_URL = "https://demo.startkiwi.com/dashboard";

  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState("home");
  const [currentUrl, setCurrentUrl] = useState(KIWI_URL);
  const [historyStack, setHistoryStack] = useState([KIWI_URL]);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true); // Add this state
  const insets = useSafeAreaInsets();

  const lastUrlRef = useRef(KIWI_URL);
  const isManualBackRef = useRef(false);

  // Update history stack whenever currentUrl changes
  useEffect(() => {
    if (lastUrlRef.current === currentUrl) return;

    // Don't update history stack if this is a manual back navigation
    if (isManualBackRef.current) {
      isManualBackRef.current = false;
      lastUrlRef.current = currentUrl;
      return;
    }

    setHistoryStack((prev) => {
      const newStack = [...prev, currentUrl];
      setCanGoBack(newStack.length > 1);
      return newStack;
    });

    lastUrlRef.current = currentUrl;
  }, [currentUrl]);

  // Android navigation bar styling
  useEffect(() => {
    if (Platform.OS === "android") {
      const setNavBar = async () => {
        await NavigationBar.setBackgroundColorAsync("#FFFFFF");
        await NavigationBar.setButtonStyleAsync("dark");
      };
      setNavBar();
    }
  }, []);

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    webviewRef.current?.reload();
  };

  // Bottom navigation handler
  const handleBottomNavPress = (route, routeId) => {
    setActiveRoute(routeId);

    // Use SPA-friendly navigation via pushState
    const smoothNavigation = `
      (function() {
        if (window.history && window.history.pushState) {
          window.history.pushState({}, '', '${route}');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'urlChange',
          url: window.location.href
        }));
      })();
      true;
    `;

    webviewRef.current?.injectJavaScript(smoothNavigation);
  };

  // WebView navigation state updates
  const onNavigationStateChange = (navState) => {
    const url = navState.url;

    // Only update if URL changed
    if (lastUrlRef.current !== url) {
      setCurrentUrl(url);
    }

    // Determine active route
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

    // Set the flag to prevent history stack update
    isManualBackRef.current = true;

    // Don't setCurrentUrl here - let the WebView message update it
    setHistoryStack(newStack);
    setCanGoBack(newStack.length > 1);

    // Use pushState instead of history.back() to prevent refresh
    webviewRef.current?.injectJavaScript(`
      (function() {
        if (window.history && window.history.pushState) {
          window.history.pushState({}, '', '${previousUrl}');
          window.dispatchEvent(new PopStateEvent('popstate'));
          
          // Post message to update React state
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'urlChange',
            url: '${previousUrl}'
          }));
        }
      })();
      true;
    `);
  };

  // Handle scroll messages from WebView
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "urlChange") {
        setCurrentUrl(data.url);
      } else if (data.type === "scroll") {
        // Update isAtTop based on actual scroll position
        setIsAtTop(data.scrollY === 0);
      }
    } catch (error) {
      console.log("WebView message error:", error);
    }
  };

  const scrollDetector = `
    let isScrolling;
    window.addEventListener('scroll', function() {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'scroll',
          scrollY: window.scrollY
        }));
      }, 50);
    }, false);

    window.addEventListener('popstate', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'popstate',
        url: window.location.href
      }));
    });

    // Initial scroll position
    window.ReactNativeWebView.postMessage(JSON.stringify({ 
      type: 'scroll', 
      scrollY: window.scrollY 
    }));
  `;

  const preventZoom = `
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    document.getElementsByTagName('head')[0].appendChild(meta);
  `;

  const combinedScript = `
    ${scrollDetector}
    ${preventZoom}
    true
  `;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
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
        />
        <View style={{ flex: 1 }}>
          <PullToRefresh
            onRefresh={handleRefresh}
            isAtTop={isAtTop} // Use actual scroll position
            currentUrl={currentUrl}
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
