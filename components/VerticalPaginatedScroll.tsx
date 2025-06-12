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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface VerticalPaginatedScrollProps {
  /** Array of screen components to be displayed in the tab */
  screens: React.ReactNode[];
  /** Initial index of the screen to show (defaults to 0) */
  initialIndex?: number;
  /** Background color of the tab container (defaults to "#000") */
  backgroundColor?: string;
  /** Right position of the pagination dots in pixels (defaults to 20) */
  paginationRightPosition?: number;
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

export default function VerticalPaginatedScroll({
  screens,
  initialIndex = 0,
  backgroundColor = "#000",
  paginationRightPosition = 20,
  paginationDotColor = "#000",
  paginationDotSize = 8,
  paginationDotGap = 8,
  paginationActiveDotScale = 1.2,
  paginationInactiveDotScale = 0.8,
  paginationActiveDotOpacity = 1,
  paginationInactiveDotOpacity = 0.3,
}: VerticalPaginatedScrollProps) {
  const translateY = useSharedValue(initialIndex * -SCREEN_HEIGHT);
  const currentIndex = useSharedValue(initialIndex);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value =
        event.translationY + currentIndex.value * -SCREEN_HEIGHT;
    })
    .onEnd((event) => {
      const shouldSwipe = Math.abs(event.velocityY) > 500;
      const shouldSnap = Math.abs(event.translationY) > SCREEN_HEIGHT * 0.3;

      if (shouldSwipe || shouldSnap) {
        const direction = event.translationY > 0 ? -1 : 1;
        const newIndex = Math.max(
          0,
          Math.min(screens.length - 1, currentIndex.value + direction)
        );
        currentIndex.value = newIndex;
        translateY.value = withSpring(newIndex * -SCREEN_HEIGHT, {
          damping: 20,
          stiffness: 150,
        });
      } else {
        translateY.value = withSpring(currentIndex.value * -SCREEN_HEIGHT, {
          damping: 20,
          stiffness: 150,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              flex: 1,
              height: SCREEN_HEIGHT * screens.length,
            },
            animatedStyle,
          ]}
        >
          {screens.map((screen, index) => (
            <View
              key={index}
              style={{
                width: "100%",
                height: SCREEN_HEIGHT,
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
        translateY={translateY}
        rightPosition={paginationRightPosition}
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
}

interface PaginationDotsProps {
  count: number;
  currentIndex: SharedValue<number>;
  translateY: SharedValue<number>;
  /** Right position of the pagination dots in pixels */
  rightPosition: number;
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
  translateY: SharedValue<number>;
  dotColor: string;
  dotSize: number;
  activeDotScale: number;
  inactiveDotScale: number;
  activeDotOpacity: number;
  inactiveDotOpacity: number;
}> = ({
  index,
  currentIndex,
  translateY,
  dotColor,
  dotSize,
  activeDotScale,
  inactiveDotScale,
  activeDotOpacity,
  inactiveDotOpacity,
}) => {
  const dotStyle = useAnimatedStyle(() => {
    const progress = -translateY.value / SCREEN_HEIGHT;
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
  translateY,
  rightPosition,
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
        right: rightPosition,
        top: 0,
        bottom: 0,
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
          translateY={translateY}
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
