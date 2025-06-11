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
}

export const GroupButton: React.FC<GroupButtonProps> = ({
  buttons,
  selectedIndex,
}) => {
  const GAP = 10; // Gap between container and button
  const BORDER_RADIUS = 8;
  const BORDER_WIDTH = 1;
  const BUTTONS_CONTAINER_HEIGHT = 50;
  const BUTTONS_CONTAINER_WIDTH = 350;
  const BUTTON_WIDTH = BUTTONS_CONTAINER_WIDTH / buttons.length;
  const BUTTON_HEIGHT = BUTTONS_CONTAINER_HEIGHT;

  const translateX = useSharedValue<number>(0);

  const handlePress = (index: number) => {
    translateX.value = withSpring(BUTTON_WIDTH * index, {
      damping: 10,
      stiffness: 100,
    });
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BORDER_RADIUS,
  }));

  return (
    <View
      style={{
        alignItems: "center",
        padding: GAP,
        borderWidth: BORDER_WIDTH,
        borderColor: "red",
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
            <Text style={[styles.buttonText]}>{button.label}</Text>
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
    backgroundColor: "blue",
    position: "absolute",
  },
});
