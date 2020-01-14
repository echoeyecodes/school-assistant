import React, { useState, useContext } from "react";
import { Text, View, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Appbar, Switch } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import {ThemeContext} from '../context/ThemeContext'
const TopBar = ({ title, ...props }) => {
  return (
    <Appbar.Header style={{ backgroundColor: "white", elevation: 0 }}>
      <View style={styles.appBarContainer}>
        <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
          <Ionicons name="ios-arrow-back" color="black" size={24} />
        </TouchableWithoutFeedback>
        <Text style={styles.greetings}>{title}</Text>
      </View>
    </Appbar.Header>
  );
};

const SettingItem = ({toggleTheme}) => {
  const [isDark, setIsDark] = useState(false);
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingItem1}>
        <Text style={styles.settingItemTitle}>Activate dark Mode</Text>
        <Text style={styles.settingItemDesc}>
          Use dark mode to save your eyes from the blistering eveil of the sun!
        </Text>
      </View>

      <View style={styles.settingItem2}>
        <Switch
          color="#4c8bf5"
          value={isDark}
          onValueChange={() => {
            toggleTheme()
              if(isDark){
                  setIsDark(false)
                  return
              }
            setIsDark(true);
          }}
        />
      </View>
    </View>
  );
};

const Settings = (props) => {
  const {toggleTheme} = useContext(ThemeContext)
  return (
    <View style={styles.container}>
      <TopBar title="Settings" {...props}/>

      <View style={styles.settingItemContainer}>
          <SettingItem toggleTheme={toggleTheme}/>
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
  greetings: {
    color: "black",
    fontSize: 22,
    marginHorizontal: 10,
    fontFamily: "atlas"
  },
  settingItem: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "flex-start",
    alignItems: 'center',
  },
  settingItem1:{
    flex: 1
  },
  settingItem2: {
    marginLeft: "auto",
    width: 50
  },
  settingItemTitle:{
      fontFamily: 'normal-default',
      fontSize: 18
  },
  settingItemDesc:{
      color: 'rgba(0,0,0,0.5)',
  }
});

export default Settings;
