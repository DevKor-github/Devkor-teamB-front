// BottomTabNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Screens
import MyPageScreen from '@screens/MyPageScreen';
import TimetableScreen from '@screens/TimetableScreen';
import Colors from '@src/Colors';
import StoreNavigator from '@src/navigator/StoreNavigator';
import {Image} from 'react-native-animatable';
import {StyleSheet} from 'react-native';

export type BottomTabNavigatorParamList = {
  StoreNavigator: undefined;
  Timetable: undefined;
  Mypage: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const style = StyleSheet.create({
  icon: {width: 20, height: 20},
});

const getTabBarIcon = (route: any, focused: boolean) => {
  switch (route.name) {
    case 'StoreNavigator':
      return (
        <Image
          source={
            focused
              ? require('@assets/icons/store_active.png')
              : require('@assets/icons/store_inactive.png')
          }
          style={style.icon}
        />
      );
    case 'Timetable':
      return (
        <Image
          source={
            focused
              ? require('@assets/icons/table_active.png')
              : require('@assets/icons/table_inactive.png')
          }
          style={style.icon}
        />
      );
    case 'Mypage':
      return (
        <Image
          source={
            focused
              ? require('@assets/icons/mypage_active.png')
              : require('@assets/icons/mypage_inactive.png')
          }
          style={style.icon}
        />
      );
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
        tabBarIcon: ({focused}) => getTabBarIcon(route, focused),
        tabBarActiveTintColor: Colors.ui.primary,
        tabBarInactiveTintColor: Colors.ui.disabled,
        tabBarStyle: {backgroundColor: Colors.ui.background},
        tabBarLabelStyle: {fontSize: 12},
      })}>
      <BottomTab.Screen
        name="StoreNavigator"
        component={StoreNavigator}
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
