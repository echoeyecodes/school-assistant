import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  AsyncStorage,
  Animated
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { TouchableRipple } from "react-native-paper";
import LoadingModal from "../ModalComponents/LoadingModal";
const Form = ({ question, placeholder, target, getFormData }) => {
  return (
    <Animated.View style={[styles.form]}>
      <Text style={styles.prompt}>{question}</Text>

      <View style={styles.textInputHolder}>
        <TextInput
          onChangeText={value => {
            let obj = {};
            obj[target] = value;
            getFormData(obj);
          }}
          secureTextEntry={target === 'password' ? true : false}
          style={styles.textInput}
          autoCapitalize={target === 'password' ? 'none' : 'sentences'}
          placeholder={placeholder}
        />
      </View>
    </Animated.View>
  );
};

const ChooseImage = ({ uri, selectImage }) => {
  let [opacity] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000
    }).start();
  }, []);
  return (
    <Animated.View style={[styles.chooseImageHolder, { opacity }]}>
      <Image style={styles.image} source={{ uri }} />

      <TouchableWithoutFeedback onPress={() => selectImage()}>
        <View style={styles.chooseImageBtn}>
          <Text style={[styles.proceedBtnText, { fontSize: 14 }]}>
            Choose Image
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const Welcome = (props) => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [data, setData] = useState({
    name: null,
    department: null,
    level: null,
    image: null,
    email: null,
    password: null
  });
  const [visible, setVisible] = useState(false);
  const [placeholder, setPlaceholder] = useState(null);
  const [target, setTarget] = useState("name");

  const showImage = () => {
    setVisible(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      let obj = {};
      obj[target] = result.uri;
      getFormData(obj);
    }
  };

  const getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    pickImage();
  };

  const selectImage = () => {
    getPermissionAsync();
  };

  const validateData = () => {
    let value = target;
    let prevData = Object.assign({}, data);
    if (prevData[value] === null || prevData[value] === "") {
      setDisableBtn(true);
      return;
    }
    setDisableBtn(false);
  };

  const getFormData = value => {
    setData({
      ...data,
      ...value
    });
  };

  const sendData =() =>{
    setIsLoading(true)
    const {name, password, email, department, image, level} = data
    const filetype = image.split(".").pop();
    let file = {
      name: `photo.${filetype}`,
      type: `image/${filetype}`,
      uri: image
    };
    let formData = new FormData()
    formData.append('image', file)
    formData.append("name", name);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("department", department);
    formData.append('level', level)
    fetch('http://192.168.43.31:3000/create',{
      method: 'POST',
      body: formData,
      headers:{
        'Accept' :'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }).then(data => data.json().then(async credentials =>{
      await AsyncStorage.setItem('assistant-user-data', JSON.stringify(credentials))
      setIsLoading(false)
      props.navigation.navigate('Index')
    }))
  }

  useEffect(() => {
    validateData();
  }, [data, target]);

  useEffect(() => {
    validateData();
    switch (index) {
      case 0:
        setQuestion("What's your name?");
        setPlaceholder("e.g Mike Osborne");
        setTarget("name");
        break;
        case 1:
          setQuestion("Your email address?");
          setPlaceholder("e.g mediocre@gmail.com");
          setTarget("email");
          break;
          case 2:
            setQuestion("Type in a password");
            setPlaceholder("e.g 12345");
            setTarget("password");
            break;
      case 3:
        setQuestion("What's your department?");
        setPlaceholder("e.g Computer Engineering");
        setTarget("department");
        break;
      case 4:
        setQuestion("What's your level?");
        setPlaceholder("e.g 300");
        setTarget("level");
        break;
      case 5:
        showImage();
        setTarget("image");
        break;
    }
  }, [index]);
  return (
    <KeyboardAvoidingView enabled behavior="padding" style={styles.container}>
      <LoadingModal visible={isLoading} />
      {visible ? (
        <ChooseImage uri={data.image} selectImage={selectImage} />
      ) : (
        <Form
          question={question}
          placeholder={placeholder}
          target={target}
          getFormData={getFormData}
        />
      )}

      <View style={styles.actionBtn}>
      <TouchableRipple
        onPress={() => {
         props.navigation.navigate('Login')
        }}
        rippleColor="rgba(255, 255, 255, 0.5)"
        style={[
          styles.proceedBtn,
          { backgroundColor: 'transparent' }
        ]}
      >
        <Text style={[styles.proceedBtnText, {color: 'white'}]}>ALREADY HAVE AN ACCOUNT</Text>
      </TouchableRipple>

      <TouchableRipple
        onPress={() => {
          if (!disableBtn) {
            let i = index + 1;
            if (i < 6) {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                setIndex(i);
              }, 1000);
            } else {
              sendData()
            }
          }
        }}
        rippleColor="rgba(76, 139, 245, 0.5)"
        style={[
          styles.proceedBtn,
          { backgroundColor: disableBtn ? "rgba(255,255,255,0.5)" : "#fff" }
        ]}
      >
        <Text style={styles.proceedBtnText}>NEXT</Text>
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
  form: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    height: 100
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff"
  },
  prompt: {
    fontFamily: "normal-default",
    fontSize: 20,
    textAlign: "center"
  },
  textInputHolder: {
    flex: 1
  },
  textInput: {
    textAlignVertical: "center",
    height: "100%"
  },
  actionBtn:{
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10
  },
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
  chooseImageBtn: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginVertical: 10
  },
  chooseImageHolder: {
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Welcome;
