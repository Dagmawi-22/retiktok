import React, { useState, useRef, useEffect } from "react";
import {
  View,
  PanResponder,
  Animated,
  Image,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as VideoThumbnails from "expo-video-thumbnails";
import { videos } from "../data/videos";
import { styles } from "../styles/style";

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
        <TouchableOpacity style={styles.button}>
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

export default VideoScreen;
