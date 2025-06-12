import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface GroupButtonProps {
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
  /** Border color of the buttons container */
  buttonsContainerBorderColor?: string;
}

export const GroupButton: React.FC<GroupButtonProps> = ({
  labels,
  selectedIndex,
  onSelect,
  containerPadding = 3,
  borderRadius = 8,
  borderWidth = 1,
  buttonFontSize = 16,
  buttonsContainerHeight = 40,
  buttonsContainerWidth = 350,
  selectedButtonTextColor = "white",
  unselectedButtonTextColor = "black",
  selectedButtonBackgroundColor = "black",
  buttonsContainerBorderColor = "black",
}) => {
  const BUTTON_WIDTH = buttonsContainerWidth / labels.length;
  const BUTTON_HEIGHT = buttonsContainerHeight;

  const translateX = useSharedValue<number>(0);

  const handlePress = (index: number) => {
    translateX.value = withSpring(BUTTON_WIDTH * index, {
      damping: 20,
      stiffness: 150,
    });
    onSelect(index);
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: borderRadius,
    backgroundColor: selectedButtonBackgroundColor,
  }));

  return (
    <View
      style={{
        alignItems: "center",
        padding: containerPadding,
        borderWidth: borderWidth,
        borderColor: buttonsContainerBorderColor,
        borderRadius: borderRadius,
        overflow: "hidden",
      }}
    >
      <View
        style={[
          styles.container,
          {
            width: buttonsContainerWidth,
            height: buttonsContainerHeight,
          },
        ]}
      >
        <Animated.View style={[styles.slidingBackground, animatedStyles]} />
        {labels.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              {
                width: BUTTON_WIDTH,
                height: BUTTON_HEIGHT,
              },
            ]}
            onPress={() => handlePress(index)}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: buttonFontSize,
                  color:
                    index === selectedIndex
                      ? selectedButtonTextColor
                      : unselectedButtonTextColor,
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  button: {
    justifyContent: "center",
  },
  unselectedButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontWeight: "600",
    color: "black",
    textAlign: "center",
  },
  slidingBackground: {
    position: "absolute",
  },
});
