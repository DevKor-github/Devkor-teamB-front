// LoginScreen.tsx
import React,{useState} from "react";
import { View,Button,Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList,"Login">

function LoginScreen({navigation}:LoginScreenProps){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const isFormFilled = (username!=="") && (password!=="");

    return(
        <View style={{flex: 1,alignItems:"center",justifyContent:"center",backgroundColor:'white'}}>
            <View style={{backgroundColor: 'darkgray', width:70,height:70,marginBottom:200}} />
            <TextInput 
                style={{height:40,borderWidth:1,borderColor:'#EEEEEE',margin:5,padding:10,width:320,borderRadius:10}}
                onChangeText={setUsername}
                value={username}
                placeholder="아이디"
            />
            <TextInput 
                style={{height:40,borderWidth:1,borderColor:'#EEEEEE',margin:5,padding:10,width:320,borderRadius:10}}
                onChangeText={setPassword}
                value={password}
                placeholder="비밀번호"
            />
            <TouchableOpacity 
                style={{backgroundColor:'#FDBFDD',marginTop:25,padding:5,width:320,height:40,borderRadius:10,justifyContent:"center"}} 
                onPress={() => navigation.navigate('Home')}>
                <Text style={{color:'black',textAlign:'center',fontWeight:'600',fontSize:18}}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{marginTop:5,width:320} }
                onPress={() => navigation.navigate('Email')}>
                <Text style={{color:'black',textAlign:'center',fontSize:12}}>회원가입</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen