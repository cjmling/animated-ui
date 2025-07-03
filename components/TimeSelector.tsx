import { View } from "react-native";
import { CircularClock } from "./CircularClock";
import { VerticalScrollSelect } from "./VerticalScrollSelect";

export const TimeSelector = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#181C27",
        flexDirection: "row",
        borderRadius: 30,
        padding: 35,
      }}
    >
      <CircularClock
        hour={2}
        minute={30}
        backgroundColor="#181C27"
        lineColor="#555"
        size={150}
      />
      <VerticalScrollSelect
        selected={0}
        setSelected={() => {}}
        labels={["12:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00"]}
      />
    </View>
  );
};
