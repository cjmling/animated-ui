import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { GroupButton } from "../components/GroupButton";

export default function GroupButtonScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handlePress = (index: number) => {
    setSelectedIndex(index);
  };

  const labels = ["Option 1", "Option 2", "Option 3"];

  return (
    <View style={styles.container}>
      <GroupButton
        labels={labels}
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
