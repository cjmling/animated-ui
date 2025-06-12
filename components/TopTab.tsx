import React, { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface TopTabProps {
  screens: React.ReactNode[];
  initialIndex?: number;
}

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

  const renderScreens = useCallback(() => {
    return screens.map((screen, index) => (
      <View key={index} style={styles.screen}>
        {screen}
      </View>
    ));
  }, [screens]);

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.container, animatedStyle]}>
          {renderScreens()}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
