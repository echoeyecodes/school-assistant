import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
  ScrollView
} from "react-native";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import mockData from "../util/courses";

const MostRecent = ({ data = {}, currentSeconds }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('')

  const getTimeRemaining =() =>{
    const destHours = (data.endTimeSeconds/60/60)
    const currentHours = (currentSeconds/60/60)
    const hours = (destHours-currentHours)
    const minutes = parseInt(parseFloat(`0.${(hours.toString().split('.').pop())}`) * 60)
    setTimeRemaining(parseInt(hours) === 0 ? `${minutes} mins remaining` : (parseInt(hours) === 2) ? `${parseInt(hours)} hrs remaining` : `${parseInt(hours)} hrs : ${minutes} mins remaining`)
  }
  
  useEffect(() => {
    if (
      currentSeconds >= data.startTimeSeconds &&
      currentSeconds <= data.endTimeSeconds
    ) {
      setIsActive(true);
      getTimeRemaining()
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
          <Text
            style={styles.time}
          >{isActive ? timeRemaining : `${data.startTime} - ${data.endTime}`}</Text>
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

const UpcomingItem = ({ title, full, time, fixed = false }) => {
  return (
    <View
      style={[
        styles.upcomingItem,
        fixed ? { borderLeftColor: "#de5246", borderLeftWidth: 3 } : null
      ]}
    >
      <Text style={styles.courseTitle}>{title}</Text>
      <Text style={styles.courseFull}>{full}</Text>
      <Text style={styles.courseTime}>{time}</Text>
    </View>
  );
};

const Upcoming = ({ data }) => {
  return (
    <View>
      {data.map((item, index) => (
        <UpcomingItem
          key={index}
          title={item.courseCode}
          full={item.courseTitle}
          time={`${item.startTime} - ${item.endTime}`}
        />
      ))}
    </View>
  );
};

const EmptyImage = () => {
  return (
    <View style={styles.emptyImageHolder}>
      <Image
        style={styles.emptyImage}
        source={require("../assets/empty_task.png")}
      />
      <Text style={styles.emptyText}>You're caught up for today!</Text>
    </View>
  );
};

const Home = () => {
    const [data, setData] = useState([]);
    const [seconds, setSeconds] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    const sortedData = mockData.sort((item1, item2) => item1.startTimeSeconds - item2.startTimeSeconds);
    let date = new Date();
    const currentSeconds = (date.getHours() * 60 * 60) + (date.getMinutes() * 60);
    let newData = sortedData.filter(
      item => item.endTimeSeconds > currentSeconds
    );
    setSeconds(currentSeconds);
    setData(newData);
  };

  const refresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [refreshing]);

  useEffect(() => {
    fetchData()
    setInterval(() =>{
      fetchData();
    }, 5000)
  }, []);

  return (
    <View style={styles.container}>
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
                  { color: "rgba(0,0,0,0.5)", paddingHorizontal: 5 }
                ]}
              >
                Upcoming classes
              </Text>
              {data.length - 1 > 0 ? <Upcoming data={data.slice(1)} /> : <EmptyImage />}
            </View>
          </View>
        ) : (
          <EmptyImage />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
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
  upcomingItem: {
    marginVertical: 5,
    paddingHorizontal: 5
  },
  courseTitle: {
    color: "black",
    fontFamily: "atlas",
    fontSize: 18
  },
  courseFull: {
    color: "rgba(0,0,0,0.5)"
  },
  courseTime: {
    color: "rgba(0,0,0,0.5)",
    fontWeight: "bold"
  },
  emptyImageHolder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyImage: {
    width: 200,
    height: 200
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "normal-default"
  }
});

export default Home;
