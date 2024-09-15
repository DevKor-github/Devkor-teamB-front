import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Timetable from '@components/Timetable/Timetable';
import {Course, CourseData, CourseBlock} from '@src/Types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://3.37.163.236:8000/"

const fetchLectureInfo = async (id: number[]) => {
  try {
    const items: Course[] = await Promise.all(
      id.map(async (x: number) => {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/courses/${x}/`, {
          headers: {
            authorization: `token ${token}`,
          },
        });
        return Course.fromJson(response.data);
      }),
    );
    return items;
  } catch (e) {
    console.error(e);
  }
};

function WeeklyTimetableScreen() {
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [courses, setCourses] = useState<Course[]>([]);

  // 임시 코드 (전체 강의 불러와서 시간표에 적용)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/courses/`, {
          headers: {
            authorization: `token ${token}`,
          },
        });
        const lectureInfo = (response.data as CourseData[]).map(e => e.id);
        const value = await fetchLectureInfo(lectureInfo);
        setCourses(value!);
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
