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
  const BUTTONS_CONTAINER_WIDTH = 350;
  const BUTTON_WIDTH = BUTTONS_CONTAINER_WIDTH / buttons.length;

  const translateX = useSharedValue<number>(0);

  const handlePress = (index: number) => {
    translateX.value = withSpring(BUTTON_WIDTH * index);
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
          style={[styles.button]}
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
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 10,
    overflow: "hidden",
    padding: 20,
    // backgroundColor: "red",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  firstButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  lastButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  selectedButton: {
    // backgroundColor: "#007AFF",
  },
  unselectedButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  selectedText: {
    color: "white",
  },
  unselectedText: {
    color: "#007AFF",
  },
  slidingBackground: {
    // width: 100,
    height: 200,
    backgroundColor: "blue",
    position: "absolute",
    // left: 200,
    // backgroundColor: "#007AFF",
    // borderRadius: 8,
    // top: 2,
    // bottom: 2,
    // left: 2,
    // right: 2,
  },
});
