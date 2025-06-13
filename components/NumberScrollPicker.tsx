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
  // Shared values for tracking the scroll position
  // offset: current position of the number picker
  // accumulatedOffset: stores the position when a new gesture begins
  const offset = useSharedValue(0);
  const accumulatedOffset = useSharedValue(0);

  // Pan gesture handler for horizontal scrolling
  const gesture = Gesture.Pan()
    .onBegin(() => {
      // Store the current position when gesture starts
      accumulatedOffset.value = offset.value;
    })
    .onUpdate((event) => {
      // Update position based on gesture movement
      // translationX represents the horizontal movement from gesture start
      offset.value = accumulatedOffset.value + event.translationX;
    })
    .onEnd((event) => {
      // Save the final position when gesture ends
      accumulatedOffset.value = offset.value;
    });

  // Animated style that applies the horizontal translation
  // This moves the number container based on the offset value
  const numberContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
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
              numberContainerAnimatedStyle,
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
