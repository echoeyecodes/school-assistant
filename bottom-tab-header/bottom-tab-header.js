import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  AsyncStorage,
  StyleSheet
} from "react-native";
import { Appbar } from "react-native-paper";
import {AntDesign } from "@expo/vector-icons";
import {ThemeContext} from '../context/ThemeContext'

const TopBar = props => {
  const [data, setData] = useState({ name: "User", imageUrl: null });
  const {theme} = useContext(ThemeContext)

  const getUserData = async () => {
    const jsonData = await AsyncStorage.getItem("assistant-user-data");
    const parsedData = JSON.parse(jsonData);
    setData(parsedData.data);
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <Appbar.Header style={{ backgroundColor: theme.backgroundColor, elevation: 0 }}>
      <View style={styles.appBarContainer}>
        <View style={styles.profileView}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.openDrawer()}
          >
            <Image style={styles.image} source={{ uri: data.imageUrl }} />
          </TouchableWithoutFeedback>
          <Text style={[styles.greetings, {color: theme.colorPrimary}]}>Hello, {data.name.split(" ")[0]}</Text>
        </View>

        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate("Settings")}
        >
          <View style={styles.right}>
            <AntDesign name="setting" color={theme.colorPrimary} size={28} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  appBarContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    alignItems: "center",
    flexDirection: "row"
  },
  profileView: {
    flexDirection: "row",
    alignItems: "center"
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  greetings: {
    fontSize: 22,
    marginHorizontal: 10,
    fontFamily: "atlas"
  },
  right: {
    marginLeft: "auto"
  }
});
export default TopBar;
