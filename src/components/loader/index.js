import React, { useState, useEffect } from "react";
import { Animated, Text, View, Image } from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { selectLoader } from "../../redux/slices/config";
import AppColors from "../../utills/AppColors";
import styles from "./styles";
import { height, width } from "../../utills/Dimension";
import Icons from "../../asset/images";

export default function Loader() {
  const appLoader = useSelector(selectLoader);
  const [rotation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (appLoader) {
      startAnimation();
    } else {
      rotation.setValue(0);
    }
  }, [appLoader]);

  const startAnimation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 600, // Adjust duration as needed
        useNativeDriver: true
      })
    ).start();
  };

  const interpolatedRotateAnimation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <Modal
      isVisible={appLoader}
      backdropOpacity={0.6}
      backdropColor={AppColors.white}
    >
      <View style={styles.container}>
        <Animated.View
          style={{
            transform: [{ rotate: interpolatedRotateAnimation }]
          }}
        >
          <Image
            style={{
              width: height(6),
              height: height(6),
              borderRadius: width(50),
              resizeMode: 'cover'
            }}
            source={Icons.iconLogo}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}
