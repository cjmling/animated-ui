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
    setExpanded((prev) => !prev);
    anims.forEach((anim, i) => {
      let bounceFactor = 1;
      if (i === 0) {
        bounceFactor = 3;
      }

      if (i === 1) {
        bounceFactor = 2;
      }

      if (i === 2) {
        bounceFactor = 1;
      }

      const delay = bounceFactor * 150;
      anim.value = withSequence(
        withTiming(
          expanded ? BOUNCE_UP * bounceFactor : BOUNCE_UP * bounceFactor,
          { duration: delay },
          () => {}
        ),

        withTiming(
          expanded ? BOUNCE_DOWN * bounceFactor : BOUNCE_SETTLE * bounceFactor,
          { duration: delay },
          () => {}
        )
      );
    });
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
        <View style={styles.totalContainer}></View>
        <View style={styles.totalBox}>
          <Text style={styles.total}>424,014</Text>
          <Text style={styles.totalLabel}>Total Balance</Text>
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
  totalBox: {
    alignItems: "center",
    backgroundColor: "#1B1F14",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 40,
    marginTop: -150,
    zIndex: 100,
    width: CARD_WIDTH * 0.8,
  },
  totalContainer: {
    backgroundColor: "#1B1F14",
    marginTop: 100,
    width: CARD_WIDTH * 1.2,
    height: CARD_HEIGHT * 1.5,
    borderRadius: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
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
