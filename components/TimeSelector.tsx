import { useState } from "react";
import { View } from "react-native";
import { CircularClock } from "./CircularClock";
import { VerticalScrollSelect } from "./VerticalScrollSelect";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const TimeSelector = () => {
  const [selectedTime, setSelectedTime] = useState<{
    hour: number;
    minute: number;
  }>({ hour: 12, minute: 0 });
  const SELECT_LABELS = [
    { label: "12:00", value: { hour: 12, minute: 0 } },
    { label: "12:30", value: { hour: 12, minute: 30 } },
    { label: "1:00", value: { hour: 1, minute: 0 } },
    { label: "1:30", value: { hour: 1, minute: 30 } },
    { label: "2:00", value: { hour: 2, minute: 0 } },
    { label: "2:30", value: { hour: 2, minute: 30 } },
    { label: "3:00", value: { hour: 3, minute: 0 } },
    { label: "3:30", value: { hour: 3, minute: 30 } },
    { label: "4:00", value: { hour: 4, minute: 0 } },
    { label: "4:30", value: { hour: 4, minute: 30 } },
    { label: "5:00", value: { hour: 5, minute: 0 } },
    { label: "5:30", value: { hour: 5, minute: 30 } },
    { label: "6:00", value: { hour: 6, minute: 0 } },
    { label: "6:30", value: { hour: 6, minute: 30 } },
    { label: "7:00", value: { hour: 7, minute: 0 } },
    { label: "7:30", value: { hour: 7, minute: 30 } },
    { label: "8:00", value: { hour: 8, minute: 0 } },
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
        hour={selectedTime.hour}
        minute={selectedTime.minute}
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
        setSelected={debounce((index: number) => {
          setSelectedTime(SELECT_LABELS[index].value);
        }, 100)}
        labels={SELECT_LABELS}
        backgroundColor="#1A1A1A"
      />
    </View>
  );
};
