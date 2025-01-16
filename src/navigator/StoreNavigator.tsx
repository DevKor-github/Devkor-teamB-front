import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import StoreHistoryScreen from '@src/screens/Store/StoreHistoryScreen';
import StoreScreen from '@src/screens/Store/StoreScreen';
import Colors from '@src/Colors';

const Stack = createStackNavigator();

const StoreNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Store">
      <Stack.Screen
        name="Store"
        component={StoreScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="StoreHistory"
        component={StoreHistoryScreen}
        options={{
          title: '포인트 내역',
          headerBackTitleVisible: false,
          headerTintColor: Colors.text.accent,
        }}
      />
    </Stack.Navigator>
  );
};

export default StoreNavigator;
