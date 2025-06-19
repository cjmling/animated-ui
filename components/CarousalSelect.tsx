import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Design https://pin.it/Z0QM0g8Fi

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.45;
const CARD_HEIGHT = 300;
const CARD_SPACING = 50;
const CARD_TOP_PADDING = 100;
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_SPACING;
const CARD_CENTER_SPACING = 20;

const cards = [
  { key: "1", title: "airtel", offer: "50% cashback on mobile" },
  { key: "2", title: "jio", offer: "25% off on recharge" },
  { key: "3", title: "vodafone", offer: "Free 1GB Data" },
  { key: "4", title: "idea", offer: "10% cashback" },
];

export default function CarousalSelect() {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardVerticalOffset = useSharedValue(0);
  const isCardSwiped = useSharedValue(false);
  // const flatListRef = useRef<FlatList>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;

      const newActiveIndex = Math.round(scrollX.value / CARD_TOTAL_WIDTH);
      // Sometime newActiveIndex is beyond the items array length and only set the active index if it is different from the current active index
      if (
        newActiveIndex >= 0 &&
        newActiveIndex < cards.length &&
        newActiveIndex !== activeIndex
      ) {
        runOnJS(setActiveIndex)(newActiveIndex);
        // Reset card position when switching to a new active card
        cardVerticalOffset.value = withSpring(0);
        isCardSwiped.value = false;
      }
    },
  });

  const resetCardPosition = () => {
    cardVerticalOffset.value = withSpring(0);
    isCardSwiped.value = false;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#333",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.title}>Choose your{"\n"}welcome gift</Text>
        <View
          style={{
            width: "100%",
            height: CARD_HEIGHT * 2,
          }}
        >
          {/* Center highlight border */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              borderWidth: 3,
              borderColor: "#FFD700",
              borderRadius: 18 + CARD_CENTER_SPACING / 2,
              zIndex: 1,
              left: (SCREEN_WIDTH - CARD_WIDTH - CARD_CENTER_SPACING) / 2,
              width: CARD_WIDTH + CARD_CENTER_SPACING,
              height: CARD_HEIGHT + CARD_CENTER_SPACING,
              top: CARD_TOP_PADDING - CARD_CENTER_SPACING / 2,
            }}
          />
          <Animated.FlatList
            data={cards}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_TOTAL_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
              justifyContent: "center",
              paddingTop: CARD_TOP_PADDING,
              gap: CARD_SPACING,
            }}
            onScroll={onScroll}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
              return (
                <AnimatedCard
                  item={item}
                  index={index}
                  scrollX={scrollX}
                  isActive={index === activeIndex}
                  cardVerticalOffset={cardVerticalOffset}
                  isCardSwiped={isCardSwiped}
                  onResetPosition={resetCardPosition}
                />
              );
            }}
          />
        </View>
        <Text style={styles.swipeHint}>Drag down to activate offer</Text>
      </View>
    </GestureHandlerRootView>
  );
}

interface AnimatedCardProps {
  item: {
    key: string;
    title: string;
    offer: string;
  };
  index: number;
  scrollX: Animated.SharedValue<number>;
  isActive: boolean;
  cardVerticalOffset: Animated.SharedValue<number>;
  isCardSwiped: Animated.SharedValue<boolean>;
  onResetPosition: () => void;
}

function AnimatedCard({
  item,
  index,
  scrollX,
  isActive,
  cardVerticalOffset,
  isCardSwiped,
  onResetPosition,
}: AnimatedCardProps) {
  const inputRange = [
    (index - 1) * (CARD_WIDTH + CARD_SPACING),
    index * (CARD_WIDTH + CARD_SPACING),
    (index + 1) * (CARD_WIDTH + CARD_SPACING),
  ];

  // Gesture for vertical swipe (only for active card)
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isActive) {
        // Only allow downward swipe
        if (event.translationY > 0) {
          cardVerticalOffset.value = event.translationY;
        }
      }
    })
    .onEnd((event) => {
      if (isActive) {
        // If swiped down more than 100px, activate the card
        if (event.translationY > 100) {
          cardVerticalOffset.value = withTiming(300, { duration: 500 });
          isCardSwiped.value = true;
          // You can add your activation logic here
          console.log(`Activated card: ${item.title}`);
        } else {
          // Reset to original position
          cardVerticalOffset.value = withSpring(0);
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(scrollX.value, inputRange, [-10, 0, 10]);
    const scale = interpolate(scrollX.value, inputRange, [0.92, 1, 0.92]);
    const opacity = interpolate(scrollX.value, inputRange, [0.7, 1, 0.7]);
    const translateY = interpolate(scrollX.value, inputRange, [-50, 0, -50]);

    // Add vertical offset for active card
    const activeTranslateY = isActive ? cardVerticalOffset.value : 0;

    return {
      transform: [
        { rotate: `${rotate}deg` },
        { scale },
        { translateY: translateY + activeTranslateY },
      ],
      opacity: isCardSwiped.value && isActive ? 0.3 : opacity,
    };
  });

  const cardContent = (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardOffer}>{item.offer}</Text>
      {isActive ? (
        <Animated.Text
          style={styles.swipeIndicator}
          entering={FadeIn}
          exiting={FadeOut}
        >
          ↓ Swipe down to activate
        </Animated.Text>
      ) : (
        <Text style={styles.swipeIndicator}></Text> //Placeholder so it doesn't jump
      )}
    </Animated.View>
  );

  // Only wrap with gesture detector if it's the active card
  if (isActive) {
    return (
      <GestureDetector gesture={panGesture}>{cardContent}</GestureDetector>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 24,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#222",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
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
  swipeIndicator: {
    color: "#FFD700",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
});
