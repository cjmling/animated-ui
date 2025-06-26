import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = height * 0.5;
const SWIPE_THRESHOLD = 120;

const cardsData = [
  { id: "1", color: "#FF6B6B" },
  { id: "2", color: "#FFD93D" },
  { id: "3", color: "#6BCB77" },
  { id: "4", color: "#4D96FF" },
];

const Card = ({
  card,
  index,
  onSwipe,
  isTop,
}: {
  card: any;
  index: number;
  onSwipe: (card: any) => void;
  isTop: boolean;
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!isTop) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotateZ.value = event.translationX / 20;
    })
    .onEnd(() => {
      if (!isTop) return;

      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const toX = translateX.value > 0 ? width * 1.5 : -width * 1.5;
        translateX.value = withTiming(toX, { duration: 500 }, () => {
          runOnJS(onSwipe)(card);
          translateX.value = withTiming(0, { duration: 200 });
          translateY.value = withTiming(0, { duration: 200 });
          rotateZ.value = withTiming(0, { duration: 200 });
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotateZ.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotateZ.value}deg` },
        { scale: withSpring(isTop ? 1 : 0.95 - index * 0.02) },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: card.color, zIndex: cardsData.length - index },
          animatedStyle,
        ]}
      >
        <Text style={styles.text}>Card {card.id}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export function StackCards() {
  const [cards, setCards] = useState(cardsData);

  const handleSwipe = (swipedCard: any) => {
    setCards((prev) => {
      const remaining = prev.filter((c) => c.id !== swipedCard.id);
      return [...remaining, swipedCard]; // move swiped card to end
    });
  };

  return (
    <View style={styles.container}>
      {cards
        .map((card, index) => {
          const isTop = index === 0;
          return (
            <Card
              key={card.id}
              card={card}
              index={index}
              isTop={isTop}
              onSwipe={handleSwipe}
            />
          );
        })
        .reverse()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
});
