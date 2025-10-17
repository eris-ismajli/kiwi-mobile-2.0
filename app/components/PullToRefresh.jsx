import React, { useRef, useState } from "react";
import { ScrollView, RefreshControl, StyleSheet, Platform } from "react-native";

export default function PullToRefresh({
  children,
  onRefresh,
  isAtTop = true,
  currentUrl = "",
}) {
  const scrollRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const viewingCourse =
    currentUrl.includes("course/") || currentUrl.includes("scorm");

  const handleRefresh = async () => {
    if (!isAtTop || viewingCourse) return;

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
        !viewingCourse ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            enabled={isAtTop}
            tintColor="#34a0daff" // Blue-ish color
            colors={["#34a0daff"]} // For Android
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
