import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// https://pin.it/5KO00P9VI

const ARTISTS = [
  {
    key: "1",
    name: "ALT-J",
    image: require("../assets/images/react-logo.png"),
  },
  {
    key: "2",
    name: "Cigarettes After Sex",
    image: require("../assets/images/react-logo.png"),
  },
  {
    key: "3",
    name: "Sigur Ros",
    image: require("../assets/images/react-logo.png"),
  },
  {
    key: "4",
    name: "Tame Impala",
    image: require("../assets/images/react-logo.png"),
  },
  {
    key: "5",
    name: "Glass Animals",
    image: require("../assets/images/react-logo.png"),
  },
  {
    key: "6",
    name: "The 1975",
    image: require("../assets/images/react-logo.png"),
  },
  {
    key: "7",
    name: "Arctic Monkeys",
    image: require("../assets/images/react-logo.png"),
  },
  {
    key: "8",
    name: "The Weeknd",
    image: require("../assets/images/react-logo.png"),
  },
  {
    key: "9",
    name: "Dua Lipa",
    image: require("../assets/images/react-logo.png"),
  },
  {
    key: "10",
    name: "Post Malone",
    image: require("../assets/images/react-logo.png"),
  },
];

const SCREEN_HEIGHT = Dimensions.get("window").height;
const CARD_HEIGHT = 120;
const CARD_SPACING = 60;
const CARD_TOTAL_HEIGHT = CARD_HEIGHT + CARD_SPACING;

// Add type for artist
interface Artist {
  key: string;
  name: string;
  image: any;
}

export const SpotifyVerticalScroll = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y / CARD_TOTAL_HEIGHT;
      const newActiveIndex = Math.round(scrollY.value);
      if (
        newActiveIndex >= 0 &&
        newActiveIndex < ARTISTS.length &&
        newActiveIndex !== activeIndex
      ) {
        console.log("newActiveIndex", newActiveIndex);
        // setActiveIndex(newActiveIndex);
        runOnJS(setActiveIndex)(newActiveIndex);
      }
    },
  });

  return (
    <View
      style={{ flex: 1, backgroundColor: "#181A20", justifyContent: "center" }}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Animated.FlatList
          data={ARTISTS}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) => (
            <ArtistCard item={item} index={index} scrollY={scrollY} />
          )}
          showsVerticalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{
            paddingVertical: (SCREEN_HEIGHT - CARD_HEIGHT) / 2,
            gap: CARD_SPACING,
          }}
          snapToInterval={CARD_TOTAL_HEIGHT}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
        {/* Vertical Strip Indicator */}
        <VerticalStripIndicator
          itemCount={ARTISTS.length}
          activeIndex={activeIndex}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Connect Spotify</Text>
        </Pressable>
      </View>
    </View>
  );
};

// Update ArtistCard props typing
const ArtistCard = ({
  item,
  index,
  scrollY,
}: {
  item: Artist;
  index: number;
  scrollY: SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [index - 1, index, index + 1],
      [-CARD_SPACING / 1.2, 0, -CARD_SPACING / 1.2]
    );
    const rotate = interpolate(
      scrollY.value,
      [index - 1, index, index + 1],
      [15, 0, -15]
    );
    const opacity = interpolate(
      scrollY.value,
      [index - 1, index, index + 1],
      [0.6, 1, 0.6]
    );
    const borderColor = interpolateColor(
      scrollY.value,
      [index - 1, index, index + 1],
      ["#222", "#fff", "#222"]
    );
    return {
      transform: [{ translateX }, { rotate: `${rotate}deg` }],
      borderColor,
      opacity,
      zIndex: 100 - index,
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.cardContent}>
        <Text style={styles.artistName}>{item.name}</Text>
        <Image
          source={item.image}
          style={styles.artistImage}
          resizeMode="cover"
        />
      </View>
    </Animated.View>
  );
};

// Vertical strip indicator component
const VerticalStripIndicator = ({
  itemCount,
  activeIndex,
}: {
  itemCount: number;
  activeIndex: number;
}) => {
  return (
    <View style={stripStyles.container} pointerEvents="none">
      {Array.from({ length: itemCount }).map((_, idx) => (
        <View
          key={idx}
          style={[
            stripStyles.line,
            idx === activeIndex && stripStyles.activeLine,
          ]}
        />
      ))}
    </View>
  );
};

const stripStyles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    zIndex: 1000,
  },
  line: {
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#444",
    marginVertical: 6,
    opacity: 0.5,
  },
  activeLine: {
    width: 22,
    backgroundColor: "#fff",
    opacity: 1,
  },
});

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    width: 320,
    backgroundColor: "#23262F",
    borderRadius: 24,
    alignSelf: "center",
    marginVertical: 0,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  artistName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginLeft: 18,
    backgroundColor: "#333",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 36,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#1ED760",
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: "center",
    width: 260,
    shadowColor: "#1ED760",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 18,
  },
});
