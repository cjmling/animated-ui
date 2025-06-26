import { StackCards } from "@/components/StackCards";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function StackCardsScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StackCards />
    </GestureHandlerRootView>
  );
}
