import React, { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface TopTabProps {
  screens: React.ReactNode[];
  initialIndex?: number;
}

interface PaginationDotsProps {
  count: number;
  currentIndex: Animated.SharedValue<number>;
}

const styles = StyleSheet.create({
  paginationContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
  },
});

const PaginationDot: React.FC<{
  index: number;
  currentIndex: Animated.SharedValue<number>;
}> = ({ index, currentIndex }) => {
  const dotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      currentIndex.value,
      [index - 1, index, index + 1],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      currentIndex.value,
      [index - 1, index, index + 1],
      [0.8, 1.2, 0.8],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return <Animated.View style={[styles.dot, dotStyle]} />;
};

const PaginationDots: React.FC<PaginationDotsProps> = ({
  count,
  currentIndex,
}) => {
  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <PaginationDot key={index} index={index} currentIndex={currentIndex} />
      ))}
    </View>
  );
};

export const TopTab: React.FC<TopTabProps> = ({
  screens,
  initialIndex = 0,
}) => {
  const translateX = useSharedValue(initialIndex * -SCREEN_WIDTH);
  const currentIndex = useSharedValue(initialIndex);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value =
        event.translationX + currentIndex.value * -SCREEN_WIDTH;
    })
    .onEnd((event) => {
      const shouldSwipe = Math.abs(event.velocityX) > 500;
      const shouldSnap = Math.abs(event.translationX) > SCREEN_WIDTH * 0.3;

      if (shouldSwipe || shouldSnap) {
        const direction = event.translationX > 0 ? -1 : 1;
        const newIndex = Math.max(
          0,
          Math.min(screens.length - 1, currentIndex.value + direction)
        );
        currentIndex.value = newIndex;
        translateX.value = withSpring(newIndex * -SCREEN_WIDTH, {
          damping: 20,
          stiffness: 150,
        });
      } else {
        translateX.value = withSpring(currentIndex.value * -SCREEN_WIDTH, {
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      width: SCREEN_WIDTH * screens.length,
    },
    screen: {
      width: SCREEN_WIDTH,
      height: "100%",
    },
  });

  const renderScreens = useCallback(() => {
    return screens.map((screen, index) => (
      <View key={index} style={styles.screen}>
        {screen}
      </View>
    ));
  }, [screens, styles.screen]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.container, animatedStyle]}>
          {renderScreens()}
        </Animated.View>
      </GestureDetector>
      <PaginationDots count={screens.length} currentIndex={currentIndex} />
    </GestureHandlerRootView>
  );
};
