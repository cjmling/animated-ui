import { Dimensions, Text, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
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
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x / CIRCULAR_TOTAL_WIDTH;
    },
  });

  return (
    <View
      style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "#222" }}
    >
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
