import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface MergingButtonsProps {
  labels: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  buttonWidth?: number;
  buttonHeight?: number;
  selectedColor?: string;
  unselectedColor?: string;
  selectedTextColor?: string;
  unselectedTextColor?: string;
  marginSize?: number;
  borderRadius?: number;
}

export const MergingButtons: React.FC<MergingButtonsProps> = ({
  labels,
  selectedIndex,
  onSelect,
  buttonWidth = 80,
  buttonHeight = 44,
  selectedColor = "#2563eb",
  unselectedColor = "#111",
  selectedTextColor = "#fff",
  unselectedTextColor = "#fff",
  marginSize = 8,
  borderRadius = 10,
}) => {
  const [localSelectedIndex, setLocalSelectedIndex] = useState(selectedIndex);

  const onLocalSelect = (index: number) => {
    setLocalSelectedIndex(index);
    onSelect(index);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {labels.map((label, idx) => {
        // Determine if this button is selected or adjacent
        const isSelected = idx === localSelectedIndex;
        const isAdjacent =
          idx === localSelectedIndex - 1 || idx === localSelectedIndex + 1;
        const isAdjacentLeft = idx === localSelectedIndex - 1;
        const isAdjacentRight = idx === selectedIndex + 1;

        // Shared values for margin and border radius
        // const margin = useSharedValue(
        //   isSelected || isAdjacent ? marginSize : 0
        // );

        const margin = useSharedValue(0);

        const radius = useSharedValue(
          isSelected || isAdjacent ? borderRadius : 0
        );

        React.useEffect(() => {
          margin.value = withSpring(isSelected || isAdjacent ? marginSize : 0, {
            damping: 18,
            stiffness: 180,
          });
          radius.value = withSpring(
            isSelected || isAdjacent ? borderRadius : 0,
            {
              damping: 18,
              stiffness: 180,
            }
          );
        }, [localSelectedIndex]);

        const animatedStyle = useAnimatedStyle(() => ({
          marginLeft: idx === localSelectedIndex ? 10 : 0,
          marginRight: idx === localSelectedIndex ? 10 : 0,
          borderRadius: radius.value,
          backgroundColor: isSelected ? selectedColor : unselectedColor,
        }));

        return (
          <TouchableOpacity
            key={label}
            activeOpacity={0.8}
            onPress={() => onLocalSelect(idx)}
            style={{ borderRadius, overflow: "hidden" }}
          >
            <Animated.View
              style={[
                animatedStyle,
                {
                  width: buttonWidth,
                  height: buttonHeight,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={{
                  color: isSelected ? selectedTextColor : unselectedTextColor,
                  fontWeight: "500",
                  fontSize: 16,
                }}
              >
                {label} : {localSelectedIndex}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
