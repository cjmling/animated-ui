import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const coffeeData = [
  {
    key: "1",
    name: "Double Chocolate Chip Frappuccino",
    price: 11,
    volume: "345ml",
    image: require("../assets/images/coffee/coffee1.png"),
    description:
      "Rich mocha-flavored sauce meets up with chocolaty chips, milk and ice. Top it off with whipped vanilla topping and mocha drizzle for a real party in your mouth. A coffee Free Delight.",
  },
  {
    key: "2",
    name: "Caramel Macchiato",
    price: 10,
    volume: "300ml",
    image: require("../assets/images/coffee/coffee2.png"),
    description:
      "Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with caramel drizzle for an oh-so-sweet finish.",
  },
  {
    key: "3",
    name: "Classic Cappuccino",
    price: 9,
    volume: "250ml",
    image: require("../assets/images/coffee/coffee3.png"),
    description:
      "Dark, rich espresso lies in wait under a smoothed and stretched layer of thick milk foam. An alchemy of barista artistry and craft.",
  },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const CAROUSEL_ITEM_SIZE = 260;
const CAROUSEL_SPACING = 5;
const CAROUSEL_TOTAL_WIDTH = CAROUSEL_ITEM_SIZE + CAROUSEL_SPACING;

export default function CoffeeSelect() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollIndex = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollIndex.value = event.contentOffset.x / CAROUSEL_TOTAL_WIDTH;
      const newActiveIndex = Math.round(scrollIndex.value);
      if (
        newActiveIndex >= 0 &&
        newActiveIndex < coffeeData.length &&
        newActiveIndex !== activeIndex
      ) {
        runOnJS(setActiveIndex)(newActiveIndex);
      }
    },
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "green",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 20,
      }}
    >
      {/* Starbucks logo */}
      <View style={{ alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 44, fontWeight: "bold", color: "#fff" }}>
          Starbucks
        </Text>
      </View>
      {/* Carousel */}
      <View style={{ zIndex: 2 }}>
        <Animated.FlatList
          data={coffeeData}
          renderItem={({ item, index }) => (
            <CarouselItem item={item} scrollIndex={scrollIndex} index={index} />
          )}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingHorizontal: (SCREEN_WIDTH - CAROUSEL_ITEM_SIZE) / 2,
            gap: CAROUSEL_SPACING,
          }}
          snapToInterval={CAROUSEL_TOTAL_WIDTH}
          decelerationRate="fast"
          style={{ flexGrow: 1 }}
        />
      </View>
      {/* Details Card */}
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        style={{
          backgroundColor: "#fff",
          borderRadius: 32,
          padding: 24,
          paddingTop: 60,
          justifyContent: "flex-end",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          width: SCREEN_WIDTH - 48,
          minHeight: 350,
          position: "absolute",
          bottom: 40,
          left: 24,
          gap: 10,
          zIndex: 1,
        }}
        key={`activeIndex-${activeIndex}`}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1db954" }}>
            ${coffeeData[activeIndex].price}
          </Text>
          <Text style={{ fontSize: 16, color: "#888", marginLeft: 8 }}>
            {coffeeData[activeIndex].volume}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 8,
            marginBottom: 8,
            color: "#222",
          }}
        >
          {coffeeData[activeIndex].name}
        </Text>
        <Text style={{ fontSize: 15, color: "#444", marginBottom: 18 }}>
          {coffeeData[activeIndex].description}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#222",
            borderRadius: 16,
            paddingVertical: 12,
            paddingHorizontal: 32,
            alignSelf: "stretch",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            Get it
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function CarouselItem({
  item,
  scrollIndex,
  index,
}: {
  item: (typeof coffeeData)[0];
  scrollIndex: SharedValue<number>;
  index: number;
}) {
  const viewAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollIndex.value,
            [index - 1, index, index + 1],
            [0, 40, 0]
          ),
        },
        {
          scale: interpolate(
            scrollIndex.value,
            [index - 1, index, index + 1],
            [0.85, 1.2, 0.85]
          ),
        },
      ],
      width: CAROUSEL_ITEM_SIZE,
      height: CAROUSEL_ITEM_SIZE,
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: CAROUSEL_ITEM_SIZE,
      height: CAROUSEL_ITEM_SIZE * 1.2,
      blurRadius: interpolate(
        scrollIndex.value,
        [index - 1, index, index + 1],
        [10, 0, 10]
      ),
    };
  });

  return (
    <Animated.View style={viewAnimatedStyle}>
      <Animated.Image
        source={item.image}
        resizeMode="contain"
        style={[imageAnimatedStyle]}
      />
    </Animated.View>
  );
}
