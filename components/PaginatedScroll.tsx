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

interface PaginatedScrollProps {
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
  /** Size of the pagination dots in pixels (defaults to 8) */
  paginationDotSize?: number;
  /** Gap between pagination dots in pixels (defaults to 8) */
  paginationDotGap?: number;
  /** Scale of the active pagination dot (defaults to 1.2) */
  paginationActiveDotScale?: number;
  /** Scale of the inactive pagination dots (defaults to 0.8) */
  paginationInactiveDotScale?: number;
  /** Opacity of the active pagination dot (defaults to 1) */
  paginationActiveDotOpacity?: number;
  /** Opacity of the inactive pagination dots (defaults to 0.3) */
  paginationInactiveDotOpacity?: number;
}

export const PaginatedScroll: React.FC<PaginatedScrollProps> = ({
  screens,
  initialIndex = 0,
  backgroundColor = "#000",
  paginationBottomPosition = 50,
  paginationDotColor = "#000",
  paginationDotSize = 8,
  paginationDotGap = 8,
  paginationActiveDotScale = 1.2,
  paginationInactiveDotScale = 0.8,
  paginationActiveDotOpacity = 1,
  paginationInactiveDotOpacity = 0.3,
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
        dotSize={paginationDotSize}
        dotGap={paginationDotGap}
        activeDotScale={paginationActiveDotScale}
        inactiveDotScale={paginationInactiveDotScale}
        activeDotOpacity={paginationActiveDotOpacity}
        inactiveDotOpacity={paginationInactiveDotOpacity}
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
  /** Size of the pagination dots in pixels */
  dotSize: number;
  /** Gap between pagination dots in pixels */
  dotGap: number;
  /** Scale of the active pagination dot */
  activeDotScale: number;
  /** Scale of the inactive pagination dots */
  inactiveDotScale: number;
  /** Opacity of the active pagination dot */
  activeDotOpacity: number;
  /** Opacity of the inactive pagination dots */
  inactiveDotOpacity: number;
}

const PaginationDot: React.FC<{
  index: number;
  currentIndex: SharedValue<number>;
  translateX: SharedValue<number>;
  dotColor: string;
  dotSize: number;
  activeDotScale: number;
  inactiveDotScale: number;
  activeDotOpacity: number;
  inactiveDotOpacity: number;
}> = ({
  index,
  currentIndex,
  translateX,
  dotColor,
  dotSize,
  activeDotScale,
  inactiveDotScale,
  activeDotOpacity,
  inactiveDotOpacity,
}) => {
  const dotStyle = useAnimatedStyle(() => {
    const progress = -translateX.value / SCREEN_WIDTH;
    const opacity = interpolate(
      progress,
      [index - 1, index, index + 1],
      [inactiveDotOpacity, activeDotOpacity, inactiveDotOpacity],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      progress,
      [index - 1, index, index + 1],
      [inactiveDotScale, activeDotScale, inactiveDotScale],
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
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
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
  dotSize,
  dotGap,
  activeDotScale,
  inactiveDotScale,
  activeDotOpacity,
  inactiveDotOpacity,
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
        gap: dotGap,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <PaginationDot
          key={index}
          index={index}
          currentIndex={currentIndex}
          translateX={translateX}
          dotColor={dotColor}
          dotSize={dotSize}
          activeDotScale={activeDotScale}
          inactiveDotScale={inactiveDotScale}
          activeDotOpacity={activeDotOpacity}
          inactiveDotOpacity={inactiveDotOpacity}
        />
      ))}
    </View>
  );
};
