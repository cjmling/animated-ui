import React from "react";
import { StyleSheet, View } from "react-native";
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
  label,
  index,
  scrollYSelected,
}: {
  label: string;
  index: number;
  scrollYSelected: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [index - 2, index - 1, index, index + 1, index + 2];
    const opacity = interpolate(
      scrollYSelected.value,
      inputRange,
      [0.2, 0.5, 1, 0.5, 0.2],
      "clamp"
    );
    const fontSize = interpolate(
      scrollYSelected.value,
      inputRange,
      [16, 18, 24, 18, 16],
      "clamp"
    );
    const color = interpolateColor(
      scrollYSelected.value,
      [index - 1, index, index + 1],
      ["#888", "#fff", "#888"]
    );
    return {
      opacity,
      fontSize,
      color,
      textAlign: "center",
      height: ITEM_HEIGHT,
      lineHeight: ITEM_HEIGHT,
      fontWeight: "600",
    };
  });
  return (
    <Animated.Text style={[styles.label, animatedStyle]} key={index}>
      {label}
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
  labels: string[];
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
    <View style={styles.container}>
      <Animated.FlatList
        data={labels}
        renderItem={({ item, index }) => (
          <TimeLabel
            label={item}
            index={index}
            scrollYSelected={scrollYSelected}
          />
        )}
        keyExtractor={(item) => item}
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

const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT,
    width: 120,
    backgroundColor: "#181818",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  label: {
    width: "100%",
    textAlign: "center",
  },
});
