import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";

const { width, height } = Dimensions.get("window");
const AVATAR_SIZE = 64;
const AMOUNT = "$4.50";
const SWIPE_THRESHOLD = 120;

export default function SentMoney() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  // Shared values for gesture and animation
  const dragY = useSharedValue(0);
  const dragX = useSharedValue(0);
  const shootUp = useSharedValue(false);

  // Amount animated style
  const amountStyle = useAnimatedStyle(() => {
    // X wiggle: a fraction of dragX, but not 1:1
    const x = dragX.value * 0.3;
    // Y follows dragY, but less sensitive
    let y = dragY.value * 0.5;
    // If shootUp, animate off screen
    if (shootUp.value) {
      y = withTiming(-height * 0.5, { duration: 350 });
    }
    return {
      transform: [{ translateY: y }, { translateX: x }],
      opacity: shootUp.value ? withTiming(0, { duration: 350 }) : 1,
    };
  });

  // SWIPE DOWN text animated style
  const swipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }, { translateX: dragX.value }],
    opacity: shootUp.value ? withTiming(0, { duration: 200 }) : 1,
  }));

  // Gesture
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (shootUp.value) return;
      dragY.value = Math.max(0, e.translationY);
      dragX.value = e.translationX;
    })
    .onEnd(() => {
      if (shootUp.value) return;
      if (dragY.value > SWIPE_THRESHOLD) {
        shootUp.value = true;
        dragY.value = withTiming(0, { duration: 200 });
        dragX.value = withTiming(0, { duration: 200 });
      } else {
        dragY.value = withSpring(0);
        dragX.value = withSpring(0);
      }
    });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/images/coffee/coffee1.png")}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: theme.text }]}>Dave</Text>
      </View>
      <Animated.Text
        style={[styles.amount, { color: theme.text }, amountStyle]}
      >
        {AMOUNT}
      </Animated.Text>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.swipeContainer, swipeStyle]}>
          <Text style={[styles.swipeText, { color: theme.text }]}>
            SWIPE DOWN
          </Text>
        </Animated.View>
      </GestureDetector>
      <View style={{ height: 60 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  amount: {
    fontSize: 48,
    fontWeight: "bold",
    letterSpacing: 2,
    textAlign: "center",
  },
  swipeContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: width,
    backgroundColor: "red",
    height: 600,
    flex: 1,
  },
  swipeText: {
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: 4,
    opacity: 0.7,
  },
});
