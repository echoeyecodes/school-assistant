import React, { useState, useEffect, useContext } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import Home from "./bottom-tab-routes/Home";
import Assignments from "./bottom-tab-routes/Assignments";
import Vault from "./bottom-tab-routes/Vault";
import CreateClass from "./Routes/CreateClass";
import CreateAssignment from "./Routes/CreateAssignment";
import FolderItem from "./Routes/FolderRoutes/FolderItem";
import AllClasses from "./Routes/AllClasses";
import Notifications from "./bottom-tab-routes/Notifications";
import Welcome from './Routes/Welcome'
import Login from './Routes/Login'
import Settings from './Routes/Settings'
import SplashScreen from './Routes/SplashScreen'
import CustomDrawerComponent from './DrawerComponent/CustomDrawerComponent'
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Provider, ThemeProvider } from "react-native-paper";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator, MaterialTopTabBar } from "react-navigation-tabs";
import { createDrawerNavigator } from "react-navigation-drawer";
import Topbar from "./bottom-tab-header/bottom-tab-header";
import {ThemeContext, themes} from './context/ThemeContext'

export default function App(props) {
  const [isReady, setIsReady] = useState(false);
  const AppContainer = createAppContainer(switchNavigator);
  const [themeState, setThemeState] = useState(true)


  const toggleTheme = () =>{
    if(themeState){
      setThemeState(false)
    }else{
      setThemeState(true)
    }
  }

  useEffect(() =>{

  }, [])


  return isReady ? (
    <Provider>
      <ThemeContext.Provider value={{theme: themeState ? themes.light : themes.dark, toggleTheme: () => toggleTheme() }}>
      <AppContainer theme={themeState ? 'light' : 'dark'} />
      </ThemeContext.Provider>
    </Provider>
  ) : (
    <AppLoading
      startAsync={loadAssetsAsync}
      onFinish={() => setIsReady(true)}
      onError={console.warn}
    />
  );
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

async function loadAssetsAsync() {
  const imageAssets = cacheImages([
    require("./assets/man.jpg"),
    require("./assets/empty_task.png"),
    require("./assets/empty_assignments.png")
  ]);
  const fontAssets = cacheFonts([
    {
      curative: require("./assets/fonts/odibee.ttf"),
      atlas: require("./assets/fonts/atlas.ttf"),
      lob: require("./assets/fonts/lob.ttf"),
      congrat: require("./assets/fonts/congrat.ttf"),
      title: require("./assets/fonts/title.ttf"),
      "normal-default": require("./assets/fonts/normal.ttf"),
      "gochi-hand": require("./assets/fonts/gochi-hand.ttf"),
      alata: require("./assets/fonts/alata.ttf")
    }
  ]);

  await Promise.all([...imageAssets, ...fontAssets]);
}

const ThemedTopBar  =(props) => {
  const {theme} = useContext(ThemeContext)
  return(
        <MaterialTopTabBar
        {...props}
        style={{
          backgroundColor: theme.backgroundColor,
          elevation: 0
        }}
        />
  )
}

const tabNavigator = createMaterialTopTabNavigator(
  {
    Classes: {
      screen: Home
    },
    Assignments: {
      screen: Assignments
    }
  },
  {
    tabBarComponent: ThemedTopBar,
    tabBarOptions: {
      activeTintColor: "#fff",
      inactiveTintColor: "#4c8bf5",
      indicatorStyle: {
        borderRadius: 50,
        backgroundColor: "#4c8bf5",
        top: 0,
        height: "100%"
      },
      labelStyle: {
        fontFamily: "normal-default"
      },
      style: {
        backgroundColor: "white",
        paddingHorizontal: 5,
        elevation: 0
      }
    }
  }
);

const bottomNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: tabNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="home" color={tintColor} size={24} />
        )
      }
    },
    Notifications: {
      screen: Notifications,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-notifications" color={tintColor} size={24} />
        )
      }
    },
    Vault: {
      screen: Vault,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="storage" color={tintColor} size={24} />
        )
      }
    }
  },
  {
    activeColor: "#4c8bf5",
    inactiveColorLight: "rgba(0,0,0,0.5)",
    inactiveColorDark: 'rgba(255,255,255,0.7)',
    barStyleLight:{
    backgroundColor: 'white'
    },
    barStyleDark: {
      backgroundColor: 'black'
    },
    barStyle: {
      backgroundColor: "white"
    },
    sceneAnimationEnabled: true
  }
);

const stackNavigator = createStackNavigator(
  {
    Index: {
      screen: bottomNavigator,
      navigationOptions: {
        header: (props) => {
          return <Topbar {...props} />;
        }
      }
    },
    FolderItem: {
      screen: FolderItem
    },
    CreateClass: {
      screen: CreateClass
    },
    CreateAssignment: {
      screen: CreateAssignment
    },
    AllClasses: {
      screen: AllClasses
    },
    Settings:{
      screen: Settings
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        display: "none"
      }
    }
  }
);

const drawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: stackNavigator
    }
  },
  {
    contentComponent: () => <CustomDrawerComponent />
  }
);

const authStack = createStackNavigator({
  Welcome:{
    screen: Welcome
  },
  Login:{
    screen: Login
  }
},{
  defaultNavigationOptions:{
    headerStyle:{
      display: 'none'
    }
  }
})

const switchNavigator = createSwitchNavigator({
  SplashScreen: SplashScreen,
  App: drawerNavigator,
  Auth: authStack
}, {
  initialRouteName: 'SplashScreen'
})