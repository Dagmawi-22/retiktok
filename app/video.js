import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as VideoThumbnails from "expo-video-thumbnails";
import { videos } from "../data/videos";

const screenHeight = Dimensions.get("window").height;

const VideoScreen = () => {
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [thumbnail, setThumbnail] = useState(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 50) {
          handlePreviousVideo();
        } else if (gestureState.dy < -50) {
          handleNextVideo();
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  const generateThumbnail = async (videoUri) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 15000,
      });
      setThumbnail(uri);
    } catch (e) {
      console.warn(e);
    }
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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loadAsync(
        { uri: videos[currentVideoIndex].uri },
        { shouldPlay: true },
        false
      );
    }
    if (videos[currentVideoIndex].isLandscape) {
      generateThumbnail(videos[currentVideoIndex].uri);
    } else {
      setThumbnail(null);
    }
  }, [currentVideoIndex]);

  const handleHeartClick = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View
        style={
          videos[currentVideoIndex].isLandscape
            ? styles.landscapeWrapper
            : styles.fullScreen
        }
      >
        <Video
          ref={videoRef}
          source={{ uri: videos[currentVideoIndex].uri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={true}
          isLooping
          style={
            videos[currentVideoIndex].isLandscape
              ? styles.landscapeVideo
              : styles.video
          }
        />
      </View>
      {thumbnail && (
        <View style={styles.thumbnailWrapper}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
          <View style={styles.thumbnailOverlay}>
            <Video
              source={{ uri: videos[currentVideoIndex].uri }}
              rate={1.0}
              volume={1.0}
              isMuted={true}
              resizeMode="cover"
              shouldPlay={true}
              isLooping
              style={styles.overlayVideo}
            />
          </View>
        </View>
      )}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.button} onPress={handleHeartClick}>
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <AntDesign name="hearto" size={32} color="#fff" />
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
  fullScreen: {
    width: "100%",
    height: "100%",
  },
  landscapeWrapper: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  landscapeVideo: {
    width: "100%",
    height: "50%",
  },
  thumbnailWrapper: {
    position: "absolute",
    top: "0%",
    width: "100%",
    height: "100%",
  },
  thumbnail: {
    width: "100%",
    opacity: 0.5,
    height: screenHeight,
  },
  thumbnailOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayVideo: {
    width: "100%",
    height: "50%",
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
