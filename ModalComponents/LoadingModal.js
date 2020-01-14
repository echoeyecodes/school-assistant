import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Modal, Portal, ActivityIndicator } from "react-native-paper";

const LoadingModal = ({ visible }) => {
  return (
    <Portal>
      <Modal dismissable={false} visible={visible}>
        <View style={styles.container}>
          <ActivityIndicator size='large' color='#4c8bf5' />
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    borderRadius: 5,
    marginHorizontal: 10
  }
});

export default LoadingModal;
