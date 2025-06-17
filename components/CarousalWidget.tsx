import React from "react";
import { Dimensions, FlatList, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface CarousalWidgetProps {
  /** Array of items to be displayed in the carousel */
  items: React.ReactNode[];
  /** Initial index of the item to show (defaults to 0) */
  initialIndex?: number;
  /** Height of the carousel container */
  height?: number;
  /** Background color of the container (defaults to "transparent") */
  backgroundColor?: string;
  /** Bottom position of the pagination dots in pixels (defaults to 10) */
  paginationBottomPosition?: number;
  /** Color of the pagination dots (defaults to "#000") */
  paginationDotColor?: string;
  /** Size of the pagination dots in pixels (defaults to 6) */
  paginationDotSize?: number;
  /** Gap between pagination dots in pixels (defaults to 6) */
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

export const CarousalWidget: React.FC<CarousalWidgetProps> = ({
  items,
  initialIndex = 0,
  height = 200,
  backgroundColor = "transparent",
  paginationBottomPosition = 10,
  paginationDotColor = "#000",
  paginationDotSize = 6,
  paginationDotGap = 6,
  paginationActiveDotScale = 1.2,
  paginationInactiveDotScale = 0.8,
  paginationActiveDotOpacity = 1,
  paginationInactiveDotOpacity = 0.3,
}) => {
  const scrollX = useSharedValue(0);

  const PaginationDot: React.FC<{ index: number }> = ({ index }) => {
    const dotStyle = useAnimatedStyle(() => {
      const progress = scrollX.value / SCREEN_WIDTH;
      const opacity = interpolate(
        progress,
        [index - 1, index, index + 1],
        [
          paginationInactiveDotOpacity,
          paginationActiveDotOpacity,
          paginationInactiveDotOpacity,
        ],
        Extrapolation.CLAMP
      );
      const scale = interpolate(
        progress,
        [index - 1, index, index + 1],
        [
          paginationInactiveDotScale,
          paginationActiveDotScale,
          paginationInactiveDotScale,
        ],
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
            width: paginationDotSize,
            height: paginationDotSize,
            borderRadius: paginationDotSize / 2,
            backgroundColor: paginationDotColor,
          },
          dotStyle,
        ]}
      />
    );
  };

  return (
    <View style={{ height, backgroundColor, gap: 10 }}>
      <FlatList
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH, height: "100%" }}>{item}</View>
        )}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: paginationDotGap,
        }}
      >
        {items.map((_, index) => (
          <PaginationDot key={index} index={index} />
        ))}
      </View>
    </View>
  );
};
