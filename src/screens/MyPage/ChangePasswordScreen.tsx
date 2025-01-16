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
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '@src/Colors';
import {GlobalStyles} from '@src/GlobalStyles';
import {InputField} from '@src/screens/SignUp/InputField';
import {CustomButton} from '@src/screens/SignUp/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native-animatable';
import {fetchPasswordChange} from '@src/data/authApi';

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,12}$/;

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [reenteredPassword, setReenteredPassword] = useState('');
  const navigation = useNavigation<any>();
  const isUsernameValid = oldPassword.length > 0;
  const isPasswordValid = passwordRegex.test(password);
  const isPasswordMatch =
    password === reenteredPassword && reenteredPassword.length > 0;
  const isFormValid = isUsernameValid && isPasswordValid && isPasswordMatch;

  const handleChangePassword = async () => {
    try {
      const isSuccess = await fetchPasswordChange(oldPassword, password);
      if (isSuccess) {
        Alert.alert('비밀번호 변경 성공', '', [
          {
            text: '확인',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('비밀번호 변경 실패', '올바르지 않은 비밀번호입니다', [
          {text: '확인'},
        ]);
      }
    } catch (_) {
      Alert.alert(
        '비밀번호 변경 실패',
        '알 수 없는 이유로 비밀번호 변경에 실패했습니다\n다시 시도해주세요',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={GlobalStyles.expand}>
          <View style={styles.exitContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('@src/assets/icons/clear.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.subTitleText}>내 정보 수정</Text>
            <Text style={styles.titleText}>비밀번호 변경하기</Text>
            <InputField
              icon={require('@src/assets/icons/lock_circle.png')}
              value={oldPassword}
              secureTextEntry
              onChangeText={setOldPassword}
              placeholder="기존 패스워드를 입력해주세요"
            />
            <InputField
              icon={require('@src/assets/icons/lock_circle.png')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="변경할 패스워드를 입력해주세요"
              errorText="영문 대소문자, 숫자, 6~12자 조합"
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
              text="비밀번호 변경하기"
              onPress={handleChangePassword}
              disabled={!isFormValid}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

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
  icon: {
    alignSelf: 'center',
    tintColor: Colors.ui.gray,
    width: 32,
    height: 32,
  },
  exitContainer: {
    height: 64,
    paddingHorizontal: 32,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
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
