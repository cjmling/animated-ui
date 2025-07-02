import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
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
    const x = dragX.value * 0.3;
    let y = dragY.value * 0.5;
    // Add rotation based on dragX, max ±15deg
    const maxRotation = 15; // degrees
    const rotate = (dragX.value / (width / 2)) * maxRotation;
    if (shootUp.value) {
      y = withTiming(-height * 0.5, { duration: 350 });
    }
    return {
      transform: [
        { translateY: y },
        { translateX: x },
        { rotate: `${rotate}deg` },
      ],
      opacity: shootUp.value ? withTiming(0, { duration: 350 }) : 1,
      fontSize: 48,
      fontWeight: "bold",
      letterSpacing: 2,
      textAlign: "center",
      color: theme.text,
    };
  });

  // SWIPE DOWN text animated style
  const swipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }, { translateX: dragX.value }],
    opacity: shootUp.value ? withTiming(0, { duration: 200 }) : 1,
    alignItems: "center",
    justifyContent: "center",
    width: width,
  }));

  // Gesture
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (shootUp.value) return;
      dragY.value = e.translationY;
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
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 80,
        backgroundColor: theme.background,
      }}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          source={require("../assets/images/coffee/coffee1.png")}
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
            marginBottom: 8,
            borderWidth: 2,
            borderColor: "#fff",
          }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginTop: 2,
            color: theme.text,
          }}
        >
          Dave
        </Text>
      </View>
      <Animated.Text style={[amountStyle, { marginTop: 100 }]}>
        {AMOUNT}
      </Animated.Text>
      <GestureDetector gesture={gesture}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View style={[swipeStyle, { gap: 10 }]}>
            <View
              style={{
                backgroundColor: theme.text,
                width: 80,
                height: 80,
                borderRadius: 40,
              }}
            ></View>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "500",
                letterSpacing: 4,
                opacity: 0.7,
                color: theme.text,
              }}
            >
              SWIPE DOWN
            </Text>
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}
