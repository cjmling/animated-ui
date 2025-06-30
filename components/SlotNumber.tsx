import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const DIGIT_HEIGHT = 100;
const DIGITS = Array.from({ length: 10 }, (_, i) => i);

const SlotDigit = ({ digit }: { digit: number }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(-digit * DIGIT_HEIGHT, { duration: 500 });
  }, [digit]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.digitWrapper}>
      <Animated.View style={[animatedStyle]}>
        {DIGITS.map((d) => (
          <Text key={d} style={styles.digit}>
            {d}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
};

export const SlotNumber = ({ number }: { number: number }) => {
  const digits = number.toString().padStart(3, "0").split("").map(Number); // e.g., 007

  return (
    <View style={styles.container}>
      {digits.map((digit, index) => (
        <SlotDigit key={index} digit={digit} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
  },
  digitWrapper: {
    height: DIGIT_HEIGHT,
    overflow: "hidden",
  },
  digit: {
    height: DIGIT_HEIGHT,
    fontSize: DIGIT_HEIGHT * 0.6,
    textAlign: "center",
  },
});
