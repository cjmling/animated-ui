import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from "react-native-reanimated";

const ITEM_WIDTH = 50;
const ITEM_HEIGHT = 50;
const NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);
const CONTAINER_WIDTH = 300;

// Calculate center offsets for first and last numbers
const FIRST_NUMBER_CENTER_OFFSET = CONTAINER_WIDTH / 2 - ITEM_WIDTH / 2;
const LAST_NUMBER_CENTER_OFFSET =
  CONTAINER_WIDTH / 2 - ((NUMBERS.length - 1) * ITEM_WIDTH + ITEM_WIDTH / 2);

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
  /** Number to center initially in the UI */
  centerNumber?: number;
}

export const NumberScrollPicker: React.FC<NumberScrollPickerProps> = ({
  initialNumber = 1,
  onNumberSelect,
  numberFontSize = 24,
  backgroundColor = "#fff",
  centerNumber,
}) => {
  // Shared values for tracking the scroll position
  const offset = useSharedValue(0);
  const accumulatedOffset = useSharedValue(0);

  // Calculate initial offset to center the specified number
  useEffect(() => {
    if (centerNumber !== undefined) {
      const centerIndex = NUMBERS.indexOf(centerNumber);
      if (centerIndex !== -1) {
        const centerOffset =
          CONTAINER_WIDTH / 2 - (centerIndex * ITEM_WIDTH + ITEM_WIDTH / 2);
        offset.value = centerOffset;
        accumulatedOffset.value = centerOffset;
      }
    }
  }, [centerNumber]);

  // Pan gesture handler for horizontal scrolling
  const gesture = Gesture.Pan()
    .onBegin(() => {
      accumulatedOffset.value = offset.value;
    })
    .onUpdate((event) => {
      // Allow scrolling past boundaries during the gesture
      offset.value = accumulatedOffset.value + event.translationX;
    })
    .onEnd((event) => {
      // Apply momentum scrolling based on velocity
      const finalOffset = withDecay({
        velocity: event.velocityX,
        deceleration: 0.98,
        clamp: [LAST_NUMBER_CENTER_OFFSET, FIRST_NUMBER_CENTER_OFFSET],
      });

      // Update the offset with the decayed value
      offset.value = finalOffset;
      accumulatedOffset.value = offset.value;
    })
    .minDistance(0) // Start tracking immediately
    .activeOffsetX([-1, 1]); // Start tracking with minimal horizontal movement

  // Animated style that applies the horizontal translation with spring animation
  const numberContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(offset.value, {
            damping: 10,
            stiffness: 100, // Increased stiffness for faster response
            mass: 0.1, // Reduced mass for quicker movement
            velocity: 0, // Start from rest
            restDisplacementThreshold: 0.01, // Smaller threshold for more precise settling
            restSpeedThreshold: 0.01, // Smaller threshold for more precise settling
          }),
        },
      ],
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
      <View style={[styles.pickerContainer, { width: CONTAINER_WIDTH }]}>
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
