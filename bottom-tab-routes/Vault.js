import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, ScrollView, RefreshControl } from "react-native";
import { Appbar, TouchableRipple, FAB } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import CreateModal from "../ModalComponents/CreateModal";
import CreateFolderModal from "../ModalComponents/CreateFolder";
import {ThemeContext} from '../context/ThemeContext'

const Folders = ({ title, openFolder }) => {
  const {theme} = useContext(ThemeContext)
  return (
    <TouchableRipple
      onPress={() => openFolder(title)}
      rippleColor="rgba(0,0,0,0.5)"
    >
      <View style={styles.folderItem}>
        <View style={styles.folderIconHolder}>
          <FontAwesome name="folder" color={theme.colorSecondary} size={30} />
        </View>
        <View style={styles.folderTitleHolder}>
          <Text style={[styles.folderTitle, {color: theme.colorPrimary}]}>{title}</Text>
        </View>
      </View>
    </TouchableRipple>
  );
};
const Vault = props => {
  const {theme} = useContext(ThemeContext)
  const [refreshing, setRefreshing] = useState(false)
  const [createModalShowing, setCreateModalShowing] = useState(false);
  const [createFolderModalShowing, setCreateFolderModalShowing] = useState(
    false
  );
  const [folders, setFolders] = useState([]);

  const enableCreateModal = () => {
    if (createModalShowing) {
      setCreateModalShowing(false);
      return;
    }
    setCreateModalShowing(true);
  };

  const disableCreateFolderModal = () => {
    setCreateFolderModalShowing(false);
  };

  const enableFolderModal = () => {
    setCreateModalShowing(false);
    setCreateFolderModalShowing(true);
  };

  const addFolder = value => {
    setCreateFolderModalShowing(false);
    const folderObj = value
    const newFolderItem = [...folders, folderObj];
    setFolders(newFolderItem);
  };

  const openFolder = title => {
    props.navigation.navigate("FolderItem", {
      context: title
    });
  };

  const getFolders =() =>{
    setRefreshing(true)
    fetch(`http://192.168.43.31:3000/folders`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json().then(data =>{
      const newFolderItem = [...data.data]
      setFolders(newFolderItem)
      setRefreshing(false)
    })).catch(error =>{
      setRefreshing(false)
      setFolders([])
    })
  }

  const refresh =() =>{
    getFolders()
  }

  useEffect(() =>{
   getFolders()

   return () =>{
     setRefreshing(false)
     setCreateFolderModalShowing(false)
     setCreateModalShowing(false)
     setFolders([])
   }
  }, [])
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <CreateFolderModal
        visible={createFolderModalShowing}
        addFolder={addFolder}
        disableCreateFolderModal={disableCreateFolderModal}
      />
      <CreateModal
        visible={createModalShowing}
        showCreateModal={enableCreateModal}
        showFolderCreateModal={enableFolderModal}
      />
        <ScrollView style={styles.folderHolder} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }>
        {folders.map((item, index) => (
          <Folders key={index} openFolder={openFolder} title={item} />
        ))}
        </ScrollView>
      <FAB
        style={styles.fab}
        color="#fff"
        icon="plus"
        onPress={() => enableCreateModal()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  folderItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    marginVertical: 5
  },
  folderIconHolder: {
    width: 30,
    height: 30
  },
  folderTitle: {
    fontSize: 18,
    fontFamily: "normal-default"
  },
  folderTitleHolder: {
    flex: 1,
    marginLeft: 10
  },
  folderHolder: {
    flex:1,
    marginHorizontal: 10,
    marginVertical: 10
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#4c8bf5"
  }
});

export default Vault;
