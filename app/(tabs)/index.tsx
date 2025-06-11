import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Demo</Text>
        <Link href="/group-button" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Go to Group Button Demo</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  linkButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
  },
  linkText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
