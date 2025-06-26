import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface StackCardsProps {
  cards: React.ReactNode[];
  cardWidth?: number;
  cardHeight?: number;
  stackOffset?: number;
  maxRotation?: number;
}

export const StackCards = ({
  cards,
  cardWidth = 250,
  cardHeight = 300,
  stackOffset = 8,
  maxRotation = 10,
}: StackCardsProps) => {
  // Generate alternating rotations for each card
  const rotations = useMemo(() => {
    return cards.map((_, index) => {
      // Alternate between positive and negative 15 degrees
      return index % 2 === 0 ? 5 : -5;
    });
  }, [cards]);

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              width: cardWidth,
              height: cardHeight,
              transform: [
                { rotate: `${rotations[index]}deg` },
                { translateY: index * stackOffset },
              ],
              zIndex: cards.length - index, // Higher cards have higher z-index
            },
          ]}
        >
          {card}
        </View>
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
