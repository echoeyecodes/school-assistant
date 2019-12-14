import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Modal, Portal, TouchableRipple } from "react-native-paper";
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons'
const CreateModal = ({visible=false, showCreateModal, showFolderCreateModal}) => {
  return (
    <Portal>
      <Modal dismissable onDismiss={() => showCreateModal()} visible={visible}>
        <View style={styles.container}>
          
          <TouchableRipple onPress={() => showFolderCreateModal()} rippleColor='rgba(0,0,0,0.5)'>
              <View style={styles.options}>
                <View style={styles.iconHolder}>
                    <MaterialIcons name='folder' color='rgba(0,0,0,0.5)' size={24} />
                </View>
                <View style={styles.optionTitleHolder}>
                    <Text style={styles.optionTitle}>
                        Create folder
                    </Text>
                </View>
              </View>
          </TouchableRipple>

          <TouchableRipple onPress={() => console.log('okay')} rippleColor='rgba(0,0,0,0.5)'>
              <View style={styles.options}>
                <View style={styles.iconHolder}>
                    <MaterialCommunityIcons name='file-document' color='rgba(0,0,0,0.5)' size={24} />
                </View>
                <View style={styles.optionTitleHolder}>
                    <Text style={styles.optionTitle}>
                        Add documents
                    </Text>
                </View>
              </View>
          </TouchableRipple>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
    borderRadius: 10,
    paddingVertical: 10
  },
  options:{
      width: '90%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 5,
      marginVertical: 5,
  },
  iconHolder:{
      width: 30,
      height: 30,
      justifyContent: 'center'
  },
  optionTitleHolder:{
      flex: 1,
  },
  optionTitle:{
      fontSize: 18
  }

});

export default CreateModal;
