import { VerticalScrollSelect } from "@/components/VerticalScrollSelect";
import { useState } from "react";
import { Text, View } from "react-native";

export default function VerticalScrollSelectScreen() {
  const [selected, setSelected] = useState(2);
  const LABELS = [
    "6:00 pm",
    "6:30 pm",
    "7:00 pm",
    "7:30 pm",
    "8:00 pm",
    "8:30 pm",
    "9:00 pm",
    "9:30 pm",
  ];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
      }}
    >
      <View style={{}}>
        <Text style={{ color: "#000" }}>{LABELS[selected]}</Text>
      </View>
      <VerticalScrollSelect
        selected={selected}
        setSelected={setSelected}
        labels={LABELS}
      />
    </View>
  );
}
