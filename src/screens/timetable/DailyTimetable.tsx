// DailyTimetable.tsx
import React from 'react';
import {View, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App.tsx';

type TodayTimetableScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TodayTimetable'
>;

function DailyTimetable({navigation}: TodayTimetableScreenProps) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>오늘의 시간표 페이지입니당</Text>
    </View>
  );
}

export default DailyTimetable;
