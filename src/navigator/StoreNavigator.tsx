import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import StoreHistoryScreen from '@src/screens/Store/StoreHistoryScreen';
import StoreScreen from '@src/screens/Store/StoreScreen';
import Colors from '@src/Colors';

const Stack = createStackNavigator();

const StoreNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="StoreScreen">
      <Stack.Screen
        name="StoreScreen"
        component={StoreScreen}
        options={{
          headerTintColor: Colors.text.accent,
          headerShadowVisible: false,
          title: '스토어',
        }}
      />
      <Stack.Screen
        name="StoreHistoryScreen"
        component={StoreHistoryScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StoreNavigator;
