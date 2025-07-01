import React, { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface BottomTabsProps {
  /** Array of labels to display in the button group */
  labels: string[];
  /** Index of the currently selected button */
  selectedIndex: number;
  /** Callback function when a button is selected */
  onSelect: (index: number) => void;
  /** Gap between container and button */
  containerPadding?: number;
  /** Border radius of the container and buttons */
  borderRadius?: number;
  /** Width of the container border */
  borderWidth?: number;
  /** Font size of the button text */
  buttonFontSize?: number;
  /** Height of the buttons container */
  buttonsContainerHeight?: number;
  /** Width of the buttons container */
  buttonsContainerWidth?: number;
  /** Text color for the selected button */
  selectedButtonTextColor?: string;
  /** Text color for unselected buttons */
  unselectedButtonTextColor?: string;
  /** Background color for the selected button */
  selectedButtonBackgroundColor?: string;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  labels,
  selectedIndex,
  onSelect,
  containerPadding = 3,

  buttonFontSize = 16,
  buttonsContainerHeight = 60,
  buttonsContainerWidth = 400,
  selectedButtonTextColor = "#000",
  unselectedButtonTextColor = "#fff",
  selectedButtonBackgroundColor = "#FFF",
}) => {
  const [localSelectedIndex, setLocalSelectedIndex] = useState(selectedIndex);
  const BUTTON_WIDTH = buttonsContainerWidth / labels.length;
  const BUTTON_HEIGHT = BUTTON_WIDTH;
  const BORDER_RADIUS = buttonsContainerHeight / 2;

  const translateX = useSharedValue<number>(0);

  // Create animated values for each button's text position
  const textPositions = labels.map(() => useSharedValue(0));

  const handlePress = (index: number) => {
    translateX.value = withSpring(BUTTON_WIDTH * index, {
      damping: 20,
      stiffness: 150,
    });

    // Animate all text positions
    textPositions.forEach((textPos, i) => {
      textPos.value = withTiming(i === index ? -10 : 0, {
        duration: 200,
      });
    });

    setLocalSelectedIndex(index);
    onSelect(index);
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: -10 }],
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: selectedButtonBackgroundColor,
    borderRadius: BORDER_RADIUS * 2,
  }));

  return (
    <View
      style={[
        {
          width: buttonsContainerWidth,
          backgroundColor: "red",
          flexDirection: "row",
        },
      ]}
    >
      {labels.map((label, index) => {
        const textAnimatedStyle = useAnimatedStyle(() => ({
          transform: [{ translateY: textPositions[index].value }],
        }));

        return (
          <Pressable
            key={index}
            style={[
              {
                width: BUTTON_WIDTH,
                height: BUTTON_HEIGHT,
                zIndex: 100,
                backgroundColor: "blue",
                justifyContent: "center",
              },
            ]}
            onPress={() => handlePress(index)}
          >
            <Animated.Text
              style={[
                textAnimatedStyle,
                {
                  fontSize: buttonFontSize,
                  zIndex: 100,
                  fontWeight: "600",
                  textAlign: "center",
                  color:
                    index === localSelectedIndex
                      ? selectedButtonTextColor
                      : unselectedButtonTextColor,
                },
              ]}
            >
              {label}
            </Animated.Text>
          </Pressable>
        );
      })}
      <Animated.View
        style={[{ position: "absolute", zIndex: 1 }, animatedStyles]}
      />
    </View>
  );
};
