// // DailyTimetableScreen.tsx
// import React from "react";
// import {View,Text} from 'react-native'
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { TabNavigatorParamList } from "../../navigator/TopTabNavigator";

// type DailyTimetableScreenProps = NativeStackScreenProps<TabNavigatorParamList,"DailyTimetable">

// function DailyTimetableScreen({navigation}:DailyTimetableScreenProps){
//     return (
//         <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
//             <Text>오늘의 시간표 페이지입니당</Text>
//         </View>
//     );
// };

// export default DailyTimetableScreen;

// DailyTimetable.tsx
import React from 'react';
import {View, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App.tsx';

function DailyTimetable() {
  return (
    <View>
      <Text>Daily</Text>
    </View>
  );
}

export default DailyTimetable;