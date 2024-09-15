// SignUpScreen.tsx
import React,{useState} from "react";
import { View,Text, TextInput,TouchableOpacity,StyleSheet, KeyboardAvoidingView, Platform} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import axios from "axios";

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUpScreen({navigation}:SignUpScreenProps){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const isFormFilled = username!=="" && password!=="";

    const API_URL = "http://3.37.163.236:8000/"


    const handleNext = async (username: string, password: string) => {
        const userData = {
            username: username,
            first_name: 'youjin',
            last_name: 'kim',
            email: 'zinzinyou@naver.com', // 변수로 앞에서 넘겨주기
            password: password,
            group: 'test'    
        }

        try{
            const response = await axios.post(`${API_URL}/student/signup/`, userData);
            console.log(response.status);
            if(response.status==200){
                navigation.navigate('RegisterInfo');
            }

        } catch(e){
            console.error(e);
        }
    }

    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={{alignSelf:"flex-start",marginLeft:40,marginBottom:30}}>
                <Text style={styles.largeText}>회원가입</Text>
            </View>

            <TextInput 
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="아이디"
                autoCapitalize="none"
            />
            
            <TextInput 
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="패스워드"
                autoCapitalize="none"
            />

    

            <TouchableOpacity 
                style={isFormFilled?styles.largeBtnActive:styles.largeBtnInactive}
                onPress={() => handleNext(username, password)}>
                <Text style={styles.largeBtnText}>다음</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 130,
        backgroundColor: 'white',
    },
    input: {
        borderColor:'#E7E7E7',
        borderWidth:1,
        margin:10,
        padding:10,
        width:320,
        height:40,
        borderRadius:10  
    },
    smallBtn: {
        backgroundColor:'#F4F4F4',
        padding:3,
        borderRadius:49,
        width:76,
        height:29,
        paddingHorizontal:12,
        paddingVertical:6
    },
    smallBtnText: {
        textAlign:"center",
        fontSize:14,
        color:"#3D3D3D"
    },
    smallText: {
        fontSize:14,
        color:"#3D3D3D",
        textAlign:"left",
        marginLeft: 6
    },
    verifiedSmallText: {
        fontSize:14,
        color:"#96DE69",
        textAlign:"left"
    },
    largeBtnInactive: {
        backgroundColor:'#EEEEEE',
        marginTop:25,
        padding:5,
        width:320,
        height:48,
        borderRadius:10,
        justifyContent:"center"
    },
    largeBtnActive: {
        backgroundColor:'#FCA0CC',
        marginTop:25,
        padding:5,
        width:320,
        height:48,
        borderRadius:10,
        justifyContent:"center"
    },
    largeBtnText: {
        color:'black',
        textAlign:'center',
        fontSize:18
    },
    largeText: {
        fontSize:24,
        fontWeight:"600"
    },
})
