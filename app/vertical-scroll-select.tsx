import { VerticalScrollSelect } from "@/components/VerticalScrollSelect";
import { useState } from "react";
import { Text, View } from "react-native";

export default function VerticalScrollSelectScreen() {
  const [selected, setSelected] = useState(10);
  const LABELS = [
    { label: "6:00 pm", value: 0 },
    { label: "6:30 pm", value: 1 },
    { label: "7:00 pm", value: 2 },
    { label: "7:30 pm", value: 3 },
    { label: "8:00 pm", value: 4 },
    { label: "8:30 pm", value: 5 },
    { label: "9:00 pm", value: 6 },
    { label: "9:30 pm", value: 7 },
    { label: "10:00 pm", value: 8 },
    { label: "10:30 pm", value: 9 },
    { label: "11:00 pm", value: 10 },
    { label: "11:30 pm", value: 11 },
    { label: "12:00 am", value: 12 },
    { label: "12:30 am", value: 13 },
    { label: "1:00 am", value: 14 },
    { label: "1:30 am", value: 15 },
    { label: "2:00 am", value: 16 },
    { label: "2:30 am", value: 17 },
    { label: "3:00 am", value: 18 },
    { label: "3:30 am", value: 19 },
    { label: "4:00 am", value: 20 },
    { label: "4:30 am", value: 21 },
    { label: "5:00 am", value: 22 },
    { label: "5:30 am", value: 23 },
    { label: "6:00 am", value: 24 },
    { label: "6:30 am", value: 25 },
    { label: "7:00 am", value: 26 },
    { label: "7:30 am", value: 27 },
    { label: "8:00 am", value: 28 },
    { label: "8:30 am", value: 29 },
    { label: "9:00 am", value: 30 },
    { label: "9:30 am", value: 31 },
    { label: "10:00 am", value: 32 },
    { label: "10:30 am", value: 33 },
    { label: "11:00 am", value: 34 },
    { label: "11:30 am", value: 35 },
    { label: "12:00 pm", value: 36 },
    { label: "12:30 pm", value: 37 },
    { label: "1:00 pm", value: 38 },
    { label: "1:30 pm", value: 39 },
    { label: "2:00 pm", value: 40 },
    { label: "2:30 pm", value: 41 },
    { label: "3:00 pm", value: 42 },
    { label: "3:30 pm", value: 43 },
    { label: "4:00 pm", value: 44 },
    { label: "4:30 pm", value: 45 },
    { label: "5:00 pm", value: 46 },
    { label: "5:30 pm", value: 47 },
  ];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
        backgroundColor: "#FFF",
      }}
    >
      <View style={{}}>
        <Text style={{ color: "#000" }}>{LABELS[selected].label}</Text>
      </View>
      <VerticalScrollSelect
        selected={selected}
        setSelected={setSelected}
        labels={LABELS}
        backgroundColor="#FFF"
        fontColor="#000"
        fadedFontColor="#AAA"
      />
    </View>
  );
}
