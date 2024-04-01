// import React from "react";

// //  External Libraries
// import LottieView from "lottie-react-native";

// const UploadingIndicator = ({ onDone }) => {
//   return (
//     <LottieView
//       autoPlay
//       loop={true}
//       source={require("../assets/animations/uploading_plain.json")}
//       onAnimationFinish={onDone}
//     />
//   );
// };

// export default UploadingIndicator;


import React, { useState } from 'react';
import { View, Text, Modal, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

const UploadingIndicator = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    // Set uploading to true to show the indicator
    setUploading(true);

    // Simulating an upload process
    setTimeout(() => {
      // Once upload is done, set uploading to false
      setUploading(false);
      // Perform any necessary actions after upload completion
    }, 3000); // Adjust the timeout as needed
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleUpload} style={styles.button}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>

      {/* Modal to show the uploading indicator */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={uploading}
        onRequestClose={() => {}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={uploading} color="#FFFFFF" size="large" />
            <Text style={styles.uploadingText}>Uploading...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
  },
});

export default UploadingIndicator;

