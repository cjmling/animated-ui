import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
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

  buttonFontSize = 16,
  buttonsContainerWidth = 400,
}) => {
  const [localSelectedIndex, setLocalSelectedIndex] = useState(selectedIndex);
  const BUTTON_WIDTH = buttonsContainerWidth / labels.length;
  const BUTTON_HEIGHT = BUTTON_WIDTH;
  const LABELS_BACKGROUND_COUNT = (labels.length - 1) * 2 + labels.length;
  console.log(LABELS_BACKGROUND_COUNT);

  const translateX = useSharedValue<number>(0);

  const handlePress = (index: number) => {
    const translateXValue =
      -(BUTTON_WIDTH * (labels.length - 1)) + index * BUTTON_WIDTH;
    translateX.value = withTiming(translateXValue, {
      duration: 200,
    });
    console.log(BUTTON_WIDTH, index, translateXValue);

    setLocalSelectedIndex(index);
    onSelect(index);
    console.log(index);
  };

  //   useEffect(() => {
  //     const translateXValue =
  //       -(BUTTON_WIDTH * (labels.length - 1)) + selectedIndex * BUTTON_WIDTH;
  //     translateX.value = withTiming(translateXValue, {
  //       duration: 200,
  //     });
  //   }, [selectedIndex]);

  const movingBackgroundAniamtedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View>
      <Text>{localSelectedIndex}</Text>
      <View
        style={[
          {
            width: buttonsContainerWidth,
            flexDirection: "row",
            backgroundColor: "red",
          },
        ]}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              zIndex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            },
            movingBackgroundAniamtedStyles,
          ]}
        >
          {Array.from({ length: LABELS_BACKGROUND_COUNT }).map((_, index) => {
            const isSelected = index === localSelectedIndex;
            const isAdjacentLeft = index === localSelectedIndex - 1;
            const isAdjacentRight = index === localSelectedIndex + 1;

            return (
              <Pressable
                key={index}
                style={{
                  width: BUTTON_WIDTH,
                  height: BUTTON_HEIGHT,
                  backgroundColor: "red",
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopRightRadius: isAdjacentLeft ? 25 : 0,
                  borderTopLeftRadius: isAdjacentRight ? 25 : 0,
                }}
                // onPress={() => handlePress(index)}
              >
                <View
                  style={{
                    width: BUTTON_WIDTH / 1.2,
                    height: BUTTON_HEIGHT / 1.2,
                    backgroundColor: "white",
                    borderRadius: BUTTON_WIDTH / 2,
                  }}
                />
              </Pressable>
            );
          })}
        </Animated.View>
        <View
          style={[
            {
              position: "absolute",
              zIndex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            },
          ]}
        >
          {labels.map((label, index) => {
            return (
              <Pressable key={index} onPress={() => handlePress(index)}>
                <Animated.View
                  style={[
                    {
                      width: BUTTON_WIDTH,
                      height: BUTTON_HEIGHT,
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Animated.Text
                    style={[
                      {
                        fontSize: buttonFontSize,
                        fontWeight: "600",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {label}
                  </Animated.Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};
