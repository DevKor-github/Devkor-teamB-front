// HomeScreen.tsx
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@src/App';
import BottomNavigator from '@src/navigator/BottomTabNavigator';
import { StatusBar } from 'react-native';
import Colors from '@src/Colors';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = () => <BottomNavigator />;

export default HomeScreen;
