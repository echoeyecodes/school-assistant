import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback
} from "react-native";
import { Appbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import DatePicker from "react-native-datepicker";
import {
  SuccessModal,
  FailedModal,
  CustomActivityIndicator
} from "../ModalComponents/SuccessFailModal";
import {ThemeContext, themes} from '../context/ThemeContext'
const TopBar = ({ title, ...props }) => {
  const {theme} = useContext(ThemeContext)
  return (
    <Appbar.Header style={{ backgroundColor: theme.backgroundColor, elevation: 0 }}>
      <View style={styles.appBarContainer}>
        <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
          <View style={styles.backBtn}>
            <Ionicons name="ios-arrow-back" color={theme.colorPrimary} size={28} />
          </View>
        </TouchableWithoutFeedback>
        <Text style={[styles.greetings, {color: theme.colorPrimary}]}>{title}</Text>
      </View>
    </Appbar.Header>
  );
};

const CreateAssignment = props => {
  const {theme} = useContext(ThemeContext)
  const [deadline, setDeadline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [successModal, showSuccessModal] = useState({
    visible: false,
    msg: null
  });
  const [failModal, showFailModal] = useState({
    visible: false,
    msg: null
  });
  const [courseCode, setCourseCode] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [disableBtn, setDisableBtn] = useState(true)

  const goBack = () => {
    showSuccessModal({
      visible: false,
      msg: null
    });
    showFailModal({
      visible: false,
      msg: null
    });
    props.navigation.goBack();
  };

  const validateData = () =>{
    if(content === '' || courseCode === '' || date === '' || time === ''){
      setDisableBtn(true)
      return
    }
    setDisableBtn(false)
  }

  const sendData = () => {
    setLoading(true);
    let obj = {
      courseCode,
      content,
      date,
      time
    };
    fetch("http://192.168.43.31:3000/assignment", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }).then(data =>
      data.json().then(response => {
        setLoading(false);
        if (response.status === 200) {
          showSuccessModal({
            visible: true,
            msg: response.msg
          });
        } else {
          showFailModal({
            visible: true,
            msg: response.msg
          });
        }
      })
    );
  };

  useEffect(() => {
    setEditMode(props.navigation.getParam("read", false));
    setCourseCode(props.navigation.getParam("courseCode", null));
    setContent(props.navigation.getParam("desc", null));
  }, []);

  useEffect(() =>{
    validateData()
  }, [courseCode, content, date, time])
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <SuccessModal
        closeSuccessModal={goBack}
        visible={successModal.visible}
        message={successModal.msg}
      />
      <FailedModal
        closeFailModal={goBack}
        visible={failModal.visible}
        message={failModal.msg}
      />
      <CustomActivityIndicator visible={loading} />
      <TopBar
        title={editMode ? "View Assignment" : "Create Assignment"}
        {...props}
      />
      <View style={styles.textInputHolder}>
        <TextInput
          selectionColor="black"
          value={courseCode}
          editable={editMode ? false : true}
          placeholder="Enter Course Code"
          onChangeText={value => setCourseCode(value)}
          style={[styles.titleTextInput, {color: theme.colorPrimary}]}
        />
        <TextInput
          selectionColor="black"
          placeholder="Content..."
          value={content}
          multiline
          editable={editMode ? false : true}
          autoCapitalize="sentences"
          onChangeText={value => setContent(value)}
          style={[styles.descriptionTextInput, {color: theme.colorPrimary}]}
        />
      </View>

      {editMode || (
      <View style={styles.dateTimePickerHolder}>
        <DatePicker
          style={{ width: "100%" }}
          date={deadline}
          mode="datetime"
          onDateChange={date => {
            setDeadline(date);
            const dateAndTime = date.split(" ");
            const extDate = dateAndTime[0];
            const extTime = dateAndTime[1];
            setDate(extDate);
            setTime(extTime);
          }}
        />
      </View>
      )}

      {editMode || (
          <TouchableWithoutFeedback onPress={() => {
            if(!disableBtn){
              sendData()
            }
          }}>
            <View style={[styles.doneBtn, { backgroundColor: disableBtn ? "rgba(76, 139, 245,0.5)" : "rgba(76, 139, 245,1)" }]}>
              <Text style={styles.doneBtnText}>DONE</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputHolder: {
    padding: 10,
    marginVertical: 10
  },
  titleTextInput: {
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 10
  },
  descriptionTextInput: {
    fontSize: 18,
    width: "100%",
    paddingHorizontal: 10,
    minHeight: 250,
    textAlignVertical: "top"
  },
  dateTimePickerHolder: {
    marginHorizontal: 10
  },
  appBarContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    alignItems: "center",
    flexDirection: "row"
  },
  backBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  greetings: {
    fontSize: 22,
    marginHorizontal: 10,
    fontFamily: "atlas"
  },
  doneBtn: {
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10
  },
  doneBtnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default CreateAssignment;
