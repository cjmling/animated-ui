import { View } from "react-native";
import { CircularClock } from "./CircularClock";
import { VerticalScrollSelect } from "./VerticalScrollSelect";

export const TimeSelector = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1A1A1A",
        flexDirection: "row",
        borderRadius: 30,
        padding: 35,
      }}
    >
      <CircularClock
        hour={2}
        minute={30}
        backgroundColor="#212121"
        lineColor="#555"
        armColor="#fff"
        size={150}
        hideCircleBorder={true}
        hideMinuteDashes={true}
        dashSpacingFromBorder={10}
      />
      <VerticalScrollSelect
        selected={0}
        setSelected={() => {}}
        labels={["12:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00"]}
      />
    </View>
  );
};
