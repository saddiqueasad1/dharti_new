// import React from "react";

// // External Libraries
// import LottieView from "lottie-react-native";

// const ErrorIndicator = ({ visible = false, onDone }) => {
//   if (!visible) return null;
//   return (
//     <LottieView
//       autoPlay
//       loop={false}
//       source={require("../assets/animations/error.json")}
//       onAnimationFinish={onDone}
//     />
//   );
// };

// export default ErrorIndicator;


import React, { useState } from 'react';
import { View, Text, Modal, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

const ErrorIndicator = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const handleUpload = () => {
    // Set uploading to true to show the indicator
    setUploading(true);
    setError(false);

    // Simulating an upload process
    setTimeout(() => {
      // Generate a random number to simulate success or failure
      const random = Math.random();
      if (random < 0.8) {
        // If successful upload
        setUploading(false);
        // Perform any necessary actions after upload completion
      } else {
        // If upload fails
        setUploading(false);
        setError(true);
      }
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
        visible={uploading || error}
        onRequestClose={() => {}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            {uploading && (
              <>
                <ActivityIndicator animating={uploading} color="#FFFFFF" size="large" />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </>
            )}
            {error && (
              <>
                <Text style={styles.errorText}>Upload failed. Please try again.</Text>
                <TouchableOpacity onPress={() => setError(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
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
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ErrorIndicator;

