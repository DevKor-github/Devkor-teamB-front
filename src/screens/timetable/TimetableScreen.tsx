// TimetableScreen.tsx
import React from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import WeeklyTimetable from '../WeeklyTimetable.tsx';
import {mockLectures} from '../../MockUserData.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CommunityScreen from '../community/CommunityScreen.tsx';
import PostScreen from "../community/PostScreen.tsx";

const Stack = createNativeStackNavigator();

const style = StyleSheet.create({
  bg: {
    margin: 12,
  },
});

function WeeklyTimetableScreen() {
  return (
    <SafeAreaView style={{flex: 1, margin: 8}}>
      <View
        style={{
          backgroundColor: 'darkgray',
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            overflow: 'hidden',
          }}>
          <TouchableOpacity
            style={{
              width: 84,
              padding: 12,
              backgroundColor: 'lightgray',
            }}>
            <Text style={{textAlign: 'center'}}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: 84, padding: 12, backgroundColor: 'darkgray'}}>
            <Text style={{textAlign: 'center'}}>Weekly</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={style.bg}>
            <WeeklyTimetable lectures={mockLectures} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function TimetableScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WeeklyTimetable"
        component={WeeklyTimetableScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CommunityScreen"
        component={CommunityScreen}
        options={({route}: {route: any}) => ({
          title: route.params.name,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default TimetableScreen;
