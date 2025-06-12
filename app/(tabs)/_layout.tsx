import React from "react";

import { Stack } from "expo-router";
import HomeScreen from ".";

export default function TabLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, title: "Home" }} />
      <HomeScreen />
    </>
  );
}
