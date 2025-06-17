import { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// This component is based on the tutorial by Catalin Miron https://www.youtube.com/watch?v=6Va1yBFdUxI

const items = [
  { key: "1", title: "Item 1" },
  { key: "2", title: "Item 2" },
  { key: "3", title: "Item 3" },
  { key: "4", title: "Item 4" },
  { key: "5", title: "Item 5" },
  { key: "6", title: "Item 6" },
  { key: "7", title: "Item 7" },
  { key: "8", title: "Item 8" },
  { key: "9", title: "Item 9" },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const CIRCULAR_PREVIEW_WIDTH = 100;
const CIRCULAR_SPACING = 10;
const CIRCULAR_TOTAL_WIDTH = CIRCULAR_PREVIEW_WIDTH + CIRCULAR_SPACING;

export const CircularCarousal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x / CIRCULAR_TOTAL_WIDTH;
      const newActiveIndex = Math.round(scrollX.value);
      // Sometime newActiveIndex is beyond the items array length and only set the active index if it is different from the current active index
      if (
        newActiveIndex >= 0 &&
        newActiveIndex < items.length &&
        newActiveIndex !== activeIndex
      ) {
        runOnJS(setActiveIndex)(newActiveIndex);
      }
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#222" }}>
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        style={{
          backgroundColor: "#222",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        key={`activeIndex-${activeIndex}`}
      >
        <Animated.Text style={{ color: "#fff", fontSize: 100 }}>
          {items[activeIndex].title.toLocaleUpperCase()}
        </Animated.Text>
      </Animated.View>
      <View style={{ position: "absolute", bottom: 0, left: 0 }}>
        <Animated.FlatList
          style={{
            flexGrow: 0, // To stop carousal from taking up the full height of the screen
            paddingBottom: CIRCULAR_PREVIEW_WIDTH / 2,
          }}
          data={items}
          renderItem={({ item, index }) => (
            <CarousalItem item={item} scrollX={scrollX} index={index} />
          )}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingHorizontal: (SCREEN_WIDTH - CIRCULAR_PREVIEW_WIDTH) / 2, // This is to center the carousal starting and ending point
            gap: CIRCULAR_SPACING,
          }}
          snapToInterval={CIRCULAR_TOTAL_WIDTH}
          decelerationRate="fast"
        />
      </View>
    </View>
  );
};

const CarousalItem = ({
  item,
  scrollX,
  index,
}: {
  item: { key: string; title: string };
  scrollX: SharedValue<number>;
  index: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderWidth: 4,
      borderColor: interpolateColor(
        scrollX.value,
        [index - 1, index, index + 1],
        ["transparent", "#FFF", "transparent"]
      ),
      transform: [
        {
          translateY: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [CIRCULAR_PREVIEW_WIDTH / 3, 1, CIRCULAR_PREVIEW_WIDTH / 3]
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: CIRCULAR_PREVIEW_WIDTH,
          height: CIRCULAR_PREVIEW_WIDTH,
          backgroundColor: "#000",
          borderRadius: CIRCULAR_PREVIEW_WIDTH / 2,
          justifyContent: "center",
          alignItems: "center",
        },
        animatedStyle,
      ]}
    >
      <Text style={{ color: "#fff" }}>{item.title}</Text>
    </Animated.View>
  );
};
