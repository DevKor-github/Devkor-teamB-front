// HomeScreen.tsx
import React from "react";
import {View,Button,Text} from 'react-native'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../App';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList,"Home">


function HomeScreen({navigation}:HomeScreenProps){
    return (
        <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
            <Text>홈화면</Text>
            <Button 
                title="오늘의 시간표 페이지"
                onPress={()=>navigation.navigate('TodayTimetable')}
            />
            <Button 
                title="전체 시간표 페이지"
                onPress={()=>navigation.navigate('Timetable')}
            />
        </View>
    );
};

export default HomeScreen