import { useDrawerProgress } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "react-native";

import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import ScreenWrapper from "../screenWrapper";
import AppColors from "../../utills/AppColors";

const DrawerSceneWrapper = ({ children }) => {
  const progress = useDrawerProgress();
  const [change, setChange] = useState(progress.value);
  const { width } = useWindowDimensions();
  useEffect(() => {
    setChange(progress.value);
  }, [progress]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      {
        scale: interpolate(progress.value, [0, 1], [1, 0.8], "clamp"),
      },
      {
        rotateY: `${interpolate(progress.value, [0, 1], [0, -10], "clamp")}deg`,
      },
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, Platform.OS === "android" ? width - 130 : -60],
          "clamp"
        ),
      },
    ],
    borderRadius: interpolate(progress.value, [0, 1], [0, 70], "clamp"),
    overflow: "hidden",
  }));

  return (
    <SafeAreaView style={[styles.maincontainer]} translucent={false}>
      {/* <Animated.View style={[styles.container, animatedStyle]}> */}
      {children}
      {/* </Animated.View> */}
    </SafeAreaView>
  );
};

export default DrawerSceneWrapper;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  container: {
    flex: 1,
  },
});
