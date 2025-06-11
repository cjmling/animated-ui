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
  const GAP = 2; // Gap between container and button
  const BUTTONS_CONTAINER_WIDTH = 350;
  const BACKGROUND_WIDTH = BUTTONS_CONTAINER_WIDTH / buttons.length - GAP * 2;
  const BUTTON_WIDTH = BUTTONS_CONTAINER_WIDTH / buttons.length;

  const translateX = useSharedValue<number>(0);

  const handlePress = (index: number) => {
    translateX.value = withSpring(BACKGROUND_WIDTH * index, {
      damping: 10,
      stiffness: 100,
    });

    console.log("translateX.value", translateX.value);
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: BUTTON_WIDTH,
  }));

  return (
    <View style={[styles.container, { width: BUTTONS_CONTAINER_WIDTH }]}>
      <Animated.View style={[styles.slidingBackground, animatedStyles]} />
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            {
              width: BUTTON_WIDTH,
            },
          ]}
          onPress={() => handlePress(index)}
        >
          <Text style={[styles.buttonText]}>{button.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  unselectedButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  slidingBackground: {
    height: 200,
    backgroundColor: "blue",
    position: "absolute",
  },
});
