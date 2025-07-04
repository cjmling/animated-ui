import React from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const ITEM_HEIGHT = 30;
const ITEM_SPACING = 2;
const TOTAL_HEIGHT = ITEM_HEIGHT + ITEM_SPACING;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = TOTAL_HEIGHT * VISIBLE_ITEMS;

function TimeLabel({
  item,
  index,
  scrollYSelected,
}: {
  item: { label: string; value: any };
  index: number;
  scrollYSelected: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [index - 2, index - 1, index, index + 1, index + 2];
    const opacity = interpolate(
      scrollYSelected.value,
      inputRange,
      [0.2, 0.99, 1, 0.99, 0.2],
      "clamp"
    );

    // If you want to animate the font size uncomment the below code
    // const fontSize = interpolate(
    //   scrollYSelected.value,
    //   inputRange,
    //   [16, 18, 24, 18, 16],
    //   "clamp"
    // );
    const color = interpolateColor(
      scrollYSelected.value,
      [index - 1, index, index + 1],
      ["#888", "#fff", "#888"]
    );
    return {
      opacity,
      //   fontSize,
      color,
      textAlign: "center",
      height: ITEM_HEIGHT,
      lineHeight: ITEM_HEIGHT,
      fontWeight: "600",
      fontSize: 20,
    };
  });
  return (
    <Animated.Text
      style={[
        {
          width: "100%",
          textAlign: "center",
        },
        ,
        animatedStyle,
      ]}
      key={index}
    >
      {item.label}
    </Animated.Text>
  );
}

export const VerticalScrollSelect = ({
  selected,
  setSelected,
  labels,
}: {
  selected: number;
  setSelected: (index: number) => void;
  labels: { label: string; value: any }[];
}) => {
  const scrollYSelected = useSharedValue(selected);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollYSelected.value = event.contentOffset.y / TOTAL_HEIGHT;
      const newActiveIndex = Math.round(scrollYSelected.value);
      if (
        newActiveIndex >= 0 &&
        newActiveIndex < labels.length &&
        newActiveIndex !== selected
      ) {
        runOnJS(setSelected)(newActiveIndex);
      }
    },
  });

  return (
    <View
      style={{
        height: CONTAINER_HEIGHT,
        width: 120,
        backgroundColor: "#181818",
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Animated.FlatList
        data={labels}
        renderItem={({ item, index }) => (
          <TimeLabel
            item={item}
            index={index}
            scrollYSelected={scrollYSelected}
          />
        )}
        keyExtractor={(item) => item.label.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: (CONTAINER_HEIGHT - TOTAL_HEIGHT) / 2,
          gap: ITEM_SPACING,
        }}
        snapToInterval={TOTAL_HEIGHT}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        initialScrollIndex={selected}
        getItemLayout={(_, index) => ({
          length: TOTAL_HEIGHT,
          offset: TOTAL_HEIGHT * index,
          index,
        })}
        style={{ flexGrow: 0 }}
      />
    </View>
  );
};
