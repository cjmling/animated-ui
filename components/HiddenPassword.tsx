import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../constants/Colors";

const BOX_HEIGHT = 64;
const BOX_RADIUS = 20;
const ANIMATION_DURATION = 200;
const MIN_SIZE = 20;
const MAX_SIZE = 450;
const RIGHT_START_POSITION = 25;

export const HiddenPassword = () => {
  const [expanded, setExpanded] = useState(false);
  const [password, setPassword] = useState("");
  const expandedProgress = useSharedValue(0);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
    expandedProgress.value = withTiming(expanded ? 100 : 0, {
      duration: ANIMATION_DURATION,
    });
  };

  const animatedBgStyle = useAnimatedStyle(() => {
    const size =
      MIN_SIZE + (MAX_SIZE - MIN_SIZE) * (expandedProgress.value / 100);
    const translateX = RIGHT_START_POSITION * (expandedProgress.value / 100);
    const translateY = -BOX_HEIGHT * 2 * (expandedProgress.value / 100);
    return {
      width: size,
      height: size,
      backgroundColor: "#fff",
      borderRadius: BOX_RADIUS,
      position: "absolute",
      right: RIGHT_START_POSITION,
      top: BOX_HEIGHT / 4,
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
        <Ionicons name="lock-closed" size={28} color="#fff" />
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
        {Array(Math.max(password.length, 8))
          .fill(0)
          .map((_, i) => (
            <View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#7B7BFF",
                marginHorizontal: 4,
                opacity: i < password.length ? 1 : 0.3,
              }}
            />
          ))}
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
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons
            name={expanded ? "eye" : "eye-off"}
            size={28}
            color={expanded ? Colors.light.text : Colors.light.icon}
          />
        </View>
      </TouchableOpacity>
      {/* Hidden input for password entry */}
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!expanded}
        style={{
          position: "absolute",
          opacity: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          left: 0,
          top: 0,
          color: "#fff",
        }}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
        placeholder="Password"
        placeholderTextColor="#aaa"
      />
    </View>
  );
};
