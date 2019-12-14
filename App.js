import React, {useState} from 'react';
import {createAppContainer} from 'react-navigation'
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'
import Home from './bottom-tab-routes/Home'
import Assignments from './bottom-tab-routes/Assignments'
import Vault from './bottom-tab-routes/Vault'
import FolderItem from './Routes/FolderRoutes/FolderItem'
import Notifications from './bottom-tab-routes/Notifications'
import {FontAwesome, MaterialIcons, Ionicons} from '@expo/vector-icons'
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import {Provider} from 'react-native-paper'
import { createStackNavigator } from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import Topbar from './bottom-tab-header/bottom-tab-header'
export default function App(props) {
  const [isReady, setIsReady] = useState(false)
  const AppContainer = createAppContainer(stackNavigator)
    return (
      isReady ? 
      <Provider>
     <AppContainer hello= 'world' />
     </Provider>
     : 
     <AppLoading
     startAsync={loadAssetsAsync}
     onFinish={() => setIsReady(true)}
     onError={console.warn}
   />
  )
}


function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
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
    require('./assets/man.jpg'),
    require('./assets/empty_task.png'),
    require('./assets/empty_assignments.png'),
  ]);
  const fontAssets = cacheFonts([{
    'curative': require('./assets/fonts/odibee.ttf'),
    'atlas': require('./assets/fonts/atlas.ttf'),
    'lob': require('./assets/fonts/lob.ttf'),
    'congrat': require('./assets/fonts/congrat.ttf'),
    'title': require('./assets/fonts/title.ttf'),
    'normal-default': require('./assets/fonts/normal.ttf'),
    'gochi-hand': require('./assets/fonts/gochi-hand.ttf'),
    'alata': require('./assets/fonts/alata.ttf')
  }]);

  await Promise.all([...imageAssets, ...fontAssets]);
}

const tabNavigator = createMaterialTopTabNavigator({
  Classes:{
    screen: Home
  },
  Assignments:{
    screen: Assignments
  }
}, {
  tabBarOptions:{
    activeTintColor: '#4c8bf5',
    inactiveTintColor: 'rgba(0,0,0,0.5)',
    indicatorStyle:{
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      backgroundColor: '#4c8bf5',
    },
    labelStyle:{
      fontFamily: 'normal-default',
    },
    style:{
      backgroundColor: 'white',
    },
  }
})

const bottomNavigator = createMaterialBottomTabNavigator({
  Home:{
    screen: tabNavigator,
    navigationOptions:{
      tabBarIcon: ({tintColor}) => <FontAwesome name='home' color={tintColor} size={24}/>,
    }
  },
  Notifications:{
    screen: Notifications,
    navigationOptions:{
      tabBarIcon: ({tintColor}) => <Ionicons name='md-notifications' color={tintColor} size={24} />
    }
  },
  Vault:{
    screen: Vault,
    navigationOptions:{
      tabBarIcon: ({tintColor}) => <MaterialIcons name='storage' color={tintColor} size={24} />
    }
  },
}, {
  initialRouteName:'Vault',
  activeColor:'#4c8bf5',
  inactiveColor: 'rgba(0,0,0,0.5)',
  barStyle:{
    backgroundColor: 'white',
  },
  sceneAnimationEnabled: true
})


const stackNavigator = createStackNavigator({
  Index:{
    screen: bottomNavigator,
    navigationOptions:{
      header: ({hello}) => {
        return <Topbar hello={hello} />
      }
    }
  },
  FolderItem:{
    screen: FolderItem
  }
},{
  defaultNavigationOptions:{
    headerStyle:{
      display: 'none'
    }
  }
})
