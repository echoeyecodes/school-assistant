import React from "react";
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from "react-native";
import { Portal, Modal, ActivityIndicator } from "react-native-paper";
const FailedModal = ({visible=false, message, closeFailModal}) => {
  return (
    <Portal>
      <Modal dismissable visible={visible} onDismiss={() => closeFailModal()}>
        <View style={styles.container}>

            <View>
                <Image style={styles.image} source={require('../assets/failed.png')} />
                <Text style={styles.message}>{message}</Text>
            </View>
          
          <TouchableWithoutFeedback onPress={() => closeFailModal()}>
            <View style={styles.doneBtn}>
                <Text style={styles.doneBtnText}>OKAY</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </Portal>
  );
};

const SuccessModal = ({visible=false, message, closeSuccessModal}) => {
    return (
      <Portal>
        <Modal dismissable visible={visible} onDismiss={() =>closeSuccessModal()}>
          <View style={styles.container}>
              <View>
                  <Image style={styles.image} source={require('../assets/success.png')} />
                  <Text style={styles.message}>{message}</Text>
              </View>
            
            <TouchableWithoutFeedback onPress={() => closeSuccessModal()}>
              <View style={styles.doneBtn}>
                  <Text style={styles.doneBtnText}>OKAY</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </Portal>
    );
  };

  
const CustomActivityIndicator = ({visible=false}) => {
  return (
    <Portal>
      <Modal dismissable={false} visible={visible}>
        <View style={styles.container}>
            <ActivityIndicator color='#4c8bf5' size='large' />
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    borderRadius: 10
  },
  image:{
    width: 150,
    height: 150
  },
  message:{
    fontFamily: 'normal-default',
    fontSize: 18,
    textAlign: 'center'
  },
  doneBtn:{
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4c8bf5',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10
},
doneBtnText:{
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
}
});

export {SuccessModal, FailedModal, CustomActivityIndicator}

