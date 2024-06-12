import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  PanResponder,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { videos } from "../data/videos";

const VideoScreen = () => {
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const heartIcon = liked ? "heart" : "hearto";
  const heartColor = liked ? "red" : "#000";
  const scaleValue = new Animated.Value(1);
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [pan] = useState(new Animated.ValueXY());

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 50) {
          // Swiped downwards
          // Handle like action
          handleHeartClick();
        } else if (gestureState.dy < -50) {
          // Swiped upwards
          // Handle scroll to next video
          handleNextVideo();
        }
        // Reset pan position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handleHeartClick = () => {
    setLiked(!liked);
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.5,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleVideoPress = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setShowControls(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
      };
    }, [])
  );

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Video
        ref={videoRef}
        source={{ uri: videos[currentVideoIndex] }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay={isPlaying}
        isLooping
        style={styles.video}
        onTouchStart={() => setShowControls(true)}
      />
      {showControls && (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleVideoPress}
        >
          {isPlaying ? (
            <View style={styles.playButton}>
              <AntDesign name="pause" size={32} color="#000" />
            </View>
          ) : (
            <View style={styles.playButton}>
              <AntDesign name="play" size={32} color="#000" />
            </View>
          )}
        </TouchableOpacity>
      )}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.button} onPress={handleHeartClick}>
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <AntDesign name={heartIcon} size={32} color={heartColor} />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color="#fff" />
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
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 32,
    padding: 8,
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    bottom: 100,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  button: {
    marginBottom: 20,
  },
});

export default VideoScreen;
