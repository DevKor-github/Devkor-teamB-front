import React, {useReducer} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import Colors from '@src/Colors';
import {API_URL} from '@env';
import {GlobalStyles} from '@src/GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import {InputField} from '@src/screens/SignUp/InputField';
import {CustomButton} from '@src/screens/SignUp/CustomButton';
import {SafeAreaView} from 'react-native-safe-area-context';

enum EmailVerificationStatus {
  IDLE,
  SENDING_CODE,
  CODE_SENT,
  SUCCESS,
  INVALID_EMAIL,
  EMAIL_ALREADY_EXISTS,
  CODE_NOT_MATCHED,
  VERIFICATION_FAILURE,
  UNKNOWN_ERROR,
  RESENDING_CODE,
}

type State = {
  email: string;
  verificationCode: string;
  status: EmailVerificationStatus;
};

type Action =
  | {type: 'SET_EMAIL'; payload: string}
  | {type: 'SET_VERIFICATION_CODE'; payload: string}
  | {type: 'SET_STATUS'; payload: EmailVerificationStatus};

const initialState: State = {
  email: '',
  verificationCode: '',
  status: EmailVerificationStatus.IDLE,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_EMAIL':
      state.status = EmailVerificationStatus.IDLE;
      return {...state, email: action.payload};
    case 'SET_VERIFICATION_CODE':
      return {...state, verificationCode: action.payload};
    case 'SET_STATUS':
      return {...state, status: action.payload};
    default:
      return state;
  }
}

const EmailScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation<any>();

  const requestVerificationCode = async (isResend: boolean = false) => {
    dispatch({
      type: 'SET_STATUS',
      payload: isResend
        ? EmailVerificationStatus.RESENDING_CODE
        : EmailVerificationStatus.SENDING_CODE,
    });

    try {
      const {status} = await axios.post(
        `${API_URL}/student/send-code/`,
        {email: state.email},
        {validateStatus: e => e === 201 || e === 500 || e === 400},
      );
      if (status === 201) {
        dispatch({
          type: 'SET_STATUS',
          payload: EmailVerificationStatus.CODE_SENT,
        });
      } else if (status === 400) {
        dispatch({
          type: 'SET_STATUS',
          payload: EmailVerificationStatus.EMAIL_ALREADY_EXISTS,
        });
      } else {
        dispatch({
          type: 'SET_STATUS',
          payload: EmailVerificationStatus.INVALID_EMAIL,
        });
      }
    } catch (e) {
      dispatch({
        type: 'SET_STATUS',
        payload: EmailVerificationStatus.UNKNOWN_ERROR,
      });
    }
  };

  const handleVerification = async () => {
    try {
      const response = await axios.post(`${API_URL}/student/check-code/`, {
        email: state.email,
        code: state.verificationCode,
      });
      if (response.status === 201) {
        dispatch({
          type: 'SET_STATUS',
          payload: EmailVerificationStatus.SUCCESS,
        });
        navigation.navigate('SignUp', {email: state.email});
      }
    } catch (e) {
      console.error(e);
      dispatch({
        type: 'SET_STATUS',
        payload: EmailVerificationStatus.VERIFICATION_FAILURE,
      });
    }
  };

  const isEmailValid = (email: string) => {
    // return email.length > 0;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getErrorMsg = () => {
    switch (state.status) {
      case EmailVerificationStatus.EMAIL_ALREADY_EXISTS:
        return '이미 존재하는 이메일입니다';
      case EmailVerificationStatus.INVALID_EMAIL:
        return '잘못된 이메일 형식입니다';
      case EmailVerificationStatus.VERIFICATION_FAILURE:
        return '인증번호가 일치하지 않습니다';
      default:
        return '이메일 인증 실패';
    }
  };

  const renderButtons = () => {
    switch (state.status) {
      case EmailVerificationStatus.IDLE:
      case EmailVerificationStatus.INVALID_EMAIL:
      case EmailVerificationStatus.EMAIL_ALREADY_EXISTS:
      case EmailVerificationStatus.SENDING_CODE:
        return (
          <CustomButton
            text={
              state.status === EmailVerificationStatus.SENDING_CODE
                ? '인증번호 전송 중'
                : '인증번호 요청'
            }
            onPress={() => requestVerificationCode(false)}
            disabled={
              !isEmailValid(state.email) ||
              state.status === EmailVerificationStatus.SENDING_CODE
            }
          />
        );
      case EmailVerificationStatus.CODE_SENT:
      case EmailVerificationStatus.CODE_NOT_MATCHED:
      case EmailVerificationStatus.VERIFICATION_FAILURE:
      case EmailVerificationStatus.RESENDING_CODE:
        return (
          <>
            {state.verificationCode.length === 0 ? (
              <CustomButton
                outline
                text={
                  state.status === EmailVerificationStatus.RESENDING_CODE
                    ? '인증번호 전송 중'
                    : '인증번호 재요청'
                }
                onPress={() => requestVerificationCode(true)}
                disabled={
                  !isEmailValid(state.email) ||
                  state.status === EmailVerificationStatus.RESENDING_CODE
                }
              />
            ) : (
              <CustomButton
                text="인증번호 확인"
                onPress={handleVerification}
                disabled={
                  state.status === EmailVerificationStatus.RESENDING_CODE
                }
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={GlobalStyles.expand}>
          <View style={styles.inputContainer}>
            <Text style={styles.subTitleText}>회원가입</Text>
            <Text style={styles.titleText}>이메일 인증</Text>
            <InputField
              icon={require('@src/assets/icons/email.png')}
              value={state.email}
              onChangeText={text =>
                dispatch({type: 'SET_EMAIL', payload: text})
              }
              placeholder="학교 이메일을 입력해주세요"
              infoText="위 메일로 인증번호를 발송합니다."
              error={
                state.status === EmailVerificationStatus.INVALID_EMAIL ||
                state.status === EmailVerificationStatus.EMAIL_ALREADY_EXISTS
              }
              errorText={getErrorMsg()}
            />
            <InputField
              value={state.verificationCode}
              onChangeText={text =>
                dispatch({type: 'SET_VERIFICATION_CODE', payload: text})
              }
              placeholder="인증번호를 입력해주세요"
              error={
                state.status === EmailVerificationStatus.CODE_NOT_MATCHED ||
                state.status === EmailVerificationStatus.VERIFICATION_FAILURE
              }
              errorText="인증번호가 일치하지 않습니다"
            />
          </View>
          <View style={styles.buttonContainer}>{renderButtons()}</View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EmailScreen;

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
