import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import MyPageScreen from '@src/screens/MyPage/MyPageScreen';
import ChangePasswordScreen from '@src/screens/MyPage/ChangePasswordScreen';
import MyCommentScreen from '@src/screens/MyPage/MyCommentScreen';
import MyPostScreen from '@src/screens/MyPage/MyPostScreen';
const Stack = createStackNavigator();

const MyPageNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MyPage">
      <Stack.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="MyComment" component={MyCommentScreen} />
      <Stack.Screen name="MyPost" component={MyPostScreen} />
    </Stack.Navigator>
  );
};

export default MyPageNavigator;
