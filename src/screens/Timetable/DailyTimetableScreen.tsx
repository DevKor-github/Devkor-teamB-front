

import React, { Component, useEffect, useState } from 'react';
import {mockLectures, mockRegisterLectures} from '../../MockUserData.tsx';
import Accordion from 'react-native-collapsible/Accordion';
import { Lecture, Schedule, SimpleLecture, TimeSlot } from './TimetableTypes.tsx';
import { Color } from '../../component/Color.tsx';
import {
  getLectureSlot,
  getSlotCount,
  getLabels,
  getOnlineLecture,
  getStartTime,
  getLectureByDays,
  getLectureColor,
} from '../Timetable/TimetableUtils.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import {Lecture, PageType, Today} from './TimetableTypes.tsx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App.tsx';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CommunityScreen from '../community/CommunityScreen.tsx';
import {StackNavigationProp,useNavigation } from '@react-navigation/stack';
import Checkbox from 'expo-checkbox';
import {
  SafeAreaView,
  Switch,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const Stack = createNativeStackNavigator();
// checkbox 다운로드 : npm i react-native-bouncy-checkbox --save 

const getCurrentDay = () => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  return days[today.getDay()];
};

const filterLecturesByDay = (lectures, day) => {
  return lectures.filter(lecture =>
    lecture.time.some(timeSlot => timeSlot.day === day)
  ).map(lecture => ({
    id: lecture.id,
    name: lecture.name,
    start: lecture.time.find(timeSlot => timeSlot.day === day).start,
    room: lecture.room,
    professor: lecture.professor,
    // 설문조사결과가 이 content 안에 들어가게 해야할 듯 
    content: ['출석을 자주 부르는 과목이에요.', 
              '지난 시간에 과제 공지가 있었어요.',
              '지난 시간에 휴강 공지가 있었어요.',], 
    briefing: '게시글 확인하기',
    survey: [ 
      
    ]

  }));
};

const currentDay = getCurrentDay();
const todayLectures = filterLecturesByDay(mockLectures, currentDay);

export default class App extends Component {
  state = {
    activeSection: null,
    collapsed: true,
    checkedState: {},
  };

  setSections = (section) => {
    this.setState({
      activeSection: section.includes(undefined) ? null : section[0],
    });
  };

  // handleCheckboxChange = (lectureId, question) => {
  //   this.setState((prevState) => ({
  //     checkedState: {
  //       ...prevState.checkedState,
  //       [lectureId]: {
  //         ...prevState.checkedState[lectureId],
  //         [question]: !prevState.checkedState[lectureId]?.[question],
  //       },
  //     },
  //   }));
  // };

  renderHeader = (section, _, isActive) => {
    return (
      
      <Animatable.View
        duration={400}
        style={[
          styles.lectureHeader,
          isActive ? styles.lectureHeaderActive : {},
        ]}
        transition="backgroundColor"
      >
        <Text style={styles.lectureHeaderText}>{section.name} {isActive ? '▾' : '▸'}</Text>
        <Text style={styles.lectureHeaderSubText}>{section.start} / {section.room} / {section.professor}</Text>
        
        {isActive && <View style={styles.activeLectureContent}>
          {section.content.map((item, index) => (
          <View key={index} style={styles.checkboxContainer}>
            <Text style={styles.contentText}>{item}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.briefingButton}>
          <Text style={styles.briefingText}>{section.briefing}</Text>
        </TouchableOpacity>
          </View>}
        
        
      </Animatable.View>
    );
  };

  renderContent = (section, _, isActive) => {
    // const { checkedState } = this.state;
    // const sectionState = checkedState[section.id] || {};
    // return (
      // <Animatable.View
        // duration={400}
        // style={[styles.lectureContent, isActive ? styles.activeLectureContent :  styles.inactiveLectureContent]}
        // transition="backgroundColor"
      // >


        /* {section.content.map((item, index) => ( */
          /* // <View key={index} style={styles.checkboxContainer}> */

             /* 여기 아이콘 + 브리핑 내용으로 변경 */
            /* <Checkbox style={styles.checkbox}
              value={sectionState[`Question${index + 1}`] || false}
              // onValueChange={() => this.handleCheckboxChange(section.id, `Question${index + 1}`)}
            /> */

            /* <Text style={styles.contentText}>{item}</Text> */
          /* // </View> */
        /* // ))} */

        /* <TouchableOpacity style={styles.briefingButton}> */
          /* <Text style={styles.briefingText}>{section.briefing}</Text> */
        /* </TouchableOpacity> */
      // </Animatable.View>

      
    // );
  };

  render() {
    const { activeSection } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
          <Accordion
            activeSections={[activeSection]}
            sections={todayLectures}
            touchableComponent={TouchableOpacity}
            expandMultiple={false}

            renderHeader={this.renderHeader}
            renderContent={this.renderContent}

            duration={400}
            onChange={this.setSections}
          />
        </ScrollView>
      </View>
    );
  }
}









const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '100%',
    padding: 10,
  },

  lectureContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    borderColor: '#FFC9E3',
    borderWidth: 1,
  },

  lectureHeader: {
    backgroundColor: '#FFF',
    padding: 7,
    borderRadius: 17,
    marginVertical: 5,
    borderColor: '#FFC9E3',
    borderWidth: 2.5,
    height: 85,
  },
  lectureHeaderActive: {
    backgroundColor: '#FF1485',
    borderColor: '#FF1485',
    height: 300,
  },
  lectureHeaderText: {
    paddingVertical: 2,
    paddingLeft: 10,
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 5,
    color: '#333',
  },
  lectureHeaderSubText: {
    paddingLeft: 10,
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '400',
    marginVertical: 1,
    color: '#666',
  },
  lectureContent: {
    padding: 15,
    backgroundColor: '#FFF3F9',
    borderBottomWidth: 1,
    borderBottomColor: '#FF4081',
    borderRadius: 17,
    marginVertical: 5,
    borderColor: '#FFF',
    borderWidth: 1,
  },
  briefingButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FDE',
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  briefingText: {
    color: '#2D0519',
    fontWeight: '500',
    textAlign : 'right',
  },
  activeLectureContent: {
    backgroundColor: '#EF478E',
  },
  inactiveLectureContent: {
    backgroundColor: '#FFE6E6',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    marginRight: 10,
  },
  contentText: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '100%',
    padding: 10,
    fontSize: 16,
    color: '#333',
  }
});









