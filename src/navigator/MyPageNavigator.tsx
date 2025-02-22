import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import MyPageScreen from '@src/screens/MyPage/MyPageScreen';
import ChangePasswordScreen from '@src/screens/MyPage/ChangePasswordScreen';
import MyCommentScreen from '@src/screens/MyPage/MyCommentScreen';
import MyPostScreen from '@src/screens/MyPage/MyPostScreen';
import Colors from '@src/Colors';
import MyScrapScreen from '@src/screens/MyPage/MyScrapScreen';
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
      <Stack.Screen 
        name="MyComment" 
        component={MyCommentScreen} 
        options={{
          title: "내가 쓴 댓글",
          headerBackTitleVisible: false,
          headerTintColor: Colors.ui.primary
        }}
      />
      <Stack.Screen 
        name="MyPost" 
        component={MyPostScreen} 
        options={{
          title: "내가 쓴 게시물",
          headerBackTitleVisible: false,
          headerTintColor: Colors.ui.primary
        }}
      />
      <Stack.Screen 
        name="MyScrap" 
        component={MyScrapScreen} 
        options={{
          title: "내가 스크랩한 게시물",
          headerBackTitleVisible: false,
          headerTintColor: Colors.ui.primary
        }}
      />
    </Stack.Navigator>
  );
};

export default MyPageNavigator;
