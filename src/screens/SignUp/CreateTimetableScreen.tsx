// EmailScreen.tsx
import React,{useState} from "react";
import { View,Text, TextInput,TouchableOpacity,StyleSheet, KeyboardAvoidingView, Platform} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type CreateTimetableScreenProps = NativeStackScreenProps<RootStackParamList,"CreateTimetable">

function CreateTimetableScreen({navigation}:CreateTimetableScreenProps){

    return(
        <View>
            <Text>시간표 등록 화면</Text>
        </View>
    )
}

export default CreateTimetableScreen
