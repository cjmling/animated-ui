import { BottomTabs } from "@/components/BottomTabs";
import { View } from "react-native";

export default function BottomTabsScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222",
      }}
    >
      <BottomTabs
        labels={["H", "S", "N", "P"]}
        selectedIndex={2}
        onSelect={() => {}}
      />
    </View>
  );
}
