import { Dimensions, StyleSheet } from "react-native";

const screenHeight = Dimensions.get("window").height;

export const styles = StyleSheet.create({
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
