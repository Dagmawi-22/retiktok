import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
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
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;
  const windowHeight = Dimensions.get("window").height;

  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== currentVideoIndex) {
        Animated.parallel([
          Animated.timing(opacityValue, {
            toValue: 0.5,
            duration: 20,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 0.9,
            duration: 20,
            useNativeDriver: true,
          }),
          Animated.timing(translateYValue, {
            toValue: 50,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setCurrentVideoIndex(index);
          Animated.parallel([
            Animated.timing(opacityValue, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(translateYValue, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
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

  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded && status.videoWidth && status.videoHeight) {
      setVideoDimensions({
        width: status.videoWidth,
        height: status.videoHeight,
      });
    } else {
      console.log("video status is", status);
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
      videoRef.current
        .loadAsync(
          { uri: videos[currentVideoIndex].uri },
          { shouldPlay: true },
          false
        )
        .then(() => {
          if (videos[currentVideoIndex].isLandscape) {
            generateThumbnail(videos[currentVideoIndex].uri);
          } else {
            setThumbnail(null);
          }
        });
    }
  }, [currentVideoIndex]);

  const renderItem = ({ item }) => (
    <Animated.View
      style={[
        item.isLandscape ? styles.landscapeWrapper : styles.fullScreen,
        { height: windowHeight, opacity: opacityValue },
      ]}
    >
      <Video
        ref={videoRef}
        source={{ uri: item.uri }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay={true}
        isLooping
        style={item.isLandscape ? styles.landscapeVideo : styles.video}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      {item.isLandscape && thumbnail && (
        <View style={styles.thumbnailWrapper}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
          <View style={styles.thumbnailOverlay}>
            <Video
              source={{ uri: item.uri }}
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
    </Animated.View>
  );

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      pagingEnabled
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      horizontal={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default VideoScreen;
