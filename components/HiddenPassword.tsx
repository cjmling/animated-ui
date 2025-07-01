import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const BOX_HEIGHT = 64;
const BOX_RADIUS = 20;
const ANIMATION_DURATION = 2000;
const MIN_SIZE = 20;
const MAX_WIDTH = 450;
const MAX_HEIGHT = BOX_HEIGHT + 10;
const RIGHT_START_POSITION = 25;

export const HiddenPassword = () => {
  const [expanded, setExpanded] = useState(false);
  const password = "u8F2x34ij";
  const expandedProgress = useSharedValue(0);

  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    expandedProgress.value = withTiming(newExpanded ? 100 : 0, {
      duration: ANIMATION_DURATION,
    });
  };

  const animatedBgStyle = useAnimatedStyle(() => {
    const width =
      MIN_SIZE + (MAX_WIDTH - MIN_SIZE) * (expandedProgress.value / 100);

    const height =
      MIN_SIZE + (MAX_HEIGHT - MIN_SIZE) * (expandedProgress.value / 100);

    const translateX = RIGHT_START_POSITION * (expandedProgress.value / 100);
    const translateY = (-height / 2.3) * (expandedProgress.value / 100);
    return {
      width: width,
      height: height,
      backgroundColor: "#fff",
      borderRadius: BOX_RADIUS,
      position: "absolute",
      right: RIGHT_START_POSITION,
      top: BOX_HEIGHT / 2 - MIN_SIZE / 2,
      transform: [{ translateX: translateX }, { translateY: translateY }],
      zIndex: 1,
    };
  });

  return (
    <View
      style={{
        height: BOX_HEIGHT,
        borderRadius: BOX_RADIUS,
        backgroundColor: "#181C27",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        position: "relative",
        overflow: "hidden",
        margin: 16,
      }}
    >
      <Animated.View style={[animatedBgStyle]} />
      <View style={{ zIndex: 2, marginRight: 16 }}>
        <Ionicons
          name={expanded ? "lock-open" : "lock-closed"}
          size={28}
          color={expanded ? "#000" : "#fff"}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          zIndex: 2,
          justifyContent: "flex-start",
          alignItems: "center",
          minHeight: 24,
        }}
      >
        <Text
          style={{
            color: expanded ? "#000" : "#fff",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {expanded ? password : "************"}
        </Text>
      </View>
      <TouchableOpacity
        style={{ zIndex: 2, marginLeft: 16 }}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name={expanded ? "eye" : "eye-off"}
            size={28}
            color={expanded ? "#000" : "#000"}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
