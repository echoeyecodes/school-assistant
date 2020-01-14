import React, {useEffect} from 'react';
import { StyleSheet, Text, View, AsyncStorage} from 'react-native';

const SplashScreen = (props) => {

    const getData = async () =>{
      const data = await AsyncStorage.getItem('assistant-user-data')
      if(data){
        props.navigation.navigate('Index')
        return
      }
      props.navigation.navigate('Auth')
    }
    useEffect(() =>{
      getData()
    }, [])
  return (
    <View style={styles.container}>
      <Text>Hello!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default SplashScreen