import { CircularClock } from "@/components/CircularClock";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function CircularClockScreen() {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setHour(hour + 1);
      setMinute(minute + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [hour, minute]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularClock hour={hour} minute={minute} />
    </View>
  );
}
