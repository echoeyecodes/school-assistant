import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ScrollView,
  AsyncStorage,
  TouchableWithoutFeedback
} from "react-native";
import { FAB, Snackbar} from "react-native-paper";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {Upcoming, EmptyImage} from '../components/ClassesComponents'
import {ThemeContext} from '../context/ThemeContext'
import {formatDay} from '../util/formatDate'

const MostRecent = ({ data = {}, currentSeconds }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");

  const getTimeRemaining = () => {
    const destHours = data.endTimeSeconds / 60 / 60;
    const currentHours = currentSeconds / 60 / 60;
    const hours = destHours - currentHours;
    const minutes = parseInt(
      parseFloat(
        `0.${hours
          .toString()
          .split(".")
          .pop()}`
      ) * 60
    );
    setTimeRemaining(
      parseInt(hours) === 0
        ? `${minutes} mins remaining`
        : parseInt(hours) === 2
        ? `${parseInt(hours)} hrs remaining`
        : `${parseInt(hours)} hrs : ${minutes} mins remaining`
    );
  };

  useEffect(() => {
    if (
      currentSeconds >= data.startTimeSeconds &&
      currentSeconds <= data.endTimeSeconds
    ) {
      setIsActive(true);
      getTimeRemaining();
      return;
    }
    setIsActive(false);
  }, [currentSeconds]);

  return (
    <LinearGradient
      colors={["#7474BF", "#348AC7"]}
      start={[0, 1]}
      end={[1, 0]}
      style={styles.mostRecentContainer}
    >
      <Text style={styles.descriptive}>
        {isActive ? "Happening now!" : "Next Class"}
      </Text>
      <Text style={styles.title}>{data.courseCode}</Text>

      <View style={styles.lectureDetails}>
        <View style={styles.lectureDetailsItem}>
          <View style={styles.iconHolder}>
            <AntDesign
              name="clockcircleo"
              color="rgba(255,255,255,0.5)"
              size={18}
            />
          </View>
          <Text style={styles.time}>
            {isActive ? timeRemaining : `${data.startTime} - ${data.endTime}`}
          </Text>
        </View>

        <View style={styles.lectureDetailsItem}>
          <View style={styles.iconHolder}>
            <Ionicons
              name="ios-person"
              color="rgba(255,255,255,0.5)"
              size={18}
            />
          </View>
          <Text style={styles.time}>{data.lecturer}</Text>
        </View>

        <View style={styles.lectureDetailsItem}>
          <View style={styles.iconHolder}>
            <Entypo
              name="location-pin"
              color="rgba(255,255,255,0.5)"
              size={18}
            />
          </View>
          <Text style={styles.time}>{data.location}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const Home = props => {
  const [data, setData] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarShowing, setSnackbarShowing] = useState(false);
  const timer = useRef(null)
  const {theme} = useContext(ThemeContext)

  const fetchCoursesServer = () => {
    setRefreshing(true)
    fetch("http://192.168.43.31:3000/courses", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(data => data.json().then(async response => {
          await AsyncStorage.setItem("school-assistant-courses", JSON.stringify(response.data));
          fetchData()
        })
      ).catch(error =>{
        fetchData()
        setSnackbarShowing(true)
        setRefreshing(false)
      });
  };

  const fetchData = async () => {
    const courseData = await AsyncStorage.getItem("school-assistant-courses");
    if (courseData) {
      const sortedData = JSON.parse(courseData).filter(item => item.dayOfTheWeek === formatDay(new Date().getDay())).sort(
        (item1, item2) => item1.startTimeSeconds - item2.startTimeSeconds
      );
      let date = new Date();
      const currentSeconds = date.getHours() * 60 * 60 + date.getMinutes() * 60;
      let newData = sortedData.filter(
        item => item.endTimeSeconds > currentSeconds
      );
      setSeconds(currentSeconds);
      setData(newData);
      setRefreshing(false)
      return;
    }
    setData([]);
    setRefreshing(false)
  };

  const isShowingCreateClass = () => {
    props.navigation.navigate("CreateClass");
  };

  const refresh = useCallback(() => {
    fetchCoursesServer()
  }, [refreshing]);

  useEffect(() => {
    fetchCoursesServer()
   timer.current = setInterval(() => {
      fetchData();
    }, 5000)

    return () =>{
      clearInterval(timer.current)
    }
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
        {data.length > 0 ? (
          <View>
            <MostRecent data={data[0]} currentSeconds={seconds} />
            <View style={styles.upcomingContainer}>
              <Text
                style={[
                  styles.descriptive,
                  { color: theme.colorSecondary, paddingHorizontal: 5 }
                ]}
              >
                Upcoming classes
              </Text>
              {data.length - 1 > 0 ? (
                <Upcoming data={data.slice(1)} />
              ) : (
                <EmptyImage msg="You're caught up for today" />
              )}
            </View>
          </View>
        ) : (
          <EmptyImage msg="You're caught up for today" />
        )}
         <TouchableWithoutFeedback onPress={() => props.navigation.navigate('AllClasses')}>
        <View style={styles.allClassesBtn}>
          <Text style={styles.allClassesText}>ALL CLASSES</Text>
        </View>
      </TouchableWithoutFeedback>
      </ScrollView>
      <FAB
        style={styles.fab}
        color="#fff"
        icon="plus"
        onPress={() => isShowingCreateClass()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mostRecentContainer: {
    padding: 10,
    height: 150,
    marginHorizontal: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10
  },
  descriptive: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 16
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20
  },
  lectureDetails: {
    alignItems: "flex-start"
  },
  iconHolder: {
    width: 20,
    height: 20
  },
  lectureDetailsItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 5
  },
  time: {
    marginHorizontal: 10,
    color: "white",
    fontSize: 16,
    textAlign: "left"
  },
  upcomingContainer: {
    marginHorizontal: 20,
    marginVertical: 5
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#4c8bf5"
  },
  allClassesBtn:{
    backgroundColor: '#4c8bf5',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10
  },
  allClassesText:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center'
  }
});

export default Home;
