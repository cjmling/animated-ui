import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface StackCardsProps {
  cards: React.ReactNode[];
  cardWidth?: number;
  cardHeight?: number;
  stackOffset?: number;
  onCardSwiped?: (index: number, direction: "left" | "right") => void;
}

export const StackCards = ({
  cards,
  cardWidth = 250,
  cardHeight = 350,
  stackOffset = 8,
  onCardSwiped,
}: StackCardsProps) => {
  // Generate alternating rotations for each card
  const rotations = useMemo(() => {
    return cards.map((_, index) => {
      // Alternate between positive and negative 15 degrees
      return index % 2 === 0 ? 5 : -5;
    });
  }, [cards]);

  // Animation values for each card
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Threshold for swipe detection
  const SWIPE_THRESHOLD = cardWidth * 0.3;

  const moveCardToBack = useCallback(() => {
    if (onCardSwiped) {
      onCardSwiped(0, translateX.value > 0 ? "right" : "left");
    }
  }, [onCardSwiped, translateX]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      // Scale and rotate based on swipe distance
      const progress = Math.abs(event.translationX) / SWIPE_THRESHOLD;
      scale.value = interpolate(progress, [0, 1], [1, 0.8], Extrapolate.CLAMP);
      rotation.value = interpolate(
        event.translationX,
        [-cardWidth, cardWidth],
        [-15, 15],
        Extrapolate.CLAMP
      );
    })
    .onEnd((event) => {
      const shouldSwipe = Math.abs(event.translationX) > SWIPE_THRESHOLD;

      if (shouldSwipe) {
        // Animate card off screen
        translateX.value = withSpring(
          event.translationX > 0 ? cardWidth * 2 : -cardWidth * 2
        );
        translateY.value = withSpring(0);
        scale.value = withSpring(0.8);

        // Call the callback after animation
        // setTimeout(() => {
        //   //   if (onCardSwiped) {
        //   // runOnJS(moveCardToBack)();
        //   //   }
        // }, 300);
      } else {
        // Reset card position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        rotation.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <GestureDetector key={index} gesture={panGesture}>
          <Animated.View
            style={[
              styles.card,
              {
                width: cardWidth,
                height: cardHeight,
                transform: [
                  { rotate: `${rotations[index]}deg` },
                  { translateY: index * stackOffset },
                ],
                zIndex: cards.length - index,
              },
              index === 0 && animatedStyle, // Only apply swipe animation to top card
            ]}
          >
            {card}
          </Animated.View>
        </GestureDetector>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "blue",
    marginTop: 100,
  },
  card: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
