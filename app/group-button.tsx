import React from "react";
import { StyleSheet, View } from "react-native";
import { GroupButton } from "../components/GroupButton";

export default function GroupButtonScreen() {
  const handlePress = (label: string) => {
    console.log(`Pressed ${label}`);
  };

  const buttons = [
    { label: "Option 1", onPress: () => handlePress("Option 1") },
    { label: "Option 2", onPress: () => handlePress("Option 2") },
    { label: "Option 3", onPress: () => handlePress("Option 3") },
  ];

  return (
    <View style={styles.container}>
      <GroupButton buttons={buttons} selectedIndex={0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
