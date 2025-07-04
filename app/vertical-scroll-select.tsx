import { VerticalScrollSelect } from "@/components/VerticalScrollSelect";
import { useState } from "react";
import { Text, View } from "react-native";

export default function VerticalScrollSelectScreen() {
  const [selected, setSelected] = useState(2);
  const LABELS = [
    { label: "6:00 pm", value: 0 },
    { label: "6:30 pm", value: 1 },
    { label: "7:00 pm", value: 2 },
    { label: "7:30 pm", value: 3 },
    { label: "8:00 pm", value: 4 },
    { label: "8:30 pm", value: 5 },
    { label: "9:00 pm", value: 6 },
    { label: "9:30 pm", value: 7 },
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
        <Text style={{ color: "#000" }}>{LABELS[selected].label}</Text>
      </View>
      <VerticalScrollSelect
        selected={selected}
        setSelected={setSelected}
        labels={LABELS}
      />
    </View>
  );
}
