import { HiddenPassword } from "@/components/HiddenPassword";
import { View } from "react-native";
export default function HiddenPasswordScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#70A3F7",
      }}
    >
      <HiddenPassword />
    </View>
  );
}
