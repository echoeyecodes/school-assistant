import React, { useState, useCallback, useEffect, useContext } from "react";
import { StyleSheet, Image, View, Text, RefreshControl,AsyncStorage, TouchableWithoutFeedback } from "react-native";
import {
  ScrollView,
} from "react-native-gesture-handler";
import { FAB, Snackbar } from "react-native-paper";
import {ThemeContext} from '../context/ThemeContext'

const DueAssignmentsItem = ({ courseCode, desc, time, date, ...props }) => {
  let loggedDate = new Date(date).toString();
  const weekday = loggedDate.split(" ")[0];
  const month = loggedDate.split(" ")[1];
  const day = loggedDate.split(" ")[2];
  const {theme} = useContext(ThemeContext)

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        props.navigation.navigate("CreateAssignment", {
          read: true,
          courseCode,
          desc
        })
      }
    >
      <View style={[styles.dueAssignmentsItem, {borderColor: theme.borderColor}]}>
        <Text style={[styles.dueAssignmentsCourseCode, {color: theme.colorPrimary}]}>{courseCode}</Text>
        <View>
          <Text numberOfLines={8} style={[styles.dueAssignmentsDesc, {color: theme.colorSecondary}]}>
            {desc}
          </Text>
          <View>
            <Text style={[styles.dueTimeText, {color: theme.colorPrimary}]}>
              Due:{" "}
              <Text style={styles.dueTime}>
                {weekday}, {month} {day}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const DueAssignments = ({ assignments, ...props }) => {
  const {theme} = useContext(ThemeContext)
  return (
    <View style={[styles.dueAssignmentsHolder, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.gridItem}>
        {assignments.map((item, index) => {
          return (
            <DueAssignmentsItem
             {...props}
              key={index}
              courseCode={item.courseCode}
              desc={item.content}
              time={item.time}
              date={item.date}
            />
          );
        })}
      </View>
    </View>
  );
};

const EmptyAssignments = () => {
  return (
    <View style={styles.emptyAssignmentsContainer}>
      <Image
        style={styles.emptyAssignmentImage}
        source={require("../assets/empty_assignments.png")}
      />
      <Text style={styles.emptyMsgStatus}>No pending assignments</Text>
      <Text style={styles.emptyMsg}>You should probably get to studying</Text>
    </View>
  );
};

const Assignments = props => {
  const [refreshing, setRefreshing] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [snackbarShowing, setSnackbarShowing] = useState(false);
  const {theme} = useContext(ThemeContext)

  const refresh = useCallback(() => {
    setRefreshing(true);
    getServerAssignments();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [refreshing]);

  const getAssignments = async () =>{
    const assignmentData = await AsyncStorage.getItem('school-assistant-assignments')
    if(assignmentData){
      const assignmentArray = JSON.parse(assignmentData)

      const sortedMonth = assignmentArray.sort(
        (item1, item2) =>
          parseInt(item1.date.split("-")[1]) -
          parseInt(item2.date.split("-")[1])
      );
      const sortedDay = sortedMonth.sort(
        (item1, item2) =>
          parseInt(item1.date.split("-")[2]) -
          parseInt(item2.date.split("-")[2])
      );
      const currentDate = new Date();
      const recentData = sortedDay
        .filter(
          item =>
            parseInt(item.date.split("-")[1]) >= currentDate.getMonth()
        )
        .filter(item => item.date.split("-")[2] >= currentDate.getDate());
        setAssignments(recentData);
    }
    setRefreshing(false)
  }

  const getServerAssignments = () => {
    setRefreshing(true)
    fetch("http://192.168.43.31:3000/assignments", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(data =>
      data.json().then(async ({ status, data }) => {
        if (status === 200) {
         await AsyncStorage.setItem('school-assistant-assignments', JSON.stringify(data))
         getAssignments()
        }
      })
    ).catch(error =>{
      setSnackbarShowing(true)
      getAssignments()
    });
  };

  useEffect(() => {
    getServerAssignments();
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <Snackbar
        visible={snackbarShowing}
        onDismiss={() => setSnackbarShowing(false)}
        duration={2000}
        action={{
          label: "Okay",
          onPress: () => {
            // Do something
          }
        }}
      >
        Couldn't connect to Server.
      </Snackbar>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {assignments.length > 0 ? (
          <DueAssignments assignments={assignments} {...props} />
        ) : (
          <EmptyAssignments  />
        )}
      </ScrollView>

      <FAB
        style={styles.FAB}
        onPress={() => props.navigation.navigate("CreateAssignment")}
        icon="plus"
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  },
  emptyAssignmentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyAssignmentImage: {
    width: 150,
    height: 150,
    marginVertical: 10
  },
  emptyMsgStatus: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 14,
    fontFamily: "normal-default"
  },
  emptyMsg: {
    fontFamily: "normal-default",
    fontSize: 18
  },
  dueAssignmentsHolder: {
    marginVertical: 5
  },
  dueAssignmentsDate: {
    fontFamily: "normal-default",
    fontSize: 24
  },
  dueAssignmentsCourseCode: {
    fontWeight: "bold",
    fontSize: 16
  },
  dueAssignmentsItem: {
    width: "45%",
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5
  },
  gridItem: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  dueAssignmentsDesc: {
    fontFamily: "gochi-hand",
    fontSize: 18,
    maxHeight: 200,
    marginTop: 5
  },
  dueTimeText: {
    marginTop: 10
  },
  dueTime: {
    color: "#4c8bf5",
    fontFamily: "normal-default"
  },
  FAB: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#4c8bf5"
  }
});

export default Assignments;
