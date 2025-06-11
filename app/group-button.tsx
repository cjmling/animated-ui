import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { GroupButton } from "../components/GroupButton";

export default function GroupButtonScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handlePress = (index: number) => {
    setSelectedIndex(index);
  };

  const buttons = [
    { label: "Option 1", onPress: () => handlePress(0) },
    { label: "Option 2", onPress: () => handlePress(1) },
    { label: "Option 3", onPress: () => handlePress(2) },
  ];

  return (
    <View style={styles.container}>
      <GroupButton
        buttons={buttons}
        selectedIndex={selectedIndex}
        onSelect={handlePress}
      />
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
