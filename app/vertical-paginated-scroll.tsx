import VerticalPaginatedScroll from "@/components/VerticalPaginatedScroll";
import { StyleSheet, Text, View } from "react-native";

const Screen1 = () => (
  <View style={[styles.screen, { backgroundColor: "#FF6B6B" }]}>
    <Text style={styles.text}>Screen 1</Text>
  </View>
);

const Screen2 = () => (
  <View style={[styles.screen, { backgroundColor: "#4ECDC4" }]}>
    <Text style={styles.text}>Screen 2</Text>
  </View>
);

const Screen3 = () => (
  <View style={[styles.screen, { backgroundColor: "#45B7D1" }]}>
    <Text style={styles.text}>Screen 3</Text>
  </View>
);

export default function VerticalPaginatedScrollScreen() {
  return (
    <VerticalPaginatedScroll
      screens={[
        <Screen1 key="screen1" />,
        <Screen2 key="screen2" />,
        <Screen3 key="screen3" />,
      ]}
      backgroundColor="#000"
      paginationRightPosition={20}
      paginationDotColor="#fff"
      paginationDotSize={8}
      paginationDotGap={8}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
});
