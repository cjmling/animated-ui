import { AutoCarousalWidget } from "@/components/AutoCarousalWidget";
import { Text, View } from "react-native";

export default function AutoCarousalScreen() {
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
    <View style={{ flex: 1, backgroundColor: "#333" }}>
      <AutoCarousalWidget
        items={[
          <CarousalItem key="1" />,
          <CarousalItem key="2" />,
          <CarousalItem key="3" />,
        ]}
      />
    </View>
  );
}
