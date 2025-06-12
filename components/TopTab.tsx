import React from "react";
import { Dimensions, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface TopTabProps {
  /** Array of screen components to be displayed in the tab */
  screens: React.ReactNode[];
  /** Initial index of the screen to show (defaults to 0) */
  initialIndex?: number;
  /** Background color of the tab container (defaults to "#000") */
  backgroundColor?: string;
  /** Bottom position of the pagination dots in pixels (defaults to 50) */
  paginationBottomPosition?: number;
  /** Color of the pagination dots (defaults to "#000") */
  paginationDotColor?: string;
}

export const TopTab: React.FC<TopTabProps> = ({
  screens,
  initialIndex = 0,
  backgroundColor = "#000",
  paginationBottomPosition = 50,
  paginationDotColor = "#000",
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

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              flex: 1,
              flexDirection: "row",
              width: SCREEN_WIDTH * screens.length,
            },
            animatedStyle,
          ]}
        >
          {screens.map((screen, index) => (
            <View
              key={index}
              style={{
                width: SCREEN_WIDTH,
                height: "100%",
              }}
            >
              {screen}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
      <PaginationDots
        count={screens.length}
        currentIndex={currentIndex}
        translateX={translateX}
        bottomPosition={paginationBottomPosition}
        dotColor={paginationDotColor}
      />
    </GestureHandlerRootView>
  );
};

interface PaginationDotsProps {
  count: number;
  currentIndex: SharedValue<number>;
  translateX: SharedValue<number>;
  /** Bottom position of the pagination dots in pixels */
  bottomPosition: number;
  /** Color of the pagination dots */
  dotColor: string;
}

const PaginationDot: React.FC<{
  index: number;
  currentIndex: SharedValue<number>;
  translateX: SharedValue<number>;
  dotColor: string;
}> = ({ index, currentIndex, translateX, dotColor }) => {
  const dotStyle = useAnimatedStyle(() => {
    const progress = -translateX.value / SCREEN_WIDTH;
    const opacity = interpolate(
      progress,
      [index - 1, index, index + 1],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      progress,
      [index - 1, index, index + 1],
      [0.8, 1.2, 0.8],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: dotColor,
        },
        dotStyle,
      ]}
    />
  );
};

const PaginationDots: React.FC<PaginationDotsProps> = ({
  count,
  currentIndex,
  translateX,
  bottomPosition,
  dotColor,
}) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: bottomPosition,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <PaginationDot
          key={index}
          index={index}
          currentIndex={currentIndex}
          translateX={translateX}
          dotColor={dotColor}
        />
      ))}
    </View>
  );
};
