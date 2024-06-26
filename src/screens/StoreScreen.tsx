// StoreScreen.tsx
import React from "react";
import {View,Button,Text} from 'react-native'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabNavigatorParamList } from "../navigator/BottomTabNavigator";

type StoreScreenProps = NativeStackScreenProps<BottomTabNavigatorParamList,"Store">


function StoreScreen({navigation}:StoreScreenProps){
    return (
        <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
            <Text>스토어화면</Text>
        </View>
    );
};

export default StoreScreen