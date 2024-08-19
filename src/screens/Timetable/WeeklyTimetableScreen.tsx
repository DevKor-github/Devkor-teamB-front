import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Timetable from '@components/Timetable/Timetable';
import {Course, CourseBlock, TimetableModel} from '@src/Types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://3.37.163.236:8000/"

const fetchUserId = async (token: string | null) => {
  try {
    if (token === null) {
      throw Error('Missing Token');
    }
    const response = await axios.get(`${API_URL}/student/user-info/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    return response.data.user_id as number;
  } catch (e) {
    throw e;
  }
};

function WeeklyTimetableScreen() {
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await fetchUserId(token);
        const response = await axios.get(`${API_URL}/timetables/${userId}/`, {
          headers: {
            authorization: `token ${token}`,
          },
        });
        const timetableData = TimetableModel.fromJson(response.data);
        setCourses(timetableData.courses);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [setCourses]);

  useEffect(
    () => setScrollEnabled(contentHeight > viewHeight),
    [contentHeight, viewHeight],
  );

  return (
    <ScrollView
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={(_, height) => setContentHeight(height)}
      onLayout={e => setViewHeight(e.nativeEvent.layout.height)}>
      <View
        style={styles.container}
        onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
        <Timetable
          courses={courses}
          onPress={(course: CourseBlock) => {
            navigation.navigate('Community', {course: course});
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default WeeklyTimetableScreen;
