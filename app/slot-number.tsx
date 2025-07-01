import { SlotNumber } from "@/components/SlotNumber";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function SlotNumberScreen() {
  const [number, setNumber] = useState(123);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setNumber(Math.floor(Math.random() * 1000));
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SlotNumber number={number} />
      <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
        <Pressable
          style={{
            borderColor: "#CCC",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setNumber(number + 1)}
        >
          <Text>+</Text>
        </Pressable>
        <Pressable
          style={{
            borderColor: "#CCC",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setNumber(number * 2)}
        >
          <Text>x 2</Text>
        </Pressable>
      </View>
    </View>
  );
}
