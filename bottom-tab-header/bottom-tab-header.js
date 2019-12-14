import React from 'react'
import {
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    StyleSheet
  } from "react-native";
  import { Appbar } from "react-native-paper";
  import { Ionicons } from "@expo/vector-icons";

const TopBar = () => {
    return (
      <Appbar.Header style={{ backgroundColor: "white", elevation: 0 }}>
        <View style={styles.appBarContainer}>
          <View style={styles.profileView}>
            <Image style={styles.image} source={require("../assets/man.jpg")} />
            <Text style={styles.greetings}>Hello, Otemuyiwa</Text>
          </View>
  
          <View style={styles.right}>
            <TouchableWithoutFeedback>
              <Ionicons name="md-book" color="black" size={28} />
            </TouchableWithoutFeedback>
          </View>
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
        color: "black",
        fontSize: 22,
        marginHorizontal: 10,
        fontFamily: "atlas"
      },
      right: {
        marginLeft: "auto"
      },
  })
  export default TopBar