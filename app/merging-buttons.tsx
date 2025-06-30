import { MergingButtons } from "@/components/MergingButtons";
import { View } from "react-native";

export default function MergingButtonsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MergingButtons
        labels={["One", "Two", "Three", "Four"]}
        selectedIndex={0}
        onSelect={() => {}}
      />
    </View>
  );
}
