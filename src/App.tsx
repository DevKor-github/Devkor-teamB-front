// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import EmailScreen from './screens/SignUp/EmailScreen';
import SignUpScreen from './screens/SignUp/SignUpScreen';


export type RootStackParamList={
  Home: undefined;
  Login: undefined;
  Email: undefined;
  SignUp: undefined;
};


const RootStack = createNativeStackNavigator<RootStackParamList>();


const App: React.FC=()=>{
  return(
    <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Email" component={EmailScreen} />
          <RootStack.Screen name="SignUp" component={SignUpScreen} />
          <RootStack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/> 
        </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App