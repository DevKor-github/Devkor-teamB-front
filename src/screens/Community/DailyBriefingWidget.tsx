import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import ProgressBar from '@components/ProgessBar';
import {CourseBlock} from '@src/Types';
import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BriefingHeader = ({course, attendance, assignment, notification}: {course: CourseBlock, attendance: Number, assignment: Number, notification: Number}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const handlePressMore = () => {
    navigation.navigate('BriefingScreen', {
      lectureName: course.course_name,
      attendance: attendance,
      assignment: assignment,
      notification: notification
    });
  };

  return (
    <View style={headerStyle.container}>
      <Text style={headerStyle.title}> 오늘의 브리핑</Text>
      <TouchableOpacity onPress={handlePressMore}>
        <View style={GlobalStyles.row}>
          <Text style={headerStyle.more}>자세히 보기</Text>
          <Image
            style={headerStyle.arrow}
            source={require('@assets/icons/arrow_right.png')}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const NotificationProgressBar = ({progress}: {progress: number}) => {
  return (
    <View style={styles.item}>
      <ProgressBar progress={progress}>
        <View style={GlobalStyles.row}>
          <Image
            source={require('@assets/icons/icon_slight_smile.png')}
            style={styles.icon}
          />
          <Text style={styles.text}>공지가 있었어요!</Text>
        </View>
      </ProgressBar>
    </View>
  );
};

const AttendanceProgressBar = ({progress}: {progress: number}) => {
  return (
    <View style={styles.item}>
      <ProgressBar progress={progress}>
        <View style={GlobalStyles.row}>
          <Image
            source={require('@assets/icons/icon_slight_smile.png')}
            style={styles.icon}
          />
          <Text style={styles.text}>출석체크를 진행했어요!</Text>
        </View>
      </ProgressBar>
    </View>
  );
};

const AssignmentProgressBar = ({progress}: {progress: number}) => {
  return (
    <View style={styles.item}>
      <ProgressBar progress={progress}>
        <View style={GlobalStyles.row}>
          <Image
            source={require('@assets/icons/icon_slight_smile.png')}
            style={styles.icon}
          />
          <Text style={styles.text}>과제가 있었어요!</Text>
        </View>
      </ProgressBar>
    </View>
  );
};

const DailyBriefingWidget = ({course}: {course: CourseBlock}) => {
  const [attendance, setAttendance] = useState(0);
  const [assignment, setAssignment] = useState(0);
  const [notification, setNotification] = useState(0);
  const [summary, setSummary] = useState(Object);

  useEffect(()=>{
    // console.log('브리핑:',course.id)
    fetchBriefing(course);
  },[])

  useEffect(()=>{
    console.log('summary:',attendance, assignment, notification)
  },[notification])

  const fetchBriefing = async (course: CourseBlock) => {
    const API_URL = "http://3.37.163.236:8000/"
    try{
      const token = await AsyncStorage.getItem('userToken')
      console.log(course.id)
      const response = await axios.get(`${API_URL}/briefings/`,  
        {
          headers: {
            authorization: `token ${token}`,
          },
          params : {
            course_fk: course.id,
          }
        },);

      if(response.data.length > 0){
        const briefing_id = response.data[0].id
        console.log('briefing_id:',briefing_id)
  
        const response2 = await axios.get(`${API_URL}/briefings/${briefing_id}/`,  
          {
            headers: {
              authorization: `token ${token}`,
            },
          },); 
        setAttendance(response2.data.content.summary.attendance_percentage)
        setAssignment(response2.data.content.summary.assignment_percentage)
        setNotification(response2.data.content.summary.notification_percentage)
      }

    } catch(error){
      console.error("Error fetching briefing info",error)
    }
  }


  return (
    <View style={styles.container}>
      <BriefingHeader course={course} assignment={assignment} attendance={attendance} notification={notification}/>
      <AttendanceProgressBar progress={attendance} />
      <AssignmentProgressBar progress={assignment} />
      <NotificationProgressBar progress={notification} />
    </View>
  );
};

const headerStyle = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    ...GlobalStyles.row,
  },
  title: {
    textAlign: 'center',
    color: Colors.text.black,
    fontSize: FontSizes.large,
    padding: 4,
    ...GlobalStyles.boldText,
  },
  more: {
    color: Colors.text.lightgray,
    textAlign: 'center',
    fontSize: FontSizes.medium,
    ...GlobalStyles.text,
  },
  arrow: {width: 16, height: 16, tintColor: Colors.text.lightgray},
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ui.background,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 12,
    padding: 12,
    ...GlobalStyles.shadow,
  },
  item: {
    paddingVertical: 5,
  },
  text: {
    textAlign: 'center',
    fontSize: FontSizes.large,
  },
  icon: {width: 18, height: 18, marginRight: 6},
});

export default DailyBriefingWidget;
