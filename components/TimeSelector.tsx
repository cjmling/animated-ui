import { View } from "react-native";
import { CircularClock } from "./CircularClock";
import { VerticalScrollSelect } from "./VerticalScrollSelect";

export const TimeSelector = () => {
  const SELECT_LABELS = [
    { label: "12:00", value: 0 },
    { label: "1:00", value: 1 },
    { label: "2:00", value: 2 },
    { label: "3:00", value: 3 },
    { label: "4:00", value: 4 },
  ];
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1A1A1A",
        flexDirection: "row",
        borderRadius: 30,
        padding: 10,
        width: "90%",
      }}
    >
      <CircularClock
        hour={2}
        minute={30}
        backgroundColor="#212121"
        lineColor="#555"
        armColor="#fff"
        size={200}
        hideCircleBorder={true}
        hideMinuteDashes={true}
        dashSpacingFromBorder={10}
      />
      <VerticalScrollSelect
        selected={0}
        setSelected={() => {}}
        labels={SELECT_LABELS}
      />
    </View>
  );
};
