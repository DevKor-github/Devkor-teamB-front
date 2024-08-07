// LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather'

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

// sample
const sampleID = '123';
const samplePW = '123!';

function LoginScreen({ navigation }: LoginScreenProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState(false);
    const isFormFilled = username!=="" && password!=="";

    const handleLogin = () => {
        if(username===sampleID && password===samplePW){
            setIsVerified(true);
            setError(false);
            navigation.navigate('Home');
        } else{
            setError(true);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={{ alignSelf: "flex-start", marginLeft: 40, marginBottom: 30 }}>
                <Text style={styles.largeText}>로그인</Text>
            </View>

            <View style={styles.inputContainer}>
                <Icon name="smileo" size={18} color={username === ""?'#B8B8B8':'#2C2C2C'} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={setUsername}
                    value={username}
                    placeholder="아이디를 입력해주세요"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color={password === ""?'#B8B8B8':'#2C2C2C'} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="패스워드를 입력해주세요"
                    // secureTextEntry
                    autoCapitalize="none"
                />
            </View>

            { error && 
                <View style={{flexDirection:"row",width:315}}>
                    <View style={{padding: 6,paddingLeft:10}}>
                        <FeatherIcon name='alert-circle' size={15} color={'#F06868'}></FeatherIcon>  
                    </View>
                    <Text style={styles.smallText}>아이디 / 패스워드를 확인해주세요</Text>
                </View>
            }

            

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.loginButton, isFormFilled ? styles.loginButtonActive:styles.loginButtonInactive]}
                            onPress={handleLogin}
                        >
                            <Text style={styles.loginButtonText}>로그인</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.signupButton}
                            onPress={() => navigation.navigate('Email')}
                        >
                            <Text style={styles.signupButtonText}>회원가입</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 130,
        backgroundColor: 'white',
    },
    inner: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 70,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#B8B8B8',
        margin: 5,
        padding: 10,
        marginTop: 30,
        width: 320,
        borderRadius: 10,
    },
    textInput: {
        flex: 1,
        height: 40,
        margin: 5
    },
    largeText: {
        fontSize: 24,
        fontWeight: "600",
    },
    buttonContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 100
    },
    loginButton: {
        padding: 5,
        width: 320,
        height: 48,
        borderRadius: 10,
        justifyContent: "center",
        marginTop: 25,
    },
    loginButtonActive: {
        backgroundColor: '#FFB5D9', // 여기 DE팀이랑 논의 필요
    },
    loginButtonInactive: {
        backgroundColor: '#EEEEEE',
    },
    loginButtonText: {
        color: 'black',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
    },
    signupButton: {
        marginTop: 15,
        width: 320,
    },
    signupButtonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 12,
    },
    smallText: {
        fontSize:14,
        color:"#F06868",
        textAlign:"left",
        paddingVertical: 6
    },
});
