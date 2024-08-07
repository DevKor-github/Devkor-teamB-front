import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Colors from '@src/Colors';
import BottomNavigator from '@navigator/BottomTabNavigator';
import CommunityScreen from '@screens/Community/CommunityScreen';
import PostScreen from '@screens/Post/PostScreen';
import PostCreationScreen from '@src/screens/Post/CreatePostScreen';
import BriefingScreen from '@src/screens/Briefing/BriefingScreen';
import PostListScreen from '@src/screens/Post/PostListScreen';

const Stack = createStackNavigator();

const TimetableNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="BottomNavigator">
      <Stack.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Community"
        component={CommunityScreen}
        options={({route}: {route: any}) => ({
          title: `${route.params.name}`,
          headerBackTitleVisible: false,
          headerTintColor: Colors.ui.primary,
        })}
      />
      <Stack.Screen
        name="PostScreen"
        component={PostScreen}
        options={({route}: {route: any}) => ({
          title: `${route.params.lectureName}`,
          headerBackTitleVisible: false,
          headerTintColor: Colors.ui.primary,
        })}
      />
      <Stack.Screen
        name="PostCreationScreen"
        component={PostCreationScreen}
        options={{
          headerTitle: '게시물 작성',
          headerTintColor: Colors.ui.primary,
        }}
      />
      <Stack.Screen 
        name="BriefingScreen"
        component={BriefingScreen}
        options={({route}: {route: any}) => ({
          title: route.params.lectureName,
          headerBackTitleVisible: false,
          headerTintColor: Colors.ui.primary,
        })}
      />
      <Stack.Screen 
        name="PostListScreen"
        component={PostListScreen}
        options={({route}: {route: any}) => ({
          title: route.params.lectureName,
          headerBackTitleVisible: false,
          headerTintColor: Colors.ui.primary,
        })}
      />
    </Stack.Navigator>
  );
};

export default TimetableNavigator;
