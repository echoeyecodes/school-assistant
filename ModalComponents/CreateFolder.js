import React, {useState} from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback} from "react-native";
import { Modal, Portal, TextInput } from "react-native-paper";
const CreateFolder = ({visible=false, disableCreateFolderModal, addFolder}) => {
    const [title, setTitle] = useState(null)
  return (
    <Portal>
      <Modal dismissable onDismiss={() => disableCreateFolderModal()} visible={visible}>
      <KeyboardAvoidingView style={styles.container} enabled behavior='padding'>
        <View style={styles.content}>
            <View style={styles.textInputHolder}>
                <TextInput value={title} onChangeText={(value) => setTitle(value)} theme={{colors:{primary: '#4c8bf5'}}} selectionColor='black' mode='flat' label='Folder name' style={styles.textInput} />
            </View>

            <TouchableWithoutFeedback onPress={() => {
                if(title !== null){
                addFolder(title)
                setTitle(null)
                }
            }}>
            <View style={styles.doneBtn}>
                <Text style={styles.doneText}>Done</Text>
            </View>
            </TouchableWithoutFeedback>
        </View>
        </KeyboardAvoidingView>
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
    paddingVertical: 10,
    minHeight: 200
  },
  content:{
    width: '90%'
  },
  textInputHolder:{
    marginVertical: 5
  },
  textInput:{
      backgroundColor: 'transparent'
  },
  doneBtn:{
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4c8bf5',
      marginVertical: 10
  },
  doneText:{
    color: '#fff',
    marginVertical: 10
  }
});

export default CreateFolder;
