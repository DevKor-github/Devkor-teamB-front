// TopTabNavigator.tsx
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// Screens
import DailyTimetableScreen from '../screens/Timetable/DailyTimetableScreen';
import WeeklyTimetableScreen from '../component/Timetable';
import {Schedule} from '../screens/Timetable/TimetableTypes';

export type TabNavigatorParamList = {
  DailyTimetable: undefined;
  WeeklyTimetable: {lectures: Schedule};
};

const Tab = createMaterialTopTabNavigator<TabNavigatorParamList>();

function TopNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="DailyTimetable"
        component={DailyTimetableScreen}
        options={{title: 'Daily'}}
      />
      <Tab.Screen
        name="WeeklyTimetable"
        component={WeeklyTimetableScreen} // 얘 왜이러냐..
        options={{title: 'Weekly'}}
      />
    </Tab.Navigator>
  );
}

export default TopNavigator;
