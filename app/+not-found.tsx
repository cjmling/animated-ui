import { Stack } from "expo-router";
import React from "react";
import { Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Text>Not Found</Text>
    </>
  );
}
