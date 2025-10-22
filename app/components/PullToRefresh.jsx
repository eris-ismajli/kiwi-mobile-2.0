import { useRef, useState } from "react";
import { Platform, RefreshControl, ScrollView, StyleSheet } from "react-native";

export default function PullToRefresh({
  children,
  onRefresh,
  isAtTop = true,
  currentUrl = "",
  activeClasses = [],
}) {
  const scrollRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const cantRefresh =
    currentUrl.includes("course/") ||
    currentUrl.includes("scorm") ||
    !isAtTop ||
    activeClasses.length > 0;

  const handleRefresh = async () => {
    if (cantRefresh) return;

    setRefreshing(true);
    try {
      // Optional: Add a minimum delay to ensure spinner is visible
      const [refreshResult] = await Promise.all([
        Promise.resolve(onRefresh?.()),
        new Promise((resolve) => setTimeout(resolve, 1000)), // Minimum 1 second
      ]);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={Platform.OS === "ios"}
      overScrollMode="auto"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          enabled={!cantRefresh && isAtTop} // 👈 disable instead of removing
          tintColor="#34a0daff"
          colors={["#34a0daff"]}
        />
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
