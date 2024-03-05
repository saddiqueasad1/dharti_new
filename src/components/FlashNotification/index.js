import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "./styles";

const FlashNotification = ({ falshShow, flashMessage, containerStyle }) => {
  const [modalVisible, setModatVisible] = useState(falshShow);
  useEffect(() => {
    setModatVisible(falshShow);
  }, [falshShow]);
  return (
    <Modal
      animationType="fade"
      visible={modalVisible}
      statusBarTranslucent={false}
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={() => setModatVisible(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={[styles.container, containerStyle]}>
        <View style={styles.content}>
          <Text style={styles.flashNotificationText}>{flashMessage}</Text>
        </View>
      </View>
    </Modal>
  );
};


export default FlashNotification;
