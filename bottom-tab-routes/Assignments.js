import React, { useState, useCallback } from "react";
import { StyleSheet, Image, View, Text, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {FAB} from 'react-native-paper'
const DueAssignmentsItem = ({ courseCode, desc, time }) => {
  return (
    <View style={styles.dueAssignmentsItem}>
      <Text style={styles.dueAssignmentsCourseCode}>{courseCode}</Text>
      <View>
        <Text style={styles.dueAssignmentsDesc}>{desc}</Text>
        <View>
          <Text style={styles.dueTimeText}>
            Due: <Text style={styles.dueTime}>{time}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};
const DueAssignments = ({ date }) => {
  return (
    <View style={styles.dueAssignmentsHolder}>
      <Text style={styles.dueAssignmentsDate}>{date}</Text>
      <View style={styles.gridItem}>
        <DueAssignmentsItem
          courseCode="FEG 401"
          desc="Briefly discuss on the advantages of water to the development of
            the situation of the Nigerian economy citing vivid ..."
          time="9:00am"
        />

        <DueAssignmentsItem
          courseCode="EEG 431"
          desc="Calculate the total time required to power a volatge generator of 2500 khZ in 7 mins"
          time="12:00pm"
        />

        <DueAssignmentsItem
          courseCode="EEG 431"
          desc="Calculate the total time required to power a volatge generator of 2500 khZ in 7 mins"
          time="12:00pm"
        />
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

const Assignments = () => {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <DueAssignments date="Monday, Jul 24" />
        <DueAssignments date="Wednesday, Aug 5" />
      </ScrollView>

      <FAB
      style={styles.FAB}
      onPress={() => console.log('fab')}
      icon='plus'
      color='#fff'
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 10
  },
  emptyAssignmentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyAssignmentImage: {
    width: 250,
    height: 250
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
    color: "rgba(0,0,0,0.5)",
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
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4c8bf5'
  },
});

export default Assignments;
