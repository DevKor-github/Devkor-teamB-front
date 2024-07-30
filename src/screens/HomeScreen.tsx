// HomeScreen.tsx
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@src/App';
import TimetableNavigator from '@navigator/TimetableNavigator';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = () => <TimetableNavigator />;

export default HomeScreen;
