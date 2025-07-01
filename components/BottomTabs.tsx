import React, { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
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
    translateX.value = withTiming(BUTTON_WIDTH * index, {
      duration: 1000,
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

  const movingBackgroundAniamtedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: -10 }],
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,

    borderRadius: BORDER_RADIUS * 2,
  }));

  return (
    <View
      style={[
        {
          width: buttonsContainerWidth,
          flexDirection: "row",
        },
      ]}
    >
      {labels.map((label, index) => {
        // const isSelected = index === localSelectedIndex;
        const isAdjacentLeft = index === localSelectedIndex - 1;
        const isAdjacentRight = index === localSelectedIndex + 1;

        return (
          <Pressable
            key={index}
            style={[
              {
                width: BUTTON_WIDTH,
                height: BUTTON_HEIGHT,
                backgroundColor: "blue",
                justifyContent: "center",
                borderTopRightRadius: isAdjacentLeft ? 25 : 0,
                borderTopLeftRadius: isAdjacentRight ? 25 : 0,
              },
            ]}
            onPress={() => handlePress(index)}
          >
            <Animated.Text
              style={[
                {
                  fontSize: buttonFontSize,
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
        style={[
          {
            position: "absolute",
            zIndex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#222",
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
          },
          movingBackgroundAniamtedStyles,
        ]}
      >
        <View
          style={{
            width: BUTTON_WIDTH / 1.4,
            height: BUTTON_HEIGHT / 1.4,
            backgroundColor: "#FFF",
            borderRadius: BORDER_RADIUS * 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.Text>{labels[localSelectedIndex]}</Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
};
