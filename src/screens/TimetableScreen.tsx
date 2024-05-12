// TimetableScreen.tsx
import React from "react";
import {View,Text} from 'react-native'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../App';

type TimetableScreenProps = NativeStackScreenProps<RootStackParamList,"Timetable">

function TimetableScreen({navigation}:TimetableScreenProps){
    return (
        <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
            <Text>전체시간표 페이지입니당</Text>
        </View>
    );
};

export default TimetableScreen;