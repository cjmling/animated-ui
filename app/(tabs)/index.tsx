import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MenuItem } from "../components/MenuItem";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to the Demo</Text>
      <View style={styles.menuContainer}>
        <MenuItem
          href="/vertical-scroll-select"
          label="Vertical Scroll Select Demo"
        />
        <MenuItem href="/sent-money" label="Sent Money Demo" />
        <MenuItem href="/hidden-password" label="Hidden Password Demo" />
        <MenuItem href="/circular-clock" label="Circular Clock Demo" />
        <MenuItem href="/group-button" label="Group Button Demo" />
        <MenuItem href="/paginated-scroll" label="Paginated Scroll Demo" />
        <MenuItem href="/tabed-scroll" label="Tabed Scroll Demo" />
        <MenuItem
          href="/vertical-paginated-scroll"
          label="Vertical Paginated Scroll Demo"
        />
        <MenuItem href="/circular-carousal" label="Circular Carousal Demo" />
        <MenuItem href="/carousal-widget" label="Carousal Widget Demo" />
        <MenuItem href="/caraousal-select" label="Carousal Select Demo" />
        <MenuItem href="/number-select" label="Number Select Demo" />
        <MenuItem href="/coffee-select" label="Coffee Select Demo" />
        <MenuItem href="/number-selector" label="Number Selector Demo" />
        <MenuItem
          href="/auto-carousal-widget"
          label="Auto Carousal Widget Demo"
        />
        <MenuItem href="/stack-cards" label="Stack Cards Demo" />
        <MenuItem href="/bouncing-cards" label="Bouncing Cards Demo" />
        <MenuItem
          href="/spotify-vertical-scroll"
          label="Spotify Vertical Scroll Demo"
        />
        <MenuItem href="/merging-buttons" label="Merging Buttons Demo" />
        <MenuItem href="/slot-number" label="Slot Number Demo" />
        <MenuItem href="/bottom-tabs" label="Bottom Tabs Demo" />
      </View>
    </ScrollView>
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
