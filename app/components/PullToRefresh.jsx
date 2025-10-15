import React, { useRef, useState } from "react";
import { ScrollView, RefreshControl, StyleSheet, Platform } from "react-native";

export default function PullToRefresh({ children, onRefresh, isAtTop = true, currentUrl = "" }) {
  const scrollRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const viewingCourse = currentUrl.includes("course/") || currentUrl.includes("scorm");

  const handleRefresh = async () => {
    if (!isAtTop || viewingCourse) return;

    setRefreshing(true);
    try {
      await onRefresh?.();
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
