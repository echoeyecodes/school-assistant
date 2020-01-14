import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Picker,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  AsyncStorage
} from "react-native";
import {Switch, Appbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import DatePicker from "react-native-datepicker";
const CustomTextInput = ({
  courseType,
  placeholder,
  mode,
  handleTextInputChange
}) => {
  return (
    <TextInput
      label={courseType}
      placeholder={placeholder}
      selectionColor="#4c8bf5"
      style={styles.textInput}
      onChangeText={value => {
        let obj = {};
        obj[mode] = value;
        handleTextInputChange(obj);
      }}
    />
  );
};

const TopBar = ({ title, ...props }) => {
  return (
    <Appbar.Header style={{ backgroundColor: "white", elevation: 0 }}>
      <View style={styles.appBarContainer}>
        <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
          <Ionicons name="ios-arrow-back" color="black" size={24} />
        </TouchableWithoutFeedback>
        <Text style={styles.greetings}>{title}</Text>
      </View>
    </Appbar.Header>
  );
};

const CreateClass = props => {
  const [courseData, setCourseData] = useState({
    courseCode: '',
    courseTitle: '',
    lecturer: '',
    startTime: "08:00",
    endTime: "10:00",
    location: '',
    dayOfTheWeek: 'Monday',
    fixedClass: false,
    startTimeSeconds: 28800,
    endTimeSeconds: 36000
  });
  const [disableBtn, setDisableBtn] = useState(true)

  const handleTextInputChange = obj => {
    setCourseData({ ...courseData, ...obj });
  };

  const validateData = () =>{
    const {courseCode, courseTitle, lecturer, location} = courseData
    if(courseCode === '' || courseTitle === '' || lecturer ==='' || location ==''){
      setDisableBtn(true)
      return
    }
    setDisableBtn(false)
  }

  useEffect(() =>{
    validateData()
  }, [courseData])

  const sendData = async () => {
    const data = await AsyncStorage.getItem("assistant-user-data");
    const { token } = JSON.parse(data);
    fetch("http://192.168.43.31:3000/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      }
    }).then(data =>
      data.json().then(courses => {
        props.navigation.goBack();
      })
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
      <TopBar title="Add Class" {...props} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <CustomTextInput
            courseType="Course Code"
            placeholder="e.g FEG 401"
            mode="courseCode"
            value={courseData.courseCode}
            handleTextInputChange={handleTextInputChange}
          />
          <CustomTextInput
            courseType="Course Title"
            placeholder="e.g Engineering Mathematics"
            mode="courseTitle"
            value={courseData.courseTitle}
            handleTextInputChange={handleTextInputChange}
          />

          <View style={styles.fixedClass}>
            <Text style={styles.label}>Fixed Class</Text>
            <View style={styles.switch}>
              <Switch
                color="#4c8bf5"
                value={courseData.fixedClass}
                onValueChange={() => {
                  if (courseData.fixedClass) {
                    handleTextInputChange({ fixedClass: false });
                    return;
                  }
                  handleTextInputChange({ fixedClass: true });
                }}
              />
            </View>
          </View>

          <CustomTextInput
            courseType="Lecturer"
            placeholder="e.g Mr. Adeniyi"
            mode="lecturer"
            handleTextInputChange={handleTextInputChange}
            value={courseData.lecturer}
          />

          <View style={styles.chipHolder}>
            <Text style={styles.label}>Day of the Week</Text>
            <Picker
              style={{ width: "100%" }}
              selectedValue={courseData.dayOfTheWeek}
              onValueChange={(value, index) =>
                handleTextInputChange({ dayOfTheWeek: value })
              }
            >
              <Picker.Item label="Sunday" value="Sunday" />
              <Picker.Item label="Monday" value="Monday" />
              <Picker.Item label="Tuesday" value="Tuesday" />
              <Picker.Item label="Wednesday" value="Wednesday" />
              <Picker.Item label="Thursday" value="Thursday" />
              <Picker.Item label="Friday" value="Friday" />
              <Picker.Item label="Saturday" value="Saturday" />
            </Picker>
          </View>

          <CustomTextInput
            courseType="Location"
            placeholder="e.g Elect Hall II"
            mode="location"
            handleTextInputChange={handleTextInputChange}
            value={courseData.location}
          />

          <View style={styles.timeHolder}>
            <View style={styles.dateTextHolder}>
              <Text style={styles.label}>Start Time: </Text>
            </View>
            <DatePicker
              style={styles.datePicker}
              date={courseData.startTime}
              mode="time"
              onDateChange={date => {
                const timeArray = date.split(":");
                const startTimeHours = parseInt(timeArray[0]) * 60 * 60;
                const startTimeMinutes = parseInt(timeArray[1]) * 60;
                handleTextInputChange({
                  startTime: date,
                  startTimeSeconds: startTimeHours + startTimeMinutes
                });
              }}
            />
          </View>

          <View style={styles.timeHolder}>
            <View style={styles.dateTextHolder}>
              <Text style={styles.label}>End Time: </Text>
            </View>
            <DatePicker
              style={styles.datePicker}
              date={courseData.endTime}
              mode="time"
              onDateChange={date => {
                const timeArray = date.split(":");
                const endTimeHours = parseInt(timeArray[0]) * 60 * 60;
                const endTimeMinutes = parseInt(timeArray[1]) * 60;
                handleTextInputChange({
                  endTime: date,
                  endTimeSeconds: endTimeHours + endTimeMinutes
                });
              }}
            />
          </View>
        </View>

        <TouchableWithoutFeedback onPress={() => {
          if(!disableBtn){
            sendData()
          }
        }}>
          <View
            style={[
              styles.saveBtn,
              { backgroundColor: disableBtn ? "rgba(76, 139, 245,0.5)" : "rgba(76, 139, 245,1)" }
            ]}
          >
            <Text style={styles.saveBtnText}>SAVE</Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5
  },
  appBarContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    alignItems: "center",
    flexDirection: "row"
  },
  greetings: {
    color: "black",
    fontSize: 22,
    marginHorizontal: 10,
    fontFamily: "atlas",
    marginLeft: 20
  },
  formContainer: {
    marginVertical: 10
  },
  textInput: {
    width: "100%",
    marginVertical: 20,
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  fixedClass: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 10
  },
  switch: {
    marginLeft: "auto"
  },
  chipHolder: {
    marginVertical: 20
  },
  label: {
    color: "rgba(0,0,0,0.5)",
    fontFamily: "normal-default",
    fontSize: 16
  },
  timeHolder: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 10
  },
  datePicker: {
    marginHorizontal: 10,
    marginVertical: 10
  },
  dateTextHolder: {
    width: 100
  },
  saveBtn: {
    width: "100%",
    padding: 10,
    borderRadius: 5
  },
  saveBtnText: {
    color: "white",
    fontFamily: "normal-default",
    textAlign: "center"
  }
});

export default CreateClass;
