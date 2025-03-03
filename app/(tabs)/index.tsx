import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Image source={require("@/assets/images/partial-react-logo.png")} style={styles.reactLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText variant="extra-small">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText variant="large">Step 1: Try it</ThemedText>
        <ThemedText variant="extra-large">
          Edit <ThemedText variant="extra-large">app/(tabs)/index.tsx</ThemedText> to see changes. Press{" "}
          <ThemedText variant="extra-large">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText variant="large">Step 2: Explore</ThemedText>
        <ThemedText variant="extra-large">
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText variant="large">Step 3: Get a fresh start</ThemedText>
        <ThemedText variant="extra-large">
          When you're ready, run <ThemedText variant="extra-large">npm run reset-project</ThemedText> to get a fresh{" "}
          <ThemedText variant="extra-large">app</ThemedText> directory. This will move the current{" "}
          <ThemedText variant="extra-large">app</ThemedText> to{" "}
          <ThemedText variant="extra-large">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
