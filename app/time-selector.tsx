import { TimeSelector } from "@/components/TimeSelector";
import { View } from "react-native";

export default function TimeSelectorScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TimeSelector />
    </View>
  );
}
