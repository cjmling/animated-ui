import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
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
  buttonWidth = 90,
  buttonHeight = 44,
  selectedColor = "#2563eb",
  unselectedColor = "#111",
  selectedTextColor = "#fff",
  unselectedTextColor = "#fff",
  marginSize = 20,
  borderRadius = 20,
}) => {
  const [localSelectedIndex, setLocalSelectedIndex] = useState(selectedIndex);
  const MARGIN_DURATION = 500;
  const BORDER_RADIUS_DURATION = 200;

  const onLocalSelect = (index: number) => {
    setLocalSelectedIndex(index);
    onSelect(index);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {labels.map((label, idx) => {
        // Determine if this button is selected or adjacent
        const isSelected = idx === localSelectedIndex;
        const isAdjacentLeft = idx === localSelectedIndex - 1;
        const isAdjacentRight = idx === localSelectedIndex + 1;

        const animatedStyle = useAnimatedStyle(() => ({
          marginLeft: withTiming(idx === localSelectedIndex ? marginSize : 0, {
            duration: MARGIN_DURATION,
          }),
          marginRight: withTiming(idx === localSelectedIndex ? marginSize : 0, {
            duration: MARGIN_DURATION,
          }),
          borderTopLeftRadius: withTiming(
            isAdjacentRight || localSelectedIndex === idx || idx === 0
              ? borderRadius
              : 0,
            {
              duration: BORDER_RADIUS_DURATION,
            }
          ),
          borderTopRightRadius: withTiming(
            isAdjacentLeft ||
              localSelectedIndex === idx ||
              idx === labels.length - 1
              ? borderRadius
              : 0,
            {
              duration: BORDER_RADIUS_DURATION,
            }
          ),
          borderBottomLeftRadius: withTiming(
            isAdjacentRight || localSelectedIndex === idx || idx === 0
              ? borderRadius
              : 0,
            {
              duration: BORDER_RADIUS_DURATION,
            }
          ),
          borderBottomRightRadius: withTiming(
            isAdjacentLeft ||
              localSelectedIndex === idx ||
              idx === labels.length - 1
              ? borderRadius
              : 0,
            {
              duration: BORDER_RADIUS_DURATION,
            }
          ),
          backgroundColor: isSelected ? selectedColor : unselectedColor,
        }));

        return (
          <TouchableOpacity
            key={label}
            activeOpacity={0.8}
            onPress={() => onLocalSelect(idx)}
            style={{ overflow: "hidden" }}
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
                {label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
