// App.js
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { Slot } from "expo-router";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
};

export default registerRootComponent(App);
