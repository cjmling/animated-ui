import { StyleSheet, Text, View } from "react-native";
import { MenuItem } from "../components/MenuItem";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Demo</Text>
      <View style={styles.menuContainer}>
        <MenuItem href="/group-button" label="Group Button Demo" />
        <MenuItem href="/paginated-scroll" label="Paginated Scroll Demo" />
        <MenuItem href="/tabed-scroll" label="Tabed Scroll Demo" />
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
});
