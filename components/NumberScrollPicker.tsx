import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const ITEM_WIDTH = 60;
const ITEM_HEIGHT = 60;
const NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);

interface NumberScrollPickerProps {
  /** Initial selected number (defaults to 1) */
  initialNumber?: number;
  /** Callback when a number is selected */
  onNumberSelect?: (number: number) => void;
  /** Color of the selected number */
  selectedNumberColor?: string;
  /** Color of unselected numbers */
  unselectedNumberColor?: string;
  /** Font size of the numbers */
  numberFontSize?: number;
  /** Background color of the container */
  backgroundColor?: string;
}

export const NumberScrollPicker: React.FC<NumberScrollPickerProps> = ({
  initialNumber = 1,
  onNumberSelect,
  numberFontSize = 24,
  backgroundColor = "#fff",
}) => {
  const translateX = useSharedValue((initialNumber - 1) * -ITEM_WIDTH);
  const currentIndex = useSharedValue(initialNumber - 1);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX + currentIndex.value * -ITEM_WIDTH;
    })
    .onEnd((event) => {
      const shouldSwipe = Math.abs(event.velocityX) > 500;
      const shouldSnap = Math.abs(event.translationX) > ITEM_WIDTH * 0.3;

      if (shouldSwipe || shouldSnap) {
        const direction = event.translationX > 0 ? -1 : 1;
        const newIndex = Math.max(
          0,
          Math.min(NUMBERS.length - 1, currentIndex.value + direction)
        );
        currentIndex.value = newIndex;
        translateX.value = withSpring(newIndex * -ITEM_WIDTH, {
          damping: 20,
          stiffness: 150,
        });
        onNumberSelect?.(NUMBERS[newIndex]);
      } else {
        translateX.value = withSpring(currentIndex.value * -ITEM_WIDTH, {
          damping: 20,
          stiffness: 150,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const NumberItem = ({ number, index }: { number: number; index: number }) => {
    return (
      <Animated.Text style={[styles.numberText, { fontSize: numberFontSize }]}>
        {number}
      </Animated.Text>
    );
  };

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor }]}>
      <View style={styles.pickerContainer}>
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.numbersContainer,
              {
                width: ITEM_WIDTH * NUMBERS.length,
              },
              animatedStyle,
            ]}
          >
            {NUMBERS.map((number, index) => (
              <View
                key={index}
                style={[
                  styles.numberItem,
                  {
                    width: ITEM_WIDTH,
                    height: ITEM_HEIGHT,
                  },
                ]}
              >
                <NumberItem number={number} index={index} />
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    height: ITEM_HEIGHT,
    width: 300,
    backgroundColor: "red",
  },
  numbersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  numberItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontWeight: "bold",
  },
});
