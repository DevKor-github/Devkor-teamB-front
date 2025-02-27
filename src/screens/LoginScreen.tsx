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
  ActivityIndicator,
} from 'react-native';
import Colors from '@src/Colors';

import {GlobalStyles} from '@src/GlobalStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {InputField} from '@src/screens/SignUp/InputField';
import {CustomButton} from '@src/screens/SignUp/CustomButton';
import {fetchLogin} from '@src/data/authApi';
import {setLoginId, setUserNickname} from '@src/data/authStorage';
import {setUserId} from '@src/data/authStorage';
import {fetchUserInfo} from '@src/data/studentApi';
import {logger} from '@src/logger';
import {getTimetableId} from '@src/components/Timetable/TimetableUtils';

enum LoginStatus {
  SUCCESS,
  LOGIN_FAILURE,
  TIMETABLE_FAILURE,
  USER_INFO_FAILURE,
  UNKNOWN_FAILURE,
}

function LoginScreen({navigation}: {navigation: any}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const isFormValid = username.length > 0 && password.length > 0;
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginRequest = async () => {
    try {
      const {status} = await fetchLogin(username, password);
      if (status === 400) {
        throw LoginStatus.LOGIN_FAILURE;
      }
      setLoginError(false);
    } catch (e: any) {
      if (e === LoginStatus.LOGIN_FAILURE) {
        setLoginError(true);
      } else {
        logger.error('handleLoginRequest', e);
        throw Error(e);
      }
    }
  };

  const handleUserInfoRequest = async () => {
    try {
      const {data, status} = await fetchUserInfo();
      if (status === 404) {
        throw LoginStatus.USER_INFO_FAILURE;
      }
      await Promise.all([
        setUserId(data.user_id.toString()),
        setLoginId(username),
        setUserNickname(data.nickname),
      ]);
    } catch (e: any) {
      if (e === LoginStatus.USER_INFO_FAILURE) {
        Alert.alert(
          '로그인 실패',
          '유저 정보를 불러오는 데 실패했습니다.\n인터넷 연결을 확인하고 다시 시도해 주세요.',
        );
      } else {
        logger.error('handleUserInfoRequest', e);
        throw Error(e);
      }
    }
  };

  const handleLoginButtonPress = async () => {
    try {
      Keyboard.dismiss();
      setIsLoading(true);
      await handleLoginRequest();
      await handleUserInfoRequest();
      const id = await getTimetableId();
      setIsLoading(false);
      navigation.navigate(id !== -1 ? 'Home' : 'RegisterInfo');
    } catch (e) {
      setIsLoading(false);
      if (e === LoginStatus.TIMETABLE_FAILURE) {
        Alert.alert(
          '로그인 실패',
          '시간표 정보를 불러오는 데 실패했습니다.\n인터넷 연결을 확인하고 다시 시도해 주세요.',
        );
      } else {
        Alert.alert(
          '알 수 없는 오류',
          '네트워크 상태를 확인하고 다시 시도해 주세요.',
        );
      }
    }
  };

  const renderButtons = () => {
    if (!isLoading) {
      return (
        <CustomButton
          text="로그인"
          onPress={handleLoginButtonPress}
          disabled={!isFormValid}
        />
      );
    } else {
      return (
        <CustomButton text="로그인 중" onPress={() => {}} disabled={true} />
      );
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
            {renderButtons()}
            <TouchableOpacity onPress={() => navigation.navigate('Email')}>
              <Text style={styles.signupBtn}>회원가입</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.androidPadding} />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.ui.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  androidPadding: {height: Platform.OS === 'android' ? 20 : 0},
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
