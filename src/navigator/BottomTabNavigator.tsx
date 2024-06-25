// BototmTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import StoreScreen from '../screens/StoreScreen';
import TimetableHomeScreen from '../screens/Timetable/TimetableHomeScreen';
import MyPageScreen from '../screens/MyPageScreen';

export type BottomTabNavigatorParamList={
    Store: undefined;
    Timetable: undefined;
    Mypage: undefined;
  };

const BottomTab = createBottomTabNavigator<BottomTabNavigatorParamList>();

function BottomNavigator(){
    return(
        <BottomTab.Navigator initialRouteName='Timetable'>
        <BottomTab.Screen 
            name="Store" 
            component={StoreScreen} 
            options={{title: '스토어',headerShown:false}}/>
        <BottomTab.Screen 
            name="Timetable" 
            component={TimetableHomeScreen} 
            options={{title: '시간표',headerShown:false}}/>
        <BottomTab.Screen 
            name="Mypage" 
            component={MyPageScreen} 
            options={{title: '마이페이지',headerShown:false}}/>
        </BottomTab.Navigator>
    );
} 

export default BottomNavigator