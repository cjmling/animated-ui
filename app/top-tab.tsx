import { TopTab } from "@/components/TopTab";
import React from "react";
import { Text, View, ViewStyle } from "react-native";

interface ChildScreenProps {
  number: number;
  backgroundColor: string;
  style?: ViewStyle;
}

const ChildScreen: React.FC<ChildScreenProps> = ({
  number,
  backgroundColor,
  style,
}) => (
  <View style={{ flex: 1, padding: 20 }}>
    <View
      style={[
        {
          flex: 1,
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
        },
        style,
      ]}
    >
      <Text style={{ color: "#fff", fontSize: 96, fontWeight: "bold" }}>
        {number}
      </Text>
    </View>
  </View>
);

export default function TopTabScreen() {
  return (
    <TopTab
      screens={[
        <ChildScreen key="1" number={1} backgroundColor="#333" />,
        <ChildScreen key="2" number={2} backgroundColor="#444" />,
        <ChildScreen key="3" number={3} backgroundColor="#555" />,
      ]}
    />
  );
}
