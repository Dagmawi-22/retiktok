import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const VideoScreen = () => {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={styles.video}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="heart" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="chatbubble" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="share-social" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    position: "absolute",
    right: 10,
    bottom: 100,
    justifyContent: "space-between",
    height: 200,
  },
  button: {
    marginBottom: 20,
  },
});

export default VideoScreen;
