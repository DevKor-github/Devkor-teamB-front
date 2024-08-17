// EmailScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import axios from 'axios';

type EmailScreenProps = NativeStackScreenProps<RootStackParamList, 'Email'>;

const API_URL = 'http://15.165.198.75:8000';

function EmailScreen({navigation}:EmailScreenProps){
    const [email, setEmail] = useState("");
    const [verificationNum,setVerficationNum] = useState("");
    const [showVerification, setShowVerification]=useState(false);
    const [verified, setVerified] = useState(false);

    const API_URL = "http://3.37.163.236:8000/"
    
    const handleNext = () => {
        if(verified){
            navigation.navigate('SignUp');
        }
    }

    const handleEmailSend = async (email:string) => {
        const emailData = {
            email: email,
        };

    try {
      const response = await axios.post(
        `${API_URL}/student/send-code/`,
        emailData,
      );
      console.log(response.status);
      if (response.status == 201) {
        setShowVerification(true);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleVerification = async (email: string, verificationNum: string) => {
    const emailData = {
      email: email,
      code: verificationNum,
    };

    try {
      const response = await axios.post(
        `${API_URL}/student/check-code/`,
        emailData,
      );
      console.log(response.status);
      if (response.status == 201) {
        setVerified(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={{alignSelf: 'flex-start', marginLeft: 40, marginBottom: 30}}>
        <Text style={styles.largeText}>이메일 인증</Text>
      </View>

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="학교 이메일"
        autoCapitalize="none"
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 315,
        }}>
        <View style={{paddingVertical: 6}}>
          <Text style={styles.smallText}>위 메일로 인증번호를 발송합니다.</Text>
        </View>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => setShowVerification(true)}>
          <Text
            onPress={() => handleEmailSend(email)}
            style={styles.smallBtnText}>
            전송 요청
          </Text>
        </TouchableOpacity>
      </View>

      {showVerification && (
        <View style={{alignItems: 'center'}}>
          <TextInput
            style={styles.input}
            onChangeText={setVerficationNum}
            value={verificationNum}
            placeholder="인증번호입력"
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: 315,
            }}>
            <View style={{paddingVertical: 6}}>
              {verified ? (
                <Text style={styles.verifiedSmallText}>
                  인증이 완료되었습니다.
                </Text>
              ) : (
                <Text style={styles.smallText}>
                  인증번호는 최대 10분동안 유효합니다.
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => handleVerification(email, verificationNum)}>
              <Text style={styles.smallBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={verified ? styles.verifiedLargeBtn : styles.largeBtn}
        onPress={handleNext}>
        <Text style={styles.largeBtnText}>다음</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

export default EmailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 130,
    backgroundColor: 'white',
  },
  input: {
    borderColor: '#E7E7E7',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    width: 320,
    height: 40,
    borderRadius: 10,
  },
  smallBtn: {
    backgroundColor: '#F4F4F4',
    padding: 3,
    borderRadius: 49,
    width: 76,
    height: 29,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  smallBtnText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#3D3D3D',
  },
  smallText: {
    fontSize: 14,
    color: '#3D3D3D',
    textAlign: 'left',
    marginLeft: 6,
  },
  verifiedSmallText: {
    fontSize: 14,
    color: '#96DE69',
    textAlign: 'left',
  },
  largeBtn: {
    backgroundColor: '#EEEEEE',
    marginTop: 25,
    padding: 5,
    width: 320,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
  },
  verifiedLargeBtn: {
    backgroundColor: '#FCA0CC',
    marginTop: 25,
    padding: 5,
    width: 320,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
  },
  largeBtnText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
  },
  largeText: {
    fontSize: 24,
    fontWeight: '600',
  },
});
