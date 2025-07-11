/* eslint-disable react-hooks/rules-of-hooks */
// CardStack.tsx
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// Design Inspiration: https://www.pinterest.com/pin/611574824483515995/

const CARD_WIDTH = 280;
const CARD_HEIGHT = 180;
const BOUNCE_UP = -30;
const BOUNCE_SETTLE = -20;
const BOUNCE_DOWN = 0;

const cards = [
  { label: "stripe", color: "#B2B2FF", amount: "$32,495" },
  { label: "wise", color: "#A6ECA8", amount: "$45,654" },
  { label: "paypal", color: "#F3F3F3", amount: "$345,865" },
];

const CardStack = () => {
  const [expanded, setExpanded] = useState(false);
  const anims = cards.map(() => useSharedValue(0));

  const onPress = () => {
    const totalCards = anims.length;
    anims.forEach((anim, i) => {
      const bounceFactor = totalCards - i;

      const delay = bounceFactor * 150;

      if (!expanded) {
        // When expanding: squeeze down first, then bounce up sequence
        anim.value = withSequence(
          withTiming(
            CARD_HEIGHT * 0.2 * bounceFactor,
            { duration: 500 },
            () => {}
          ),
          withTiming(BOUNCE_UP * bounceFactor, { duration: delay }, () => {}),
          withTiming(
            BOUNCE_SETTLE * bounceFactor,
            { duration: delay },
            () => {}
          )
        );
      } else {
        // When collapsing: just bounce down sequence
        anim.value = withSequence(
          withTiming(BOUNCE_UP * bounceFactor, { duration: delay }, () => {}),
          withTiming(BOUNCE_DOWN * bounceFactor, { duration: delay }, () => {})
        );
      }
    });

    if (!expanded) {
      setTimeout(() => {
        setExpanded((prev) => !prev);
      }, 500);
    } else {
      setExpanded((prev) => !prev);
    }
  };

  return (
    <Pressable onPress={onPress}>
      <View style={styles.wrapper}>
        {cards.map((card, index) => {
          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ translateY: anims[index].value }],
            zIndex: cards.length + index,
          }));

          return (
            <Animated.View
              key={card.label}
              style={[
                styles.card,
                animatedStyle,
                {
                  backgroundColor: card.color,
                  top: index * 40,
                },
              ]}
            >
              <Text style={styles.label}>{card.label}</Text>
              <Text style={styles.amount}>
                {expanded ? card.amount : "******"}
              </Text>
            </Animated.View>
          );
        })}
        <View style={styles.purseContainer}>
          <View style={styles.purseContainer2}>
            <View style={styles.totalBox}>
              <Text style={styles.total}>
                {expanded ? "424,014" : "******"}
              </Text>
              <Text style={styles.totalLabel}>Total Balance</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 200,
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    textTransform: "capitalize",
  },
  amount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },

  purseContainer: {
    backgroundColor: "#1B1F14",
    marginTop: 80,
    width: CARD_WIDTH * 1.2,
    height: CARD_HEIGHT * 1.5,
    borderRadius: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  purseContainer2: {
    backgroundColor: "#1B1F14",
    width: CARD_WIDTH * 1,
    height: CARD_HEIGHT * 1.1,
    zIndex: 100,
    alignItems: "center",
    marginTop: 25,
  },
  totalBox: {
    alignItems: "center",
    backgroundColor: "#1B1F14",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 40,
    top: -10,
    zIndex: 100,
    width: CARD_WIDTH * 0.9,
  },
  total: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  totalLabel: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 4,
  },
});

export default CardStack;
