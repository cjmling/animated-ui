import { TopTab } from "@/components/TopTab";
import React from "react";
import { Text, View } from "react-native";

export default function TopTabScreen() {
  return (
    <TopTab
      screens={[
        <View
          key="1"
          style={{
            flex: 1,
            backgroundColor: "#333",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 96, fontWeight: "bold" }}>
            1
          </Text>
        </View>,
        <View
          key="2"
          style={{
            flex: 1,
            backgroundColor: "#444",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 96, fontWeight: "bold" }}>
            2
          </Text>
        </View>,
        <View
          key="3"
          style={{
            flex: 1,
            backgroundColor: "#555",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 96, fontWeight: "bold" }}>
            3
          </Text>
        </View>,
      ]}
    />
  );
}
