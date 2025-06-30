import { SlotNumber } from "@/components/SlotNumber";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function SlotNumberScreen() {
  const [number, setNumber] = useState(123);

  useEffect(() => {
    const interval = setInterval(() => {
      setNumber(Math.floor(Math.random() * 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SlotNumber number={number} />
    </View>
  );
}
