// MyPageScreen.tsx
import React from "react";
import {View,Button,Text} from 'react-native'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabNavigatorParamList } from "../navigator/BottomTabNavigator";


type MyPageScreenProps = NativeStackScreenProps<BottomTabNavigatorParamList,"Mypage">


function MyPageScreen({navigation}:MyPageScreenProps){
    return (
        <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
            <Text>마이페이지</Text>
        </View>
    );
};

export default MyPageScreen