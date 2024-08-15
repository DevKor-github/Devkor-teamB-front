// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import HomeScreen from '@screens/HomeScreen';
import LoginScreen from '@screens/LoginScreen';
import EmailScreen from '@screens/SignUp/EmailScreen';
import SignUpScreen from '@screens/SignUp/SignUpScreen';
import RegisterInfoScreen from '@src/screens/SignUp/RegisterInfoScreen';
import RegisterScreen from '@src/screens/SignUp/RegisterScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Email: undefined;
  SignUp: undefined;
  RegisterInfo: undefined;
  Register: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Register"
        screenOptions={{headerShown: false}}>
        <RootStack.Screen name="Login" component={LoginScreen} />
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
          }}
        />
        <RootStack.Screen name="Home" component={HomeScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
