import React, { useState } from "react";
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

const MIN_AGE = 27;
const MAX_AGE = 65;
const TICK_HEIGHT = 40;
const TICK_SPACING = 4;
const TICK_TOTAL_HEIGHT = TICK_HEIGHT + TICK_SPACING;
const CONTAINER_HEIGHT = 800; // If user can't scroll to certain tick, we can increase this height

const ticks = Array.from(
  { length: MAX_AGE - MIN_AGE + 1 },
  (_, i) => MIN_AGE + i
);

function Tick({
  item,
  index,
  scrollYSelected,
}: {
  item: number;
  index: number;
  scrollYSelected: SharedValue<number>;
}) {
  // Animated highlight for center tick
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      index - 4,
      index - 3,
      index - 2,
      index - 1,
      index,
      index + 1,
      index + 2,
      index + 3,
      index + 4,
    ];
    const opacity = interpolate(
      scrollYSelected.value,
      inputRange,
      [0.2, 0.5, 0.7, 0.8, 1, 0.8, 0.7, 0.5, 0.2],
      "extend"
    );
    const fontSize = interpolate(
      scrollYSelected.value,
      inputRange,
      [18, 22, 26, 30, 36, 30, 26, 22, 18],
      "extend"
    );

    const color = interpolateColor(
      scrollYSelected.value,
      [index - 1, index, index + 1],
      ["#999", "#111", "#999"]
    );
    return {
      opacity,
      fontSize,
      color,
      textAlign: "center",
      height: TICK_HEIGHT,
      lineHeight: TICK_HEIGHT,
    };
  });

  return (
    <Animated.Text style={animatedStyle} key={index}>
      {item}
    </Animated.Text>
  );
}

export const NumberSelector = () => {
  const [selected, setSelected] = useState(Math.floor(ticks.length / 2));
  const scrollYSelected = useSharedValue(selected);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollYSelected.value = event.contentOffset.y / TICK_TOTAL_HEIGHT;
      const newActiveIndex = Math.round(scrollYSelected.value);

      if (
        newActiveIndex >= 0 &&
        newActiveIndex < ticks.length &&
        newActiveIndex !== selected
      ) {
        console.log(ticks[newActiveIndex]);
        runOnJS(setSelected)(newActiveIndex);
      }
    },
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        height: CONTAINER_HEIGHT,
      }}
    >
      <Animated.FlatList
        data={ticks}
        renderItem={({ item, index }) => (
          <Tick item={item} index={index} scrollYSelected={scrollYSelected} />
        )}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: (CONTAINER_HEIGHT - TICK_TOTAL_HEIGHT) / 2,
          gap: TICK_SPACING,
        }}
        snapToInterval={TICK_TOTAL_HEIGHT}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        initialScrollIndex={selected}
        getItemLayout={(_, index) => ({
          length: TICK_TOTAL_HEIGHT,
          offset: TICK_TOTAL_HEIGHT * index,
          index,
        })}
        style={{ flexGrow: 0 }}
      />
    </View>
  );
};
