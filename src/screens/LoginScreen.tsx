// LoginScreen.tsx
import React,{useState} from "react";
import { View,Button,Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Colors } from "react-native/Libraries/NewAppScreen";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList,"Login">

function LoginScreen({navigation}:LoginScreenProps){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    
    return(
        <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
            <View style={{backgroundColor: 'darkgray', width:70,height:70,marginBottom:200}} />
            <TextInput 
                style={{height:40,borderBlockColor:'gray',borderWidth:1,margin:5,padding:10,width:250,borderRadius:10}}
                onChangeText={setUsername}
                value={username}
                placeholder="아이디"
            />
            <TextInput 
                style={{borderBlockColor:'gray',borderWidth:1,margin:5,padding:10,width:250,height:40,borderRadius:10}}
                onChangeText={setPassword}
                value={password}
                placeholder="비밀번호"
            />
            <TouchableOpacity 
                style={{backgroundColor:'gray',marginTop:25,padding:5,width:250,height:40,borderRadius:10,justifyContent:"center"}} 
                onPress={() => navigation.navigate('Home')}>
                <Text style={{color:'black',textAlign:'center'}}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{marginTop:5,width:250} }
                onPress={() => navigation.navigate('Signup')}>
                <Text style={{color:'black',textAlign:'center'}}>회원가입</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen