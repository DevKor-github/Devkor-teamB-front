// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import HomeScreen from './screens/HomeScreen';
import TodayTimetableScreen from './screens/TodayTimetableScreen';
import TimetableScreen from './screens/TimetableScreen';
import LoginScreen from './screens/LoginScreen';


export type RootStackParamList={
  Home: undefined;
  TodayTimetable: undefined;
  Timetable: undefined;
  Login: undefined;
};

export type TabNavigatorParamList={
    TodayTimetable: undefined;
    Timetable: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabNavigatorParamList>();

function BottomTab(){
  return(
    <Tab.Navigator>
      <Tab.Screen name="TodayTimetable" component={TodayTimetableScreen} />
      <Tab.Screen name="Timetable" component={TimetableScreen} />
    </Tab.Navigator>
  );
}


const App: React.FC=()=>{
  return(
    <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen name="Login" component={LoginScreen} />
          {/* <RootStack.Screen name="Home" component={HomeScreen} />  */}
          <RootStack.Screen
            name="Home"
            component={BottomTab}
            options={{headerShown:false}}
          />
        </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;