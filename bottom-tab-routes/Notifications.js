import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  RefreshControl
} from "react-native";
import { Appbar } from "react-native-paper";
const TopBar = () => {
  return (
    <Appbar.Header style={{ backgroundColor: "white", elevation: 0 }}>
      <View style={styles.appBarContainer}>
        <Text style={styles.appBarTitle}>Notifications</Text>
      </View>
    </Appbar.Header>
  );
};

const NotificationsItem = () => {
  const colors = [
    "#f4c4f3",
    "#C9D6FF",
    "#feb47b",
    "#89fffd",
    "#a1ffce",
    "#faffd1"
  ];
  const index = Math.floor(Math.random() * colors.length);
  return (
    <TouchableWithoutFeedback>
      <View style={styles.notificationsItemContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image style={styles.image} source={require("../assets/man.jpg")} />

          <View
            style={[
              styles.notificationItem,
              { backgroundColor: colors[index] }
            ]}
          >
            <Text style={styles.notificationDescription}>
              <Text style={styles.focus}>Jordan </Text>
              added a new course to <Text style={styles.focus}>Wednesday</Text>
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
const Notifications = () => {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        >
          <View style={styles.dateCategory}>
            <Text style={styles.date}>Today</Text>
            <NotificationsItem />
            <NotificationsItem />
            <NotificationsItem />
            <NotificationsItem />
          </View>

          <View style={styles.dateCategory}>
            <Text style={styles.date}>Earlier</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  appBarContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    alignItems: "center",
    flexDirection: "row"
  },
  appBarTitle: {
    color: "black",
    fontSize: 22,
    marginHorizontal: 10,
    fontFamily: "atlas"
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  notificationsItemContainer: {
    marginVertical: 5,
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
