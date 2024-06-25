// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import HomeScreen from './screens/HomeScreen';
import TodayTimetableScreen from './screens/Timetable/DailyTimetableScreen';
import WeeklyTimetableScreen from './screens/Timetable/WeeklyTimetableScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import StoreScreen from './screens/StoreScreen';
import MyPageScreen from './screens/MyPageScreen';



export type RootStackParamList={
  Home: undefined;
  // TodayTimetable: undefined;
  // Timetable: undefined;
  Login: undefined;
  Signup: undefined;
  // Menu: undefined;
};

// export type BottomTabNavigatorParamList={
//   Store: undefined;
//   Timetable: undefined;
//   Mypage: undefined;
// };

// export type TabNavigatorParamList={
//     TodayTimetable: undefined;
//     Timetable: undefined;
// };



const RootStack = createNativeStackNavigator<RootStackParamList>();
// const Tab = createMaterialTopTabNavigator<TabNavigatorParamList>();
// const BottomTab = createBottomTabNavigator<BottomTabNavigatorParamList>();


// function TopNavigator(){
//   return(
//     <Tab.Navigator>
//       <Tab.Screen name="TodayTimetable" component={TodayTimetableScreen} />
//       <Tab.Screen name="Timetable" component={WeeklyTimetableScreen} initialParams={{lectures:Schedule}}/>
//     </Tab.Navigator>
//   );
// }


// function BottomNavigator(){
//   return(
//     <BottomTab.Navigator>
//       <BottomTab.Screen 
//         name="Store" 
//         component={StoreScreen} 
//         options={{title: '스토어',headerShown:false}}/>
//       <BottomTab.Screen 
//         name="Timetable" 
//         component={HomeScreen} 
//         options={{title: '시간표',headerShown:false}}/>
//       <BottomTab.Screen 
//         name="Mypage" 
//         component={MyPageScreen} 
//         options={{title: '마이페이지',headerShown:false}}/>
//     </BottomTab.Navigator>
//   );
// } 


const App: React.FC=()=>{
  return(


    <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Signup" component={SignupScreen} />
          <RootStack.Screen name="Home" component={HomeScreen} /> 
          {/* <RootStack.Screen
            name="Home"
            component={BottomNavigator}
          /> */}
        </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App