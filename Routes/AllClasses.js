import React, {useState, useCallback, useEffect} from 'react';
import { StyleSheet, Text, AsyncStorage, View, ScrollView, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import {Appbar, TouchableRipple} from 'react-native-paper'
import {Ionicons} from '@expo/vector-icons'
import {Upcoming, EmptyImage} from '../components/ClassesComponents'
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

const DayTabs = ({day, currentIndex, position, changeDay}) =>{
    let obj={
        bgColor: '#fff',
        color: '#4c8bf5'
    }
    if(currentIndex === position){
        obj = {
            bgColor: '#4c8bf5',
            color:'#fff'
        }
    }
    return(
        <TouchableRipple onPress={() => changeDay(position)} style={[styles.dayTabs, {backgroundColor: obj.bgColor}]} rippleColor='rgba(76, 139, 245, 0.4'>
            <Text style={[styles.dayTabsText, {color: obj.color}]}>{day}</Text>
        </TouchableRipple>
    )
}

const AllClasses = (props) => {
    const [currentIndex, setCurrentIndex] = useState(new Date().getDay())
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState([])
    const [seconds, setSeconds] = useState(0)

    const refresh = useCallback(() => {
        fetchData()
      }, [refreshing]);

      const fetchData = async () => {
          setRefreshing(true)
        const courseData = await AsyncStorage.getItem("school-assistant-courses");
        if (courseData) {
          const sortedData = JSON.parse(courseData).filter(item => item.dayOfTheWeek === currentIndex).sort(
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

    const changeDay = (value) =>{
        setCurrentIndex(value)
    }

    useEffect(() =>{
        fetchData()
    }, [currentIndex])
  return (
    <View style={styles.container}>
      <TopBar title='All Classes' {...props} />

    <View style={styles.dayTabsContainer}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'].map((item, index) =>{
            return(
                <DayTabs key={index} day={item} changeDay={changeDay} position={index} currentIndex={currentIndex} />
            )
        })}
            </ScrollView>
      </View>

      <View style={{flex: 1}}>
        <ScrollView refreshControl={
            <RefreshControl  refreshing={refreshing} onRefresh={refresh} />
        }>
        <View style={styles.classesContainer}>
        {data.length > 0 ? (
                <Upcoming data={data} />
              ) : (
                <EmptyImage msg="No classes today!" />
              )}
        </View>
        </ScrollView>
      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  classesContainer: {
    marginHorizontal: 20,
    marginVertical: 5
  },
  dayTabsContainer:{
    flexDirection: 'row',
  },    
  dayTabs:{
    borderRadius: 10,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  appBarContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    alignItems: "center",
    flexDirection: "row"
  },
  dayTabsText:{
      textAlign: 'center',
      fontFamily: 'normal-default'
  },
  greetings: {
    color: "black",
    fontSize: 22,
    marginHorizontal: 10,
    fontFamily: "atlas",
    marginLeft: 20
  },
});


export default AllClasses