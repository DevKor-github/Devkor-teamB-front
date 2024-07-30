// BottomTabNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Screens
import StoreScreen from '@screens/StoreScreen';
import MyPageScreen from '@screens/MyPageScreen';
import TimetableScreen from '@screens/TimetableScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Colors from '@src/Colors';

export type BottomTabNavigatorParamList = {
  Store: undefined;
  Timetable: undefined;
  Mypage: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const getTabBarIcon = (route: any, color: string) => {
  switch (route.name) {
    case 'Store':
      return <MaterialIcons name="store" size={30} color={color} />;
    case 'Timetable':
      return <Octicons name="table" size={20} color={color} />;
    case 'Mypage':
      return <MaterialIcons name="person" size={30} color={color} />;
    default:
      return null;
  }
};

function BottomNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Timetable"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color}) => getTabBarIcon(route, color),
        tabBarActiveTintColor: Colors.ui.primary,
        tabBarInactiveTintColor: Colors.ui.disabled,
        tabBarStyle: {backgroundColor: Colors.ui.background},
        tabBarLabelStyle: {fontSize: 12},
      })}>
      <BottomTab.Screen
        name="Store"
        component={StoreScreen}
        options={{title: '스토어'}}
      />
      <BottomTab.Screen
        name="Timetable"
        component={TimetableScreen}
        options={{title: '시간표'}}
      />
      <BottomTab.Screen
        name="Mypage"
        component={MyPageScreen}
        options={{title: '마이페이지'}}
      />
    </BottomTab.Navigator>
  );
}

export default BottomNavigator;
