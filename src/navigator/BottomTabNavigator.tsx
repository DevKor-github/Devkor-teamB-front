// BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Octicon from 'react-native-vector-icons/Octicons';

// Screens
import StoreScreen from '../screens/StoreScreen';
import TimetableHomeScreen from '../screens/Timetable/TimetableHomeScreen';
import MyPageScreen from '../screens/MyPageScreen';

export type BottomTabNavigatorParamList = {
    Store: undefined;
    Timetable: undefined;
    Mypage: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabNavigatorParamList>();

function BottomNavigator() {
    return (
        <BottomTab.Navigator 
            initialRouteName='Timetable'
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    if (route.name === 'Store') {
                        return <MaterialIcon name="store" size={30} color={color} />;
                    } else if (route.name === 'Timetable') {
                        return <Octicon name="table" size={20} color={color} />;
                    } else if (route.name === 'Mypage') {
                        return <MaterialIcon name="person" size={30} color={color} />;
                    }
                },
                tabBarActiveTintColor: '#FF1485',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFAFC',
                },
                tabBarLabelStyle: {
                    fontSize: 12
                }
            })}
        >
            <BottomTab.Screen 
                name="Store" 
                component={StoreScreen} 
                options={{ title: '스토어' }}
            />
            <BottomTab.Screen 
                name="Timetable" 
                component={TimetableHomeScreen} 
                options={{ title: '시간표' }}
            />
            <BottomTab.Screen 
                name="Mypage" 
                component={MyPageScreen} 
                options={{ title: '마이페이지' }}
            />
        </BottomTab.Navigator>
    );
} 

export default BottomNavigator;
