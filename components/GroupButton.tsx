import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface GroupButtonProps {
  buttons: {
    label: string;
    onPress: () => void;
  }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const GroupButton: React.FC<GroupButtonProps> = ({
  buttons,
  selectedIndex,
  onSelect,
}) => {
  const CONTAINER_PADDING = 3; // Gap between container and button
  const BORDER_RADIUS = 8;
  const BORDER_WIDTH = 1;
  const BUTTONS_CONTAINER_HEIGHT = 40;
  const BUTTONS_CONTAINER_WIDTH = 350;
  const BUTTON_WIDTH = BUTTONS_CONTAINER_WIDTH / buttons.length;
  const BUTTON_HEIGHT = BUTTONS_CONTAINER_HEIGHT;
  const SELECTED_BUTTON_TEXT_COLOR = "white";
  const UNSELECTED_BUTTON_TEXT_COLOR = "black";
  const SELECTED_BUTTON_BACKGROUND_COLOR = "black";
  const BUTTONS_CONTAINER_BORDER_COLOR = "black";

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
    borderRadius: BORDER_RADIUS,
    backgroundColor: SELECTED_BUTTON_BACKGROUND_COLOR,
  }));

  return (
    <View
      style={{
        alignItems: "center",
        padding: CONTAINER_PADDING,
        borderWidth: BORDER_WIDTH,
        borderColor: BUTTONS_CONTAINER_BORDER_COLOR,
        borderRadius: BORDER_RADIUS,
        overflow: "hidden",
      }}
    >
      <View
        style={[
          styles.container,
          {
            width: BUTTONS_CONTAINER_WIDTH,
            height: BUTTONS_CONTAINER_HEIGHT,
          },
        ]}
      >
        <Animated.View style={[styles.slidingBackground, animatedStyles]} />
        {buttons.map((button, index) => (
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
                  color:
                    index === selectedIndex
                      ? SELECTED_BUTTON_TEXT_COLOR
                      : UNSELECTED_BUTTON_TEXT_COLOR,
                },
              ]}
            >
              {button.label}
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  unselectedButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
  },
  slidingBackground: {
    position: "absolute",
  },
});
