import { StackCards } from "@/components/StackCards";
import { Text, View } from "react-native";

export default function StackCardsScreen() {
  const CardItem = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#222",
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "#fff" }}>Item 1</Text>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#333", paddingTop: 100 }}>
      <StackCards
        cards={[
          <CardItem key="1" />,
          <CardItem key="2" />,
          <CardItem key="3" />,
        ]}
      />
    </View>
  );
}
