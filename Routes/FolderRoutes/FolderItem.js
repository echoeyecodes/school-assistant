import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  RefreshControl
} from "react-native";
import { Appbar, FAB, ActivityIndicator } from "react-native-paper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from 'expo-constants'

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

const UploadingImages = () => {
  return (
    <View style={styles.uploadingImagesItem}>
      <View style={[styles.thumbnailHolder, {justifyContent: 'center',alignItems: 'center'}]}>
      <MaterialIcons name="image" color="#de5246" size={28} />
      </View>
      <View style={styles.uploadingImageDesc}>
        <Text style={styles.uploadingImageFileName}>
          Photo12dfre43fdsfsd.jpg
        </Text>
        <Text style={styles.uploadingImageTimeStamp}>Dec. 12</Text>
      </View>
      <ActivityIndicator
        style={styles.activityIndicator}
        color="#4c8bf5"
        size="small"
      />
    </View>
  );
};

const UploadedImages =({uri, filename}) =>{
  const first = uri.split('upload').shift()
  const last = uri.split('upload').pop()
  const compressedUrl = `${first}/upload/q_auto:low/${last}`

  return(
  <View style={[styles.uploadingImagesItem, {opacity: 1}]}>
    <View style={styles.thumbnailHolder}>
    <Image style={styles.thumbnail} source={{uri: compressedUrl}} />
    </View>
    <View style={[styles.uploadingImageDesc,{marginHorizontal: 10}]}>
        <Text style={styles.uploadingImageFileName}>
          {filename}
        </Text>
        <Text style={styles.uploadingImageTimeStamp}>Dec. 12</Text>
      </View>

      <View style={styles.moreBtn}>
        <Ionicons name='md-more' size={28} color='black' />
      </View>
  </View>
  )
}

const FolderItem = props => {
  const appBarTitle = props.navigation.getParam("context", null);
  const [refreshing, setRefreshing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState([]);
  const [images, setImages] = useState([]);
  const cache = useRef(null)

  const getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
  };

  const pickImage = () => {
    getPermissionAsync().then(async data => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true
      });
      if (!result.cancelled) {
        const updatedResult = Object.assign(
          {
            uid:
              new Date().getMilliseconds() +
              Math.floor(Math.random() * 178) * 60 * 60 * 24
          }, result
        );
        const newImages = [...images, updatedResult];
        cache.current = [...newImages]
        setImages(newImages);

        let uri = updatedResult.uri
        const filetype = uri.split('.').pop()
        let formData = new FormData()

        let file = {
          name: `photo.${filetype}`,
          type: `image/${filetype}`,
          uri
        }
        formData.append('image', file)
        formData.append('uid', updatedResult.uid)
        formData.append('folderName', appBarTitle)
        fetch('http://192.168.43.31:3000/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => res.json().then(data => {
          const exists = cache.current.find(item => item.uid === parseInt(data.uid))
          cache.current.splice(cache.current.indexOf(exists.uid.toString(), 1))
          const newData = [...cache.current]
          setImages(newData)

          fetch(`http://192.168.43.31:3000/media/${appBarTitle}/${data.id}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).then(result => result.json().then(data => {
            const uploadedItems = [...uploadedImage, data]
            setUploadedImage(uploadedItems)
          }))
        })).catch(error => console.log(error))
      }
    });
  };

  const getImages =() =>{
    setRefreshing(true)
    fetch(`http://192.168.43.31:3000/folder/${appBarTitle}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json().then(data =>{
      const uploadedItems = [...data.data]
      setUploadedImage(uploadedItems)
      setRefreshing(false)
    }))
  }

  const refresh =() =>{
    getImages()
  }

  useEffect(() => {
    getImages()
  }, []);

  return (
    <View style={styles.container}>
      <TopBar {...props} title={appBarTitle} />
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }>
      <View style={styles.uploadingImagesContainer}>
        {images.length > 0 ? (
          <Text style={{ color: "rgba(0,0,0,0.5)", fontSize: 16 }}>
            Uploading
          </Text>
        ) : null}
        {images.map((item, index) => (
          <UploadingImages key={index} />
        ))}
      </View>

      <View style={[styles.uploadingImagesContainer, {marginVertical: 10}]}>
      {uploadedImage.map((item, index) =>{
        return(
        <UploadedImages key={item.id} uri={item.data.url} filename={item.data.filename} />
        )
      })}
      </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        color="#fff"
        icon="plus"
        onPress={() => pickImage()}
      />
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
    fontFamily: "atlas",
    marginLeft: 20
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#4c8bf5"
  },
  uploadingImagesItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 5,
    opacity: 0.5
  },
  uploadingImageDesc: {
    marginLeft: "auto",
    flex: 1
  },
  activityIndicator: {
    marginLeft: "auto"
  },
  uploadingImageTimeStamp: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 12
  },
  uploadingImagesContainer: {
    marginHorizontal: 10
  },
  uploadingImageFileName: {
    fontFamily: "normal-default",
    fontSize: 16
  },
  thumbnailHolder:{
    width: 80,
    height: 80,
    borderRadius: 5
  },
  thumbnail:{
    width: null,
    height: null,
    flex: 1,
    borderRadius: 5
  },
  moreBtn:{
    marginLeft: 'auto',
  }
});

export default FolderItem;
