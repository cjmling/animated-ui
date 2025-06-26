import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FlipInYLeft,
  FlipOutYRight,
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
  {
    id: "1",
    color: "#FF6B6B",
    title: "Card 1",
    description: "This is the back side",
  },
  {
    id: "2",
    color: "#FFD93D",
    title: "Card 2",
    description: "This is the back side",
  },
  {
    id: "3",
    color: "#6BCB77",
    title: "Card 3",
    description: "This is the back side",
  },
  {
    id: "4",
    color: "#4D96FF",
    title: "Card 4",
    description: "This is the back side",
  },
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
  const [isFlipped, setIsFlipped] = useState(false);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!isTop) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotateZ.value = event.translationX / 20;
    })
    .onEnd(() => {
      if (!isTop) return;

      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const toX = translateX.value > 0 ? CARD_WIDTH * 1.2 : -CARD_WIDTH * 1.2;
        translateX.value = withTiming(toX, { duration: 200 }, () => {
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

  const tapGesture = Gesture.Tap()
    .maxDistance(5)
    .onStart(() => {
      if (!isTop) return;

      runOnJS(setIsFlipped)(!isFlipped);
    });

  const gesture = Gesture.Simultaneous(panGesture, tapGesture);

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
          { zIndex: cardsData.length - index },
          animatedStyle,
        ]}
      >
        {/* Front side */}
        {!isFlipped && (
          <Animated.View
            style={[styles.cardSide, { backgroundColor: card.color }]}
            entering={FlipInYLeft}
            exiting={FlipOutYRight}
          >
            <Text style={styles.text}>{card.title}</Text>
            <Text style={styles.tapHint}>Tap to flip back</Text>
          </Animated.View>
        )}

        {/* Back side */}
        {isFlipped && (
          <Animated.View
            entering={FlipInYLeft}
            exiting={FlipOutYRight}
            style={[styles.cardSide, styles.cardBack]}
          >
            <Text style={styles.text}>{card.title}</Text>
            <Text style={styles.description}>{card.description}</Text>
            <Text style={styles.tapHint}>Tap to flip front</Text>
          </Animated.View>
        )}
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
    backgroundColor: "#222",
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
  cardSide: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  cardBack: {
    backgroundColor: "#333",
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 10,
    textAlign: "center",
  },
  tapHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
});
