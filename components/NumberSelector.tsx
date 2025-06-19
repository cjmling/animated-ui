import React, { useState } from "react";
import { Text, View } from "react-native";
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
    const inputRange = [index - 2, index - 1, index, index + 1, index + 2];
    const opacity = interpolate(
      scrollYSelected.value,
      inputRange,
      [0.2, 0.5, 1, 0.5, 0.2]
    );
    const fontSize = interpolate(
      scrollYSelected.value,
      inputRange,
      [18, 22, 36, 22, 18]
    );
    const fontWeight = scrollYSelected.value === index ? "700" : "400";
    const color = interpolateColor(
      scrollYSelected.value,
      [index - 1, index, index + 1],
      ["#999", "#111", "#999"]
    );
    return {
      opacity,
      fontSize,
      color,
      fontWeight,
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
        runOnJS(setSelected)(newActiveIndex);
      }
    },
  });

  return (
    <View
      style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center" }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: "600",
          marginTop: 32,
          marginBottom: 16,
        }}
      >
        How old are you?
      </Text>
      <View
        style={{
          height: TICK_TOTAL_HEIGHT * 15,
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
            paddingVertical: TICK_TOTAL_HEIGHT * 2,
            gap: TICK_SPACING,
          }}
          snapToInterval={TICK_TOTAL_HEIGHT}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={{ flexGrow: 0, backgroundColor: "red" }}
        />
      </View>
    </View>
  );
};
