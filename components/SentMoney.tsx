import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const AVATAR_SIZE = 64;
const AMOUNT = "$4.50";
const SWIPE_THRESHOLD = 200;
const AVATAR_TOP_POSITION = 80;
const SHOOT_UP_TO_BY_DISTANCE = 200;
const SHOOT_DURATION = 350;

export default function SentMoney() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  // Shared values for gesture and animation
  const dragY = useSharedValue(0);
  const dragX = useSharedValue(0);
  const dragProgress = useSharedValue(0);
  const shootUp = useSharedValue(false);
  const bumpScale = useSharedValue(1);

  const [showDone, setShowDone] = useState(false);

  // Amount animated style
  const amountStyle = useAnimatedStyle(() => {
    const x = dragX.value * 0.3;
    let y = dragY.value * 0.5;
    // Add rotation based on dragX, max ±15deg
    const maxRotation = 15; // degrees
    const rotate = (dragX.value / (SCREEN_WIDTH / 2)) * maxRotation;
    if (shootUp.value) {
      y = withTiming(-SHOOT_UP_TO_BY_DISTANCE, {
        duration: 350,
      });
    }
    return {
      transform: [
        { translateY: y },
        { translateX: x },
        { rotate: `${rotate}deg` },
        {
          scale: shootUp.value
            ? withTiming(0.3, { duration: SHOOT_DURATION })
            : 1 * dragProgress.value,
        },
      ],
      opacity: shootUp.value ? withTiming(0, { duration: SHOOT_DURATION }) : 1,
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
    opacity: shootUp.value ? withTiming(0, { duration: SHOOT_DURATION }) : 1,
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH,
  }));

  // Gradient backdrop animated style
  const gradientStyle = useAnimatedStyle(() => {
    return {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * dragProgress.value,
      borderRadius: SCREEN_WIDTH / 2,
      opacity: shootUp.value
        ? withTiming(0, { duration: SHOOT_DURATION })
        : 0.6,
      zIndex: 0,
    };
  });

  // Gesture
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (shootUp.value) return;
      dragY.value = e.translationY;
      dragX.value = e.translationX;

      // Update gradient size based on drag
      const newDragProgress = Math.max(0, e.translationY) / SWIPE_THRESHOLD;
      console.log(newDragProgress);
      dragProgress.value = newDragProgress;
    })
    .onEnd(() => {
      if (shootUp.value) return;
      if (dragY.value > SWIPE_THRESHOLD) {
        shootUp.value = true;
        dragY.value = withTiming(0, { duration: 200 });
        dragX.value = withTiming(0, { duration: 200 });

        // Trigger bump animation
        bumpScale.value = withDelay(
          SHOOT_DURATION / 1.5,
          withTiming(1.2, { duration: 200 }, () => {
            bumpScale.value = withTiming(1, { duration: 200 });
          })
        );
        runOnJS(setShowDone)(true);
      } else {
        dragY.value = withSpring(0);
        dragX.value = withSpring(0);
        dragProgress.value = withSpring(0);
      }
    });

  // Avatar animated style
  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bumpScale.value }],
  }));

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: theme.background,
      }}
    >
      {/* Gradient backdrop */}
      <Animated.View
        style={[
          {
            position: "absolute",
          },
          gradientStyle,
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(0, 255, 0, 0.8)",
            "rgba(0, 255, 0, 0.4)",
            "rgba(0, 255, 0, 0.1)",
            "transparent",
          ]}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 80,
        }}
      >
        <Animated.View
          style={[
            {
              width: 80,
              height: 80,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              backgroundColor: "#FFF",
              zIndex: 2,
            },
            avatarStyle,
          ]}
        >
          <MaterialCommunityIcons
            name="account"
            size={AVATAR_SIZE}
            color={theme.text}
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
            }}
          />
        </Animated.View>
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
      </Animated.View>

      <Animated.Text style={[amountStyle, { top: AVATAR_TOP_POSITION }]}>
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
      {showDone && (
        <Animated.View
          style={{ bottom: 100, position: "absolute", alignSelf: "center" }}
          entering={SlideInDown.duration(SHOOT_DURATION).delay(SHOOT_DURATION)}
        >
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: "#FFF",
              borderColor: "#000",
              borderWidth: 1,
              borderRadius: 20,
              paddingVertical: 10,
              paddingHorizontal: 32,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>
              DONE
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
