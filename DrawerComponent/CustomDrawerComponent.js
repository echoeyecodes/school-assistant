import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  AsyncStorage,
  TouchableWithoutFeedback
} from "react-native";
import {withNavigation} from 'react-navigation'

const CustomDrawerComponent = (props) => {
  const [data, setData] = useState({
    name: "User",
    imageUrl: null,
    isAdmin: false
  });

  const getUserData = async () => {
    const jsonData = await AsyncStorage.getItem("assistant-user-data");
    const parsedData = JSON.parse(jsonData);
    setData(parsedData.data);
  };

  const signOut = async () =>{
    await AsyncStorage.removeItem('assistant-user-data');
    props.navigation.navigate('Login')
  }

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image style={styles.image} source={{ uri: data.imageUrl }} />
      </View>

      <View style={styles.profileMisc}>
        <Text style={styles.name}>{data.name}</Text>

        <View style={styles.statusHolder}>
        <Text>Status: </Text>
        <Text style={styles.statusText}>{data.isAdmin ? "Admin" : "User"}</Text>
      </View>

        <Text style={styles.msg}>
          This app is still in beta. More features to be added soon!
        </Text>
      </View>

      <TouchableWithoutFeedback onPress={() => signOut()}>
        <View style={styles.signOutBtn}>
          <Text style={styles.signOutText}>SIGN OUT</Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  profileMisc: {
    marginVertical: 10
  },
  name: {
    fontFamily: "normal-default",
    fontSize: 18,
    textAlign: "center"
  },
  msg: {
    color: "rgba(0,0,0,0.5)",
    textAlign: "center"
  },
  statusHolder: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusText:{
    fontFamily: 'normal-default',
    color:'#4c8bf5',
  },
  signOutBtn:{
    position: 'absolute',
    bottom:5,
    left: 5,
    right: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4c8bf5'
  },
  signOutText:{
    color: 'white',
    fontFamily: 'normal-default',
    textAlign: 'center'
  }
});

export default withNavigation(CustomDrawerComponent);
