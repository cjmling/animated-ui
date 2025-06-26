import { StackCards } from "@/components/StackCards";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function StackCardsScreen() {
  const CardItem = ({ text }: { text: string }) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "#000" }}>Item {text}</Text>
      </View>
    );
  };

  const cards = [
    <CardItem key="1" text={"1"} />,
    <CardItem key="2" text={"2"} />,
    <CardItem key="3" text={"3"} />,
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#333", paddingTop: 100 }}>
        <StackCards
          cards={cards}
          onCardSwiped={(index, direction) => {
            console.log("Card swiped", index, direction);
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}
