import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const TICK_COUNT = 61; // 0-60
const TICK_ANGLE = 120; // degrees of arc
const TICK_SIZE = 40; // radius of arc
const TICK_WIDTH = 2;
const TICK_HEIGHT = 24;
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = 24; // space per tick

const ticks = Array.from({ length: TICK_COUNT }, (_, i) => i);

function Tick({
  index,
  scrollX,
  SCREEN_WIDTH,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
  SCREEN_WIDTH: number;
}) {
  // Arc layout: center the arc horizontally
  const arcRadius = TICK_SIZE;
  const arcStart = (180 - TICK_ANGLE) / 2;
  // Calculate angle for this tick
  const angle = arcStart + (index / (TICK_COUNT - 1)) * TICK_ANGLE;
  const rad = (angle * Math.PI) / 180;
  const x = arcRadius * Math.cos(rad);
  const y = arcRadius * Math.sin(rad);

  // Animated highlight for center tick
  const animatedStyle = useAnimatedStyle(() => {
    const center = scrollX.value / ITEM_SIZE;
    const isActive = Math.abs(center - index) < 0.5;
    return {
      backgroundColor: isActive ? "#fff" : "#888",
      height: isActive ? TICK_HEIGHT * 1.4 : TICK_HEIGHT,
      width: TICK_WIDTH,
      borderRadius: TICK_WIDTH / 2,
      position: "absolute",
      left: SCREEN_WIDTH / 2 + x - TICK_WIDTH / 2,
      top: 60 + y, // 60px from top for number display
    };
  });

  return <Animated.View style={animatedStyle} key={index} />;
}

export default function CircularNumberSelect() {
  const [selected, setSelected] = useState(Math.floor(TICK_COUNT / 2));
  const scrollX = useSharedValue(selected * ITEM_SIZE);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const idx = Math.round(event.contentOffset.x / ITEM_SIZE);
      if (idx !== selected && idx >= 0 && idx < TICK_COUNT) {
        runOnJS(setSelected)(idx);
      }
    },
  });

  const renderItem = ({ item, index }: { item: number; index: number }) => (
    <Tick index={index} scrollX={scrollX} SCREEN_WIDTH={SCREEN_WIDTH} />
  );

  return (
    <View
      style={{
        height: 140,
        backgroundColor: "#000",
        borderRadius: 32,
        overflow: "hidden",
        margin: 16,
      }}
    >
      <View style={{ alignItems: "center", marginTop: 16 }}>
        <Text style={{ color: "#fff", fontSize: 36, fontWeight: "600" }}>
          {ticks[selected]}
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.FlatList
          data={ticks}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ height: 120 }}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={{ position: "absolute", width: SCREEN_WIDTH, height: 120 }}
        />
      </View>
    </View>
  );
}
