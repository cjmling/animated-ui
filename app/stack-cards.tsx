import { StackCards } from "@/components/StackCards";
import { Text, View } from "react-native";

export default function StackCardsScreen() {
  const CardItem = ({ index }: { index: number }) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "#000" }}>Item {index}</Text>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#333", paddingTop: 100 }}>
      <StackCards
        cards={[
          <CardItem key="1" index={1} />,
          <CardItem key="2" index={2} />,
          <CardItem key="3" index={3} />,
        ]}
      />
    </View>
  );
}
