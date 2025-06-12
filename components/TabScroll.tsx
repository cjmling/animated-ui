import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
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
  activeTabColor = "#000",
  inactiveTabColor = "#666",
  tabFontSize = 16,
  tabBarHeight = 50,
  indicatorColor = "#000",
  indicatorHeight = 2,
  selectedTabBackgroundColor = "#000",
}: TabScrollProps) {
  const translateX = useSharedValue(initialIndex * -SCREEN_WIDTH);
  const currentIndex = useSharedValue(initialIndex);
  const tabTranslateX = useSharedValue(
    initialIndex * (SCREEN_WIDTH / labels.length)
  );

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
        tabTranslateX.value = withSpring(
          newIndex * (SCREEN_WIDTH / labels.length),
          {
            damping: 20,
            stiffness: 150,
          }
        );
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

  const tabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabTranslateX.value }],
    };
  });

  const handleTabPress = (index: number) => {
    currentIndex.value = index;
    translateX.value = withSpring(index * -SCREEN_WIDTH, {
      damping: 20,
      stiffness: 150,
    });
    tabTranslateX.value = withSpring(index * (SCREEN_WIDTH / labels.length), {
      damping: 20,
      stiffness: 150,
    });
  };

  const Tabs = () => {
    return (
      <View style={[styles.tabBar, { height: tabBarHeight }]}>
        <Animated.View
          style={[
            styles.slidingBackground,
            {
              width: SCREEN_WIDTH / labels.length,
              height: tabBarHeight,
              backgroundColor: selectedTabBackgroundColor,
            },
            tabAnimatedStyle,
          ]}
        />
        {labels.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabButton, { width: SCREEN_WIDTH / labels.length }]}
            onPress={() => handleTabPress(index)}
          >
            <Animated.Text
              style={[
                styles.tabText,
                {
                  fontSize: tabFontSize,
                  color:
                    currentIndex.value === index
                      ? activeTabColor
                      : inactiveTabColor,
                },
              ]}
            >
              {label}
            </Animated.Text>
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

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    position: "relative",
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  tabText: {
    fontWeight: "500",
  },
  slidingBackground: {
    position: "absolute",
    borderRadius: 4,
  },
});
