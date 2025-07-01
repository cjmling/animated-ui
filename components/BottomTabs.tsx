import React from "react";
import { Dimensions, Pressable, View } from "react-native";
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

  buttonFontSize = 26,
  buttonsContainerWidth = Dimensions.get("window").width,
}) => {
  const BUTTON_WIDTH = buttonsContainerWidth / labels.length;
  const BUTTON_HEIGHT = BUTTON_WIDTH;
  const LABELS_BACKGROUND_COUNT = (labels.length - 1) * 2 + labels.length;
  const ACTIVE_CIRCLE_SIZE = BUTTON_HEIGHT / 1.2;

  const translateX = useSharedValue<number>(0);

  const handlePress = (index: number) => {
    const translateXValue =
      -(BUTTON_WIDTH * (labels.length - 1)) + index * BUTTON_WIDTH;
    translateX.value = withTiming(translateXValue, {
      duration: 500,
    });

    onSelect(index);
  };

  const movingBackgroundAniamtedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
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
      <Animated.View
        style={[
          {
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            overflow: "hidden",
          },
          movingBackgroundAniamtedStyles,
        ]}
      >
        {Array.from({ length: LABELS_BACKGROUND_COUNT }).map((_, index) => {
          const isSelected = index === labels.length - 1;
          const isAdjacentLeft = index === labels.length - 2;
          const isAdjacentRight = index === labels.length;

          return (
            <Pressable
              key={index}
              style={{
                width: BUTTON_WIDTH,
                height: BUTTON_HEIGHT,
                top: isSelected ? BUTTON_HEIGHT / 2 : 0,
                backgroundColor: "#FFF",
                justifyContent: "center",
                alignItems: "center",
                borderTopRightRadius: isAdjacentLeft ? 25 : 0,
                borderTopLeftRadius: isAdjacentRight ? 25 : 0,
              }}
            >
              {isSelected && (
                <View
                  style={{
                    width: BUTTON_WIDTH,
                    height: BUTTON_HEIGHT,
                    top: -(BUTTON_HEIGHT / 2) - 5,
                    backgroundColor: "#222",
                    borderRadius: BUTTON_WIDTH / 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: ACTIVE_CIRCLE_SIZE,
                      height: ACTIVE_CIRCLE_SIZE,
                      backgroundColor: "#FFF",
                      borderRadius: ACTIVE_CIRCLE_SIZE / 2,
                    }}
                  ></View>
                </View>
              )}
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
  );
};
