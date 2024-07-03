import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto.js';
import {mockLectures} from '../../MockUserData.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CommunityScreen from '../Community/CommunityScreen.tsx';
import PostScreen from '../Community/PostScreen.tsx';
import WeeklyTimetableScreen from './WeeklyTimetableScreen.tsx';
import DailyTimetableScreen from './DailyTimetableScreen.tsx';
import {Color} from '../../Color.tsx';
import {PageType, Today} from './TimetableTypes.tsx';

const spacing = 12;
const innerPadding = 4;

const style = StyleSheet.create({
  flex: {flex: 1},
  row: {flexDirection: 'row'},
  center: {justifyContent: 'center'},
  safeArea: {
    backgroundColor: Color.ui.background,
  },
  container: {
    paddingHorizontal: spacing,
    backgroundColor: Color.ui.background,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  header: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

function Notification() {
  const notification = StyleSheet.create({
    container: {
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginVertical: spacing,
      borderColor: Color.ui.disabled,
    },
    text: {
      padding: 8,
      alignSelf: 'center',
      fontSize: 16,
    },
  });
  return (
    <View style={[style.row, notification.container]}>
      <Icon name="bell" size={25} color={Color.ui.primary} />
      <Text style={[style.flex, notification.text]}>
        첫 댓글 작성 시 포인트 3배 적립!
      </Text>
      <Icon name="bell" size={25} color={Color.ui.primary} />
    </View>
  );
}

function Header({type, onClick}: {type: PageType; onClick: Function}) {
  const getColor = (value: PageType) =>
    value === type ? Color.ui.primary : Color.ui.disabled;

  return (
    <View style={{paddingHorizontal: innerPadding}}>
      <Notification />
      <View style={[style.row, style.header]}>
        <View style={style.row}>
          <TouchableOpacity
            style={style.row}
            onPress={() => onClick(PageType.daily)}>
            <Icon name="bell" size={25} color={getColor(PageType.daily)} />
            <Text style={[style.button, {color: getColor(PageType.daily)}]}>
              Daily
            </Text>
          </TouchableOpacity>
          <View style={{width: spacing}} />
          <TouchableOpacity
            style={style.row}
            onPress={() => onClick(PageType.weekly)}>
            <Icon name="bell" size={25} color={getColor(PageType.weekly)} />
            <Text style={[style.button, {color: getColor(PageType.weekly)}]}>
              Weekly
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={style.text}>{new Today().toString()}</Text>
      </View>
    </View>
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
      contentContainerStyle={{padding: innerPadding}}
      scrollEnabled={scrollEnabled}
      onContentSizeChange={(_, height) => setContentHeight(height)}
      onLayout={e => setViewHeight(e.nativeEvent.layout.height)}>
      <View onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
        <WeeklyTimetableScreen lectures={mockLectures} />
      </View>
    </ScrollView>
  );
}

function Daily() {
  return (
    <View style={[style.flex, style.center]}>
      <DailyTimetableScreen />
    </View>
  );
}

function Footer({type}: {type: PageType}) {
  const enumValues = Object.keys(PageType)
    .filter(key => !isNaN(Number(key)))
    .map(_ => Number(_));
  const getStyle = (value: PageType) =>
    value === type ? footerStyle.target : footerStyle.nonTarget;
  const footerStyle = StyleSheet.create({
    target: {
      width: 28,
      height: 8,
      borderRadius: 8,
      margin: 4,
      backgroundColor: Color.ui.primary,
    },
    nonTarget: {
      width: 8,
      borderRadius: 8,
      height: 8,
      margin: 4,
      backgroundColor: Color.ui.disabled,
    },
  });
  return (
    <View style={[style.row, style.center, {padding: 12}]}>
      {enumValues.map(e => (
        <View style={getStyle(e)} />
      ))}
    </View>
  );
}

function Container() {
  const [pageType, setPageType] = useState(PageType.daily);
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
    <SafeAreaView style={[style.flex, style.safeArea]}>
      <View style={[style.flex, style.container]}>
        <Header type={pageType} onClick={setPageType} />
        {pageType === PageType.weekly ? <Weekly /> : <Daily />}
        <Footer type={pageType} />
      </View>
    </SafeAreaView>
  );
}

function TimetableScreen() {
  const Stack = createNativeStackNavigator();
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
          headerTintColor: Color.ui.primary,
        })}
      />
      <Stack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{
          headerTitle: '게시물',
          headerBackTitleVisible: false,
          headerTintColor: Color.ui.primary,
        }}
      />
    </Stack.Navigator>
  );
}

export default TimetableScreen;
