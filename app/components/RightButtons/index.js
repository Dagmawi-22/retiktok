import React, { useRef } from "react";
import { TouchableOpacity, View, StyleSheet, Animated } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const IconContainer = ({ onHeartClick, liked }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity style={styles.button} onPress={onHeartClick}>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <AntDesign
            name={liked ? "heart" : "hearto"}
            size={32}
            color={liked ? "red" : "#fff"}
          />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="chatbubble-ellipses-outline" size={32} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="share-social" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    bottom: 100,
  },
  button: {
    marginBottom: 20,
    marginLeft: 10,
  },
});

export default IconContainer;
