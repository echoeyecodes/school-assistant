import React, { useState, useCallback, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  RefreshControl
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";

const NotificationsItem = () => {
  const {theme} = useContext(ThemeContext)
  return (
    <TouchableWithoutFeedback>
      <View style={styles.notificationsItemContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
          <View
            style={[
              styles.notificationItem,
              { backgroundColor: 'rgba(76, 139, 245, 0.2)' }
            ]}
          >
            <Text style={[styles.notificationDescription, theme.colorPrimary]}>
              A new course was added to <Text style={styles.focus}>Wednesday</Text>
            </Text>

            <View>
              <Text style={styles.time}>5 mins ago</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const Notifications = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([])
  const {theme} = useContext(ThemeContext)

  const refresh = useCallback(() => {
    fetchAssignments()
  }, [refreshing]);
  

  const fetchAssignments = async () =>{
    setRefreshing(true)
    const list = await AsyncStorage.getItem('assignments')
    const realList = JSON.parse(list)
    setData(realList)
    setRefreshing(false)

    console.log(realList)
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        >
          <View style={styles.dateCategory}>
            <Text style={[styles.date, {color: theme.colorPrimary}]}>Today</Text>
            <NotificationsItem />
            <NotificationsItem />
            <NotificationsItem />
            <NotificationsItem />
          </View>

          <View style={styles.dateCategory}>
            <Text style={[styles.date, {color: theme.colorPrimary}]}>Earlier</Text>
          </View>
          <NotificationsItem />
          <NotificationsItem />
          <NotificationsItem />
          <NotificationsItem />
          <NotificationsItem />
          <NotificationsItem />
        </ScrollView>
      </View>
    </View>
  );
};


//enable badge icon on notification
/* Notifications.navigationOptions={
  tabBarBadge: true
} */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  notificationsItemContainer: {
    marginHorizontal: 10
  },
  notificationDescription: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 16
  },
  focus: {
    fontWeight: "bold",
    color: "black"
  },
  time: {
    color: "rgba(0,0,0,0.5)",
    fontWeight: "bold"
  },
  notificationItem: {
    marginLeft: 10,
    flex: 1,
    borderRadius: 5,
    padding: 5
  },
  date:{
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10
  },
  dateCategory:{
    marginVertical: 5
  }
});

export default Notifications;
