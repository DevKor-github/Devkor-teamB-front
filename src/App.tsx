// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import HomeScreen from '@screens/HomeScreen';
import LoginScreen from '@screens/LoginScreen';
import EmailScreen from '@screens/SignUp/EmailScreen';
import SignUpScreen from '@screens/SignUp/SignUpScreen';
import RegistrationScreen from '@screens/SignUp/RegisterationScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Email: undefined;
  SignUp: undefined;
  Register: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Email" component={EmailScreen} />
        <RootStack.Screen name="SignUp" component={SignUpScreen} />
        <RootStack.Screen name="Register" component={RegistrationScreen} />
        <RootStack.Screen name="Home" component={HomeScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
