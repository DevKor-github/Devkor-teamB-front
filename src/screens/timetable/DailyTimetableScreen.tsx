// DailyTimetable.tsx
import React from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../../App.tsx';
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';


const lectures = [
  {id: 'A', time: '9:00', location: '교양관 314호', professor: '황인하 교수님'},
  {id: 'B', time: '현재 수업 중', location: '미디어관 602호', professor: '박준서 교수님', current: true},
  {id: 'C', time: '12:00', location: 'SK미래관 4121호', professor: '최준혁 교수님'},
  {id: 'D', time: '13:00', location: '체육생활관 120호', professor: '임규은 교수님'},
];


const DailyTimetable = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        {lectures.map((lecture) => (
          <TouchableOpacity
            key={lecture.id}
            style={[
              styles.lectureCard,
              lecture.current && styles.lectureCardCurrent
            ]}
          >
            <Text style={styles.lectureTitle}>수업 {lecture.id} {'>'}</Text>
            <Text style={styles.lectureDetails}>{lecture.time} / {lecture.location} / {lecture.professor}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8FC',
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  lectureCard: {
    backgroundColor: '#FCE4EC',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  lectureCardCurrent: {
    backgroundColor: '#F48FB1',
  },
  lectureTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lectureDetails: {
    marginTop: 5,
    color: 'gray',
  },
});

export default DailyTimetable;