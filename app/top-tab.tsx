import { TopTab } from "@/components/TopTab";
import React from "react";
import { Text, View } from "react-native";

export default function TopTabScreen() {
  return (
    <TopTab
      screens={[
        <View key="1" style={{ flex: 1, backgroundColor: "red" }}>
          <Text>1</Text>
        </View>,
        <View key="2" style={{ flex: 1, backgroundColor: "blue" }}>
          <Text>2</Text>
        </View>,
        <View key="3" style={{ flex: 1, backgroundColor: "green" }}>
          <Text>3</Text>
        </View>,
      ]}
    />
  );
}
