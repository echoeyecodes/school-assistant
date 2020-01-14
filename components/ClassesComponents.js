import React from 'react'
import { StyleSheet,
    Text,
    View,
    Image,
    RefreshControl,
    ScrollView,
    AsyncStorage,
    TouchableWithoutFeedback} from 'react-native'

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

  
const EmptyImage = ({msg}) => {
    return (
      <View style={styles.emptyImageHolder}>
        <Image
          style={styles.emptyImage}
          source={require("../assets/empty_task.png")}
        />
        <Text style={styles.emptyText}>{msg}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
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
        alignItems: "center",
        marginVertical: 10
      },
      emptyImage: {
        width: 150,
        height: 150
      },
      emptyText: {
        fontSize: 18,
        fontFamily: "normal-default"
      },
  })
  export {Upcoming, UpcomingItem, EmptyImage}