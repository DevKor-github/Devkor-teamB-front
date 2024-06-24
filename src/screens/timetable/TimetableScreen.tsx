import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import WeeklyTimetable from './WeeklyTimetable.tsx';
import {mockLectures} from '../../MockUserData.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CommunityScreen from '../community/CommunityScreen.tsx';
import PostScreen from '../community/PostScreen.tsx';
import DailyTimetable from './DailyTimetable.tsx';

enum Option {
  daily,
  weekly,
}

class Today {
  month: number;
  date: number;
  day: number;

  constructor() {
    const today = new Date();
    this.month = today.getMonth() + 1;
    this.date = today.getDate();
    this.day = today.getDay();
  }

  isToday(): boolean {
    const today = new Date();
    return this.day === today.getDay();
  }

  toString(): string {
    const label = ['일', '월', '화', '수', '목', '금', '토'];
    return `${this.month}월 ${this.date}일 ${label[this.day]}요일`;
  }
}

const Stack = createNativeStackNavigator();
const spacing = 12;
const style = StyleSheet.create({
  safeArea: {flex: 1},
  container: {
    flex: 1,
    paddingHorizontal: spacing,
  },
  text: {
    textAlign: 'center',
  },
});

const header = StyleSheet.create({
  background: {
    height: 48,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  buttonActive: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonInactive: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
});

function Icon() {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        backgroundColor: 'gray',
      }}
    />
  );
}

function Notification() {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 12,
        borderWidth: 1,
        padding: 8,
        marginVertical: spacing,
        borderColor: 'lightgray',
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Icon />
        <Text
          style={{
            paddingHorizontal: 8,
            alignSelf: 'center',
            textAlign: 'center',
          }}>
          첫 댓글 작성 시 포인트 3배 적립!
        </Text>
      </View>
      <Icon />
    </View>
  );
}

function Header({option, onClick}: {option: Option; onClick: Function}) {
  const getStyle = (value: Option) =>
    value === option ? header.buttonActive : header.buttonInactive;
  const today = new Today();

  return (
    <>
      <Notification />
      <View style={header.background}>
        <View style={header.buttonRow}>
          <TouchableOpacity onPress={() => onClick(Option.daily)}>
            <Text style={getStyle(Option.daily)}>Daily</Text>
          </TouchableOpacity>
          <View style={{width: spacing}} />
          <TouchableOpacity onPress={() => onClick(Option.weekly)}>
            <Text style={getStyle(Option.weekly)}>Weekly</Text>
          </TouchableOpacity>
        </View>
        <Text style={style.text}>{today.toString()}</Text>
      </View>
    </>
  );
}

function Weekly() {
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  useEffect(
    () => setScrollEnabled(contentHeight > viewHeight),
    [contentHeight, viewHeight],
  );

  return (
    <ScrollView
      contentContainerStyle={{padding: 3}}
      scrollEnabled={scrollEnabled}
      onLayout={e => setViewHeight(e.nativeEvent.layout.height)}>
      <View onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
        <WeeklyTimetable lectures={mockLectures} />
      </View>
    </ScrollView>
  );
}

function Daily() {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <DailyTimetable />
    </View>
  );
}

function Container() {
  const [option, setOption] = useState(Option.daily);
  const [current, setCurrent] = useState(new Today());
  useEffect(() => {
    const interval = setInterval(() => {
      if (!current.isToday()) {
        setCurrent(new Today());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <SafeAreaView style={style.safeArea}>
      <View style={style.container}>
        <Header option={option} onClick={setOption} />
        {option === Option.weekly ? <Weekly /> : <Daily />}
      </View>
    </SafeAreaView>
  );
}

function TimetableScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TimetableScreen"
        component={Container}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CommunityScreen"
        component={CommunityScreen}
        options={({route}: {route: any}) => ({
          title: route.params.name,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default TimetableScreen;
