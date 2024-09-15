import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Colors from '@src/Colors';
import BottomNavigator from '@navigator/BottomTabNavigator';
import CommunityScreen from '@screens/Community/CommunityScreen';
import PostScreen from '@screens/Post/PostScreen';
import PostCreationScreen from '@src/screens/Post/CreatePostScreen';
import PostEditScreen from '@src/screens/Post/EditPostScreen';
import BriefingScreen from '@src/screens/Briefing/BriefingScreen';
import PostListScreen from '@src/screens/Post/PostListScreen';
import {View} from 'react-native-animatable';
import {StyleSheet, Text} from 'react-native';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';

const Stack = createStackNavigator();

const setNavigationHeader = (navigation: any, param: [string, string]) => {
  navigation.setOptions({
    headerTitle: () => (
      <CustomHeaderTitle title={param[0]} subTitle={param[1]} />
    ),
  });
};

const CustomHeaderTitle = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
    </View>
  );
};

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
        options={{
          headerBackTitleVisible: false,
          headerTintColor: Colors.ui.primary,
        }}
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
          headerBackTitleVisible: false,
          headerTintColor: Colors.ui.primary,
        }}
      />
      <Stack.Screen
        name="PostEditScreen"
        component={PostEditScreen}
        options={{
          headerTitle: '게시물 수정',
          headerBackTitleVisible: false,
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

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
  },
  title: {
    color: Colors.text.accent,
    fontSize: FontSizes.large,
    textAlign: 'center',
    ...GlobalStyles.boldText,
  },
  subTitle: {
    marginTop: 2,
    color: Colors.text.gray,
    fontSize: FontSizes.small,
    textAlign: 'center',
    ...GlobalStyles.text,
  },
});

export {setNavigationHeader};
export default TimetableNavigator;
