// LoginScreen.tsx
import React from "react";
import { View,Button,Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList,"Login">

function LoginScreen({navigation}:LoginScreenProps){
    return(
        <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
            <Text>로그인화면</Text>
            <Button
                title="홈화면 가기"
                onPress={()=>navigation.navigate('Home')}
            />
        </View>
    )
}

export default LoginScreen