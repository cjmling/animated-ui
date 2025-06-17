import { CarousalWidget } from "@/components/CarousalWidget";
import { Text, View } from "react-native";

export default function CarousalWidgetScreen() {
  const CarousalItem = () => {
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
    <View style={{ padding: 20 }}>
      <View style={{ backgroundColor: "red" }}>
        <CarousalWidget
          items={[
            <CarousalItem key="1" />,
            <CarousalItem key="2" />,
            <CarousalItem key="3" />,
          ]}
        />
      </View>
    </View>
  );
}
