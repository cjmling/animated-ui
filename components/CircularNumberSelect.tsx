import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const TICK_COUNT = 61; // 0-60
const TICK_WIDTH = 2;
const TICK_HEIGHT = 60;
const TICK_SPACING = 10;
const TICK_TOTAL_WIDTH = TICK_WIDTH + TICK_SPACING;
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = 12; // space per tick

const ticks = Array.from({ length: TICK_COUNT }, (_, i) => i);

function Tick({
  item,
  index,
  scrollXSelected,
}: {
  item: number;
  index: number;
  scrollXSelected: SharedValue<number>;
}) {
  // Animated highlight for center tick
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: TICK_HEIGHT,
      width: TICK_WIDTH,
      backgroundColor: interpolateColor(
        scrollXSelected.value,
        [index - 1, index, index + 1],
        ["#888", "#FFF", "#888"]
      ),
      transform: [
        {
          rotate: `${interpolate(
            scrollXSelected.value,
            [index - 1, index, index + 1],
            [3, 0, -3]
          )}deg`,
        },
      ],
    };
  });

  return <Animated.View style={animatedStyle} key={index} />;
}

export default function CircularNumberSelect() {
  const [selected, setSelected] = useState(Math.floor(TICK_COUNT / 2));
  const scrollXSelected = useSharedValue(selected * ITEM_SIZE);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollXSelected.value = event.contentOffset.x / TICK_TOTAL_WIDTH;
      console.log(scrollXSelected.value);
      const newActiveIndex = Math.round(scrollXSelected.value);
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
        gap: 20,
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
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            backgroundColor: "#FFF",
            borderRadius: 18 + TICK_SPACING / 2,
            zIndex: 1,
            left: (SCREEN_WIDTH - TICK_WIDTH - TICK_SPACING / 2) / 2,
            width: TICK_WIDTH + TICK_SPACING / 2,
            height: TICK_HEIGHT * 4,
            top: -10,
          }}
        />
        <Animated.FlatList
          data={ticks}
          renderItem={({ item, index }) => (
            <Tick item={item} index={index} scrollXSelected={scrollXSelected} />
          )}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
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
