import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Demo</Text>
      <View style={styles.menuContainer}>
        <Link href="/group-button" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Group Button Demo</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/top-tab" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Top Tab Demo</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuContainer: {
    width: "100%",
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  menuText: {
    fontSize: 16,
    color: "#007AFF",
  },
});
