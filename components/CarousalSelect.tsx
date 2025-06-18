import React, { useRef } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.65;
const CARD_HEIGHT = 200;
const CARD_SPACING = 16;

const cards = [
  { key: "1", title: "airtel", offer: "50% cashback on mobile" },
  { key: "2", title: "jio", offer: "25% off on recharge" },
  { key: "3", title: "vodafone", offer: "Free 1GB Data" },
  { key: "4", title: "idea", offer: "10% cashback" },
];

export default function CarousalSelect() {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your{"\n"}welcome gift</Text>
      <View style={styles.carousalWrapper}>
        {/* Center highlight border */}
        <View
          pointerEvents="none"
          style={[
            styles.centerHighlight,
            {
              left: (SCREEN_WIDTH - CARD_WIDTH) / 2,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
            },
          ]}
        />
        <Animated.FlatList
          ref={flatListRef}
          data={cards}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
          }}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => {
            return <AnimatedCard item={item} index={index} scrollX={scrollX} />;
          }}
        />
      </View>
      <Text style={styles.swipeHint}>Drag down to activate offer</Text>
    </View>
  );
}

function AnimatedCard({ item, index, scrollX }: any) {
  const inputRange = [
    (index - 1) * (CARD_WIDTH + CARD_SPACING),
    index * (CARD_WIDTH + CARD_SPACING),
    (index + 1) * (CARD_WIDTH + CARD_SPACING),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(scrollX.value, inputRange, [-10, 0, 10]);
    const scale = interpolate(scrollX.value, inputRange, [0.92, 1, 0.92]);
    const opacity = interpolate(scrollX.value, inputRange, [0.7, 1, 0.7]);
    const translateY = interpolate(scrollX.value, inputRange, [-50, 0, -50]);
    return {
      transform: [{ rotate: `${rotate}deg` }, { scale }, { translateY }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardOffer}>{item.offer}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 24,
  },
  carousalWrapper: {
    width: "100%",
    height: CARD_HEIGHT + 32,
    justifyContent: "center",
  },
  centerHighlight: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "#FFD700",
    borderRadius: 18,
    zIndex: 1,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: CARD_SPACING / 2,
    backgroundColor: "#222",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  cardOffer: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  swipeHint: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 32,
  },
});
