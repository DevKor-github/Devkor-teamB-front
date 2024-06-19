// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Screens
import TimetableScreen from './screens/timetable/TimetableScreen.tsx';
import LoginScreen from './screens/LoginScreen';

export type RootStackParamList = {
  Home: undefined;
  TodayTimetable: undefined;
  Timetable: undefined;
  Login: undefined;
};

export type TabNavigatorParamList = {
  TodayTimetable: undefined;
  Timetable: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabNavigatorParamList>();

function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Timetable"
        options={{title: '시간표'}}
        component={TimetableScreen}
      />
    </Tab.Navigator>
  );
}

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Login">
        <RootStack.Screen name="Login" component={LoginScreen} />
        {/*<RootStack.Screen name="Home" component={HomeScreen} />*/}
        <RootStack.Screen
          name="Home"
          component={BottomTab}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
