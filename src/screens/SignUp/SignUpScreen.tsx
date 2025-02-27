// SignUpScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '@src/Colors';
import {GlobalStyles} from '@src/GlobalStyles';
import {InputField} from '@src/screens/SignUp/InputField';
import {CustomButton} from '@src/screens/SignUp/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {fetchSignUp} from '@src/data/authApi';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,12}$/;

function SignUpScreen({route}: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reenteredPassword, setReenteredPassword] = useState('');
  const {email} = route.params;
  const navigation = useNavigation<any>();
  const isUsernameValid = username.length > 0;
  const isPasswordValid = passwordRegex.test(password);
  const isPasswordMatch =
    password === reenteredPassword && reenteredPassword.length > 0;
  const isFormValid = isUsernameValid && isPasswordValid && isPasswordMatch;

  const handleSignUp = async () => {
    try {
      const isSuccess = await fetchSignUp(username, email, password);
      if (isSuccess) {
        Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.', [
          {
            text: '확인',
            onPress: () => {
              navigation.popToTop();
            },
          },
        ]);
      } else {
        throw Error('Failed to sign up');
      }
    } catch (e) {
      Alert.alert(
        '회원가입 실패',
        '네트워크 상태를 확인하고 다시 시도해 주세요.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={GlobalStyles.expand}>
          <View style={styles.inputContainer}>
            <Text style={styles.subTitleText}>이메일 인증</Text>
            <Text style={styles.titleText}>회원가입</Text>
            <InputField
              icon={require('@src/assets/icons/smile_circle.png')}
              value={username}
              onChangeText={setUsername}
              placeholder="아이디를 입력해주세요"
            />
            <InputField
              icon={require('@src/assets/icons/lock_circle.png')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="패스워드를 입력해주세요"
              errorText="영문 대문자 및 특수문자 필수, 6-12자"
              error={!isPasswordValid}
            />
            <InputField
              icon={require('@src/assets/icons/lock_circle.png')}
              value={reenteredPassword}
              onChangeText={setReenteredPassword}
              secureTextEntry
              placeholder="패스워드를 다시 입력해주세요"
              errorText="비밀번호가 일치하지 않습니다"
              error={!isPasswordMatch}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              text="회원가입하기"
              onPress={() => {
                handleSignUp();
              }}
              disabled={!isFormValid}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default SignUpScreen;
const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 130,
    backgroundColor: 'white',
  },
  subTitleText: {
    fontSize: 16,
    color: Colors.text.gray,
    marginBottom: 8,
    ...GlobalStyles.text,
  },
  titleText: {
    fontSize: 28,
    ...GlobalStyles.boldText,
  },
  inputContainer: {
    flex: 1,
    marginTop: 64,
    paddingHorizontal: 32,
  },
  buttonContainer: {
    width: '100%',
    padding: 32,
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  requestButtonText: {
    fontSize: 18,
    textAlign: 'center',
    ...GlobalStyles.boldText,
  },
  sendCodeButton: {
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
    color: Colors.text.gray,
  },
});
