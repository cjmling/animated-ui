import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const TICK_COUNT = 61; // 0-60
const TICK_WIDTH = 2;
const TICK_HEIGHT = 24;
const TICK_SPACING = 10;
const TICK_TOTAL_WIDTH = TICK_WIDTH + TICK_SPACING;
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = 24; // space per tick

const ticks = Array.from({ length: TICK_COUNT }, (_, i) => i);

function Tick({
  item,
  index,
  scrollX,
}: {
  item: number;
  index: number;
  scrollX: SharedValue<number>;
}) {
  // Animated highlight for center tick
  const animatedStyle = useAnimatedStyle(() => {
    const center = scrollX.value / ITEM_SIZE;
    const isActive = Math.abs(center - index) < 0.5;
    return {
      backgroundColor: isActive ? "#fff" : "#888",
      height: isActive ? TICK_HEIGHT * 1.4 : TICK_HEIGHT,
      width: TICK_WIDTH,
    };
  });

  return <Animated.View style={animatedStyle} key={index} />;
}

export default function CircularNumberSelect() {
  const [selected, setSelected] = useState(Math.floor(TICK_COUNT / 2));
  const scrollX = useSharedValue(selected * ITEM_SIZE);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x / TICK_TOTAL_WIDTH;
      const newActiveIndex = Math.round(scrollX.value);
      if (
        newActiveIndex >= 0 &&
        newActiveIndex < TICK_COUNT &&
        newActiveIndex !== selected
      ) {
        runOnJS(setSelected)(newActiveIndex);
      }
    },
  });

  return (
    <View
      style={{
        height: 200,
        backgroundColor: "#222",
        borderRadius: 32,
        overflow: "hidden",
      }}
    >
      <View style={{ alignItems: "center", marginTop: 16 }}>
        <Text style={{ color: "#fff", fontSize: 36, fontWeight: "600" }}>
          {ticks[selected]}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#444",
        }}
      >
        <Animated.FlatList
          data={ticks}
          renderItem={({ item, index }) => (
            <Tick item={item} index={index} scrollX={scrollX} />
          )}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          //   bounces={false}
          contentContainerStyle={{
            paddingHorizontal: (SCREEN_WIDTH - TICK_WIDTH) / 2, // This is to center the carousal starting and ending point
            gap: TICK_SPACING,
          }}
          snapToInterval={TICK_TOTAL_WIDTH}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      </View>
    </View>
  );
}
