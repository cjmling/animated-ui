import React, { useState } from "react";
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
  /** Width of the carousel container in pixels */
  containerWidth?: number;
  /** Height of the carousel container in pixels (defaults to 200) */
  containerHeight?: number;
  /** Width of each carousel item as a percentage of screen width (defaults to 0.7) */
  itemWidthPercentage?: number;
  /** Spacing between carousel items in pixels (defaults to 10) */
  itemSpacing?: number;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

export const CarousalWidget: React.FC<CarousalWidgetProps> = ({
  items,
  paginationDotColor = "#000",
  paginationDotSize = 6,
  paginationDotGap = 6,
  paginationActiveDotScale = 1.2,
  paginationInactiveDotScale = 0.8,
  paginationActiveDotOpacity = 1,
  paginationInactiveDotOpacity = 0.3,
  containerWidth = SCREEN_WIDTH * 0.9,
  containerHeight = 200,
  itemWidthPercentage = 0.7,
  itemSpacing = 10,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const CAROUSEL_CONTAINER_WIDTH = containerWidth;
  const CAROUSEL_CONTAINER_HEIGHT = containerHeight;
  const CAROUSEL_WIDTH = SCREEN_WIDTH * itemWidthPercentage;
  const CAROUSEL_SPACING = itemSpacing;
  const CAROUSEL_TOTAL_WIDTH = CAROUSEL_WIDTH + CAROUSEL_SPACING;

  const PaginationDot: React.FC<{ index: number }> = ({ index }) => {
    const isActive = index === currentIndex;
    return (
      <View
        style={{
          width: paginationDotSize,
          height: paginationDotSize,
          borderRadius: paginationDotSize / 2,
          backgroundColor: paginationDotColor,
          opacity: isActive
            ? paginationActiveDotOpacity
            : paginationInactiveDotOpacity,
          transform: [
            {
              scale: isActive
                ? paginationActiveDotScale
                : paginationInactiveDotScale,
            },
          ],
        }}
      />
    );
  };

  return (
    <View
      style={{
        width: CAROUSEL_CONTAINER_WIDTH,
        height: CAROUSEL_CONTAINER_HEIGHT,
        gap: 10,
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
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / CAROUSEL_TOTAL_WIDTH
          );
          setCurrentIndex(newIndex);
        }}
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
