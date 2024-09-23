import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@src/Colors';

import {TimetableModel} from '@src/Types';
import {API_URL} from '@env';
import {GlobalStyles} from '@src/GlobalStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {InputField} from '@src/screens/SignUp/InputField';
import {CustomButton} from '@src/screens/SignUp/CustomButton';

enum LoginStatus {
  SUCCESS,
  LOGIN_FAILURE,
  TIMETABLE_FAILURE,
  USER_INFO_FAILURE,
  UNKNOWN_FAILURE,
}

const hasTimetableEntries = async (token: string, userId: string) => {
  const {data, status} = await axios.get(`${API_URL}/timetables/${userId}/`, {
    headers: {authorization: `token ${token}`},
    validateStatus: x => x === 200 || x === 404,
  });
  if (status === 404) {
    throw LoginStatus.TIMETABLE_FAILURE;
  }
  const timetable = TimetableModel.fromJson(data);
  return timetable.courses.length > 0;
};

const getUserInfo = async (token: string) => {
  const {data, status} = await axios.get(`${API_URL}/student/user-info/`, {
    headers: {authorization: `token ${token}`},
    validateStatus: x => x === 200 || x === 404,
  });
  if (status === 404) {
    throw LoginStatus.USER_INFO_FAILURE;
  }
  return {userId: data.user_id.toString(), userNickname: data.nickname};
};

function LoginScreen({navigation}: {navigation: any}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const isFormValid = username.length > 0 && password.length > 0;
  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      const {status, data} = await axios.post(
        `${API_URL}/student/login/`,
        {username: username, password: password},
        {validateStatus: x => x === 200 || x === 400},
      );
      if (status === 400) {
        throw LoginStatus.LOGIN_FAILURE;
      }
      setLoginError(false);
      const token = data.Token;
      const {userId, userNickname} = await getUserInfo(token);
      await Promise.all([
        AsyncStorage.setItem('userToken', token),
        AsyncStorage.setItem('userId', userId),
        AsyncStorage.setItem('userNickname', userNickname),
      ]);
      const hasTimetable = await hasTimetableEntries(token, userId);
      navigation.navigate(
        hasTimetable ? 'Home' : 'RegisterInfo',
        hasTimetable ? {} : {userId},
      );
      // navigation.navigate('RegisterInfo', {userId});
    } catch (e) {
      console.log(e);
      if (e === LoginStatus.LOGIN_FAILURE) {
        setLoginError(true);
      } else if (e === LoginStatus.TIMETABLE_FAILURE) {
        Alert.alert(
          '로그인 실패',
          '시간표 정보를 불러오는 데 실패했습니다.\n인터넷 연결을 확인하고 다시 시도해 주세요.',
        );
      } else if (e === LoginStatus.USER_INFO_FAILURE) {
        Alert.alert(
          '로그인 실패',
          '유저 정보를 불러오는 데 실패했습니다.\n인터넷 연결을 확인하고 다시 시도해 주세요.',
        );
      } else {
        Alert.alert(
          '알 수 없는 오류',
          '네트워크 상태를 확인하고 다시 시도해 주세요.',
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={GlobalStyles.expand}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>로그인</Text>
            <InputField
              icon={require('@src/assets/icons/smile_circle.png')}
              value={username}
              maxLength={10}
              onChangeText={setUsername}
              placeholder="아이디를 입력해주세요"
            />
            <InputField
              icon={require('@src/assets/icons/lock_circle.png')}
              value={password}
              onChangeText={setPassword}
              maxLength={12}
              placeholder="패스워드를 입력해주세요"
              secureTextEntry={true}
              error={loginError}
              errorText="아이디 / 패스워드를 확인해주세요"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <CustomButton
              text="로그인"
              onPress={handleLogin}
              disabled={!isFormValid}
            />
            <TouchableOpacity onPress={() => navigation.navigate('Email')}>
              <Text style={styles.signupBtn}>회원가입</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={{height: Platform.OS == 'android' ? 20 : 0}} /> */}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  contentWrapper: {
    flex: 1,
    marginTop: 64,
    paddingHorizontal: 32,
  },
  title: {
    ...GlobalStyles.boldText,
    fontSize: 32,
    marginVertical: 12,
  },
  buttonWrapper: {
    width: '100%',
    padding: 32,
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  signupBtn: {
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
    color: Colors.text.gray,
  },
});
