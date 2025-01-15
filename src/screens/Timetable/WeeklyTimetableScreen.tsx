import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Timetable from '@components/Timetable/Timetable';
import {Course, CourseBlock} from '@src/Types';
import {fetchTimetables} from '@src/data/studentApi';

function WeeklyTimetableScreen() {
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    fetchTimetables().then(result => {
      if (result) {
        setCourses(result.courses);
        setScrollEnabled(contentHeight > viewHeight);
      }
    });
  }, [contentHeight, viewHeight]);

  return (
    <ScrollView
      style={styles.container}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={(_, height) => setContentHeight(height)}
      onLayout={e => setViewHeight(e.nativeEvent.layout.height)}>
      <View onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
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
    padding: 12,
  },
});

export default WeeklyTimetableScreen;
