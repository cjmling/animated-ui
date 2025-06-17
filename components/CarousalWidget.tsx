import React from "react";
import { Dimensions, FlatList, View } from "react-native";

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

const SCREEN_WIDTH = Dimensions.get("window").width;
const CAROUSEL_CONTAINER_WIDTH = SCREEN_WIDTH * 0.9;
const CAROUSEL_CONTAINER_HEIGHT = 200;
const CAROUSEL_WIDTH = SCREEN_WIDTH * 0.7;
const CAROUSEL_SPACING = 10;
const CAROUSEL_TOTAL_WIDTH = CAROUSEL_WIDTH + CAROUSEL_SPACING;

export const CarousalWidget: React.FC<CarousalWidgetProps> = ({ items }) => {
  return (
    <View
      style={{
        width: CAROUSEL_CONTAINER_WIDTH,
        height: CAROUSEL_CONTAINER_HEIGHT,
      }}
    >
      <FlatList
        data={items}
        contentContainerStyle={{
          paddingHorizontal: (CAROUSEL_CONTAINER_WIDTH - CAROUSEL_WIDTH) / 2,
          gap: CAROUSEL_SPACING,
        }}
        renderItem={({ item }) => (
          <View style={{ width: CAROUSEL_WIDTH }}>{item}</View>
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={CAROUSEL_TOTAL_WIDTH}
        decelerationRate="fast"
      />
    </View>
  );
};
