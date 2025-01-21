// App.tsx
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import HomeScreen from '@screens/HomeScreen';
import LoginScreen from '@screens/LoginScreen';
import EmailScreen from '@screens/SignUp/EmailScreen';
import SignUpScreen from '@screens/SignUp/SignUpScreen';
import RegisterInfoScreen from '@src/screens/SignUp/RegisterInfoScreen';
import RegisterScreen from '@src/screens/SignUp/RegisterScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from 'react-native-animatable';
import Colors from '@src/Colors';
import RegistrationSaveScreen from '@src/screens/SignUp/RegisterSaveScreen';
import StoreNavigator from './navigator/StoreNavigator';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Email: undefined;
  SignUp: undefined;
  RegisterInfo: undefined;
  Register: undefined;
  RegisterSave: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>('Login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        setInitialRoute('Home');
      }
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return <View style={{backgroundColor: Colors.ui.background}} />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{headerShown: false}}>
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <RootStack.Screen name="Email" component={EmailScreen} />
        <RootStack.Screen name="SignUp" component={SignUpScreen} />
        <RootStack.Screen
          name="RegisterInfo"
          component={RegisterInfoScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <RootStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            gestureEnabled: false,
            animation: 'none',
          }}
        />
        <RootStack.Screen
          name="RegisterSave"
          component={RegistrationSaveScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <RootStack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            gestureEnabled: false,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
