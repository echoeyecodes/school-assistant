import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Portal, Modal } from "react-native-paper";
const ImageViewer = ({ visible, data, enableShowImage }) => {

  return (
    <Portal>
      <Modal visible={visible} dismissable onDismiss={() => enableShowImage()}>
        <View style={styles.imageViewHolder}>
            <Image style={styles.image} source={{uri: data}} resizeMode='contain' />
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
    imageViewHolder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'white'
  },
  image:{
      width: '100%',
      minHeight: 500
  }
});

export default ImageViewer;
