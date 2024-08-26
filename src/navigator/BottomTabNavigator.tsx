// BottomTabNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Screens
import MyPageScreen from '@screens/MyPageScreen';
import Colors from '@src/Colors';
import StoreNavigator from '@src/navigator/StoreNavigator';
import {Image} from 'react-native-animatable';
import {StyleSheet} from 'react-native';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';
import TimetableNavigator from '@src/navigator/TimetableNavigator';

export type BottomTabNavigatorParamList = {
  StoreNavigator: undefined;
  TimetableNavigator: undefined;
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
    case 'TimetableNavigator':
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
      initialRouteName="TimetableNavigator"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused}) => getTabBarIcon(route, focused),
        tabBarActiveTintColor: Colors.ui.primary,
        tabBarInactiveTintColor: Colors.ui.disabled,
        tabBarStyle: getTabBarStyle(route),
        tabBarLabelStyle: {fontSize: 12},
      })}>
      <BottomTab.Screen
        name="StoreNavigator"
        component={StoreNavigator}
        options={{title: '스토어'}}
      />
      <BottomTab.Screen
        name="TimetableNavigator"
        component={TimetableNavigator}
        options={({route}) => ({
          title: '시간표',
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <BottomTab.Screen
        name="Mypage"
        component={MyPageScreen}
        options={{title: '마이페이지'}}
      />
    </BottomTab.Navigator>
  );
}

const getTabBarStyle: any = (
  route: RouteProp<
    BottomTabNavigatorParamList,
    keyof BottomTabNavigatorParamList
  >,
) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  const targetScreens = [
    'StoreHistoryScreen',
    'Community',
    'PostScreen',
    'PostCreationScreen',
    'BriefingScreen',
    'PostListScreen',
  ];
  if (targetScreens.find(name => routeName === name)) {
    return {display: 'none'};
  }
  return {backgroundColor: Colors.ui.background};
};

export default BottomNavigator;
