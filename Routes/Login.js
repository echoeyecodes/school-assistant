import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, AsyncStorage } from "react-native";
import {TouchableRipple} from 'react-native-paper'
import LoadingModal from "../ModalComponents/LoadingModal";
const Form = ({handleFormData}) => {
  return (
    <View style={styles.form}>
      <View style={styles.formItem}>
        <Text style={styles.label}>Enter your email:</Text>
        <TextInput onChangeText={(value) => handleFormData({email: value})} style={styles.textInput} placeholder="Email address" />
      </View>

      <View>
        <Text style={styles.label}>Enter your password:</Text>
        <TextInput onChangeText={(value) => handleFormData({password: value})} style={styles.textInput} placeholder="Password" autoCapitalize='none' secureTextEntry />
      </View>
    </View>
  );
};
const Login = (props) => {
    const [disabled, setDisabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({
        email: null,
        password: null
    })

    const validate = () =>{
        if(data['email'] === null || data['email'] === '' || data['password'] === null || data['password'] === ''){
            setDisabled(true)
            return
        }
        setDisabled(false)
    }

    const handleFormData = (value) =>{
        setData({
            ...data,
            ...value
        })
    }
    const sendData =() =>{
        fetch(`http://192.168.43.31:3000/login/${data.email}/${data.password}`,{
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(data => data.json().then(async credentials =>{
            if(credentials.status === 200){
            await AsyncStorage.setItem('assistant-user-data', JSON.stringify(credentials))
            setIsLoading(false)
            props.navigation.navigate('Index')
            }else if(credentials.status === 400 || credentials.status === 401){
                setIsLoading(false)
                alert(credentials.msg)
            }
        })).catch(error =>{
            console.log(error)
            alert('An error occured. Please try again!')
        })
    }
    useEffect(() =>{
        validate()
    }, [data])
  return (
    <KeyboardAvoidingView enabled behavior='padding' style={styles.container}>
        <LoadingModal visible={isLoading} />
      <Form handleFormData={handleFormData}/>

      <View style={styles.actionBtn}>
      <TouchableRipple
        onPress={() => {
            if(!disabled){
                setIsLoading(true)
                sendData()
            }
        }}
        rippleColor="rgba(76, 139, 245, 0.5)"
        style={[
          styles.proceedBtn,
          { backgroundColor: disabled ? "rgba(255,255,255,0.5)" : "#fff" }
        ]}
      >
        <Text style={styles.proceedBtnText}>LOGIN</Text>
      </TouchableRipple>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4c8bf5",
    alignItems: "center",
    justifyContent: "center"
  },
  form:{
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 10
  },
  formItem:{
    marginVertical: 15
  },
  label:{
    fontFamily: 'normal-default',
    fontSize: 18
  },
  actionBtn:{
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10
  },
  textInput: {},
  proceedBtn: {
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5
  },
  proceedBtnText: {
    textAlign: "center",
    fontSize: 16,
    color: "#4c8bf5",
    fontFamily: "normal-default"
  },
});

export default Login;
