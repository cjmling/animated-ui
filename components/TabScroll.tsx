import React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface TabScrollProps {
  /** Array of screen components to be displayed in the tab */
  screens: React.ReactNode[];
  /** Array of labels for each tab */
  labels: string[];
  /** Initial index of the screen to show (defaults to 0) */
  initialIndex?: number;
  /** Background color of the tab container (defaults to "#000") */
  backgroundColor?: string;
  /** Color of the active tab text (defaults to "#000") */
  activeTabColor?: string;
  /** Color of the inactive tab text (defaults to "#666") */
  inactiveTabColor?: string;
  /** Font size of the tab text (defaults to 16) */
  tabFontSize?: number;
  /** Height of the tab bar in pixels (defaults to 50) */
  tabBarHeight?: number;
  /** Color of the tab indicator line (defaults to "#000") */
  indicatorColor?: string;
  /** Height of the tab indicator line in pixels (defaults to 2) */
  indicatorHeight?: number;
  /** Background color for the selected tab (defaults to "#000") */
  selectedTabBackgroundColor?: string;
}

export default function TabScroll({
  screens,
  labels,
  initialIndex = 0,
  backgroundColor = "#000",
  activeTabColor = "#FFF",
  inactiveTabColor = "#000",
  tabFontSize = 16,
  tabBarHeight = 50,
  indicatorColor = "#000",
  indicatorHeight = 50,
}: TabScrollProps) {
  const translateX = useSharedValue(initialIndex * -SCREEN_WIDTH);
  const currentIndex = useSharedValue(initialIndex);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value =
        event.translationX + currentIndex.value * -SCREEN_WIDTH;
    })
    .onEnd((event) => {
      const shouldSwipe = Math.abs(event.velocityX) > 500;
      const shouldSnap = Math.abs(event.translationX) > SCREEN_WIDTH * 0.3;

      if (shouldSwipe || shouldSnap) {
        const direction = event.translationX > 0 ? -1 : 1;
        const newIndex = Math.max(
          0,
          Math.min(screens.length - 1, currentIndex.value + direction)
        );
        currentIndex.value = newIndex;
        translateX.value = withSpring(newIndex * -SCREEN_WIDTH, {
          damping: 20,
          stiffness: 150,
        });
        console.log("newIndex", newIndex, currentIndex.value);
      } else {
        translateX.value = withSpring(currentIndex.value * -SCREEN_WIDTH, {
          damping: 20,
          stiffness: 150,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleTabPress = (index: number) => {
    currentIndex.value = index;
    translateX.value = withSpring(index * -SCREEN_WIDTH, {
      damping: 20,
      stiffness: 150,
    });
  };

  const TabLabel = ({ label, index }: { label: string; index: number }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      color: currentIndex.value === index ? activeTabColor : inactiveTabColor,
    }));

    return (
      <Animated.Text
        style={[
          {
            fontWeight: "500",
            fontSize: tabFontSize,
          },
          animatedStyle,
        ]}
      >
        {label}
      </Animated.Text>
    );
  };

  const Tabs = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          position: "relative",
          height: tabBarHeight,
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              borderRadius: 0,
              bottom: 0,
              width: SCREEN_WIDTH / labels.length,
              height: indicatorHeight,
              backgroundColor: indicatorColor,
            },
            useAnimatedStyle(() => {
              const progress = -translateX.value / SCREEN_WIDTH;
              const interpolatedX = interpolate(
                progress,
                [0, screens.length - 1],
                [0, (SCREEN_WIDTH / labels.length) * (screens.length - 1)],
                Extrapolation.CLAMP
              );
              return {
                transform: [{ translateX: interpolatedX }],
              };
            }),
          ]}
        />
        {labels.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={{
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
              width: SCREEN_WIDTH / labels.length,
            }}
            onPress={() => handleTabPress(index)}
          >
            <TabLabel label={label} index={index} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
      <Tabs />

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              flex: 1,
              flexDirection: "row",
              width: SCREEN_WIDTH * screens.length,
            },
            animatedStyle,
          ]}
        >
          {screens.map((screen, index) => (
            <View
              key={index}
              style={{
                width: SCREEN_WIDTH,
                height: "100%",
              }}
            >
              {screen}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
