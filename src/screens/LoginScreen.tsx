import React from 'react';
import {View, Button, Text} from 'react-native';
// import {
//   createNativeStackNavigator,
//   NativeStackScreenProps,
// } from '@react-navigation/native-stack';
// import {RootStackParamList} from '../App';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

// type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

// const Stack = createNativeStackNavigator();

function LoginScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>로그인화면</Text>
      <Button title="홈화면 가기" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

export default LoginScreen;
