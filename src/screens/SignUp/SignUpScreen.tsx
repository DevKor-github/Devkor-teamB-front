// SignUpScreen.tsx
import React,{useState} from "react";
import { View,Button,Text, TextInput,TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList,"SignUp">

function SignUpScreen({navigation}:SignUpScreenProps){
    const [email, setEmail] = useState("");
    const [verificationNum,setVerficationNum] = useState("");
    const [showVerification, setShowVerification]=useState(false);
    
    return(
        <View style={{flex: 1,alignItems:"center",justifyContent:"center",backgroundColor:'white'}}>
            <View style={{alignSelf:"flex-start",marginLeft:40,marginBottom:30}}>
                <Text style={{fontSize:24,fontWeight:"600"}}>회원가입</Text>
            </View>

            <TextInput 
                style={{borderColor:'#E7E7E7',borderWidth:1,margin:10,padding:10,width:320,height:40,borderRadius:10}}
                onChangeText={setEmail}
                value={email}
                placeholder="학교 이메일"
            />
            
            <View style={{flexDirection:"row",justifyContent:"space-between",display:"flex"}}>
                <View style={{justifyContent:"space-between",paddingVertical:6}}>
                    <Text style={{fontSize:14,color:"#3D3D3D",textAlign:"left"}}>위 메일로 인증번호를 발송합니다</Text>
                </View>
                <TouchableOpacity
                    style={{backgroundColor:'#F4F4F4',padding:3,borderRadius:49,width:76,height:29,paddingHorizontal:12,paddingVertical:6}}
                    onPress={()=>setShowVerification(true)}>
                    <Text style={{textAlign:"center",fontSize:14,color:"#3D3D3D"}}>전송 요청</Text>
                </TouchableOpacity>
            </View>
            

            {showVerification && (
                <View>
                    <TextInput 
                        style={{borderBlockColor:'gray',borderWidth:1,margin:10,padding:10,width:250,height:40,borderRadius:10}}
                        onChangeText={setVerficationNum}
                        value={verificationNum}
                        placeholder="인증번호입력"
                    />
                    <View style={{flexDirection:"row"}}>
                        <View style={{alignSelf:"flex-start",marginRight:15,marginLeft:20}}>
                            <Text style={{fontSize:14}}>인증번호는 최대 10분동안 유효합니다</Text>
                        </View>
                        <TouchableOpacity
                            style={{backgroundColor:'lightgray',padding:3,width:50,borderRadius:5}}>
                            <Text style={{textAlign:"center",fontSize:10}}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <TouchableOpacity 
                style={{backgroundColor:'gray',marginTop:25,padding:5,width:320,height:45,borderRadius:10,justifyContent:"center"}} 
                onPress={() => navigation.navigate('Home')}>
                <Text style={{color:'black',textAlign:'center',fontSize:18}}>다음</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignUpScreen