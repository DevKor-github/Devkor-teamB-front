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

type TimetableScreenProps = NativeStackScreenProps<RootStackParamList,"Timetable">
const lectures = [
  {id: 'A', time: '9:00', location: '교양관 314호', professor: '황인하 교수님'},
  {id: 'B', time: '현재 수업 중', location: '미디어관 602호', professor: '박준서 교수님', current: true},
  {id: 'C', time: '12:00', location: 'SK미래관 4121호', professor: '최준혁 교수님'},
  {id: 'D', time: '13:00', location: '체육생활관 120호', professor: '임규은 교수님'},
];

class Today{

    
}

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.notification}>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationText}>첫 댓글 작성 시 포인트 3배 적립!</Text>
        </View>
        <View style={styles.notificationIcon} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButtonActive}>
          <Text style={styles.headerButtonTextActive}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButtonInactive}>
          <Text style={styles.headerButtonTextInactive}>Weekly</Text>
        </TouchableOpacity>
        <Text style={styles.headerDate}>4월 8일 월요일</Text>
      </View>
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
      <View style={styles.footer}>
        <Text style={styles.footerText}>스토어</Text>
        <Text style={styles.footerText}>시간표</Text>
        <Text style={styles.footerText}>마이페이지</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  notification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#F3E5F5',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    backgroundColor: 'pink',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerButtonActive: {
    flex: 1,
    alignItems: 'center',
  },
  headerButtonInactive: {
    flex: 1,
    alignItems: 'center',
  },
  headerButtonTextActive: {
    color: 'pink',
    fontWeight: 'bold',
  },
  headerButtonTextInactive: {
    color: 'gray',
  },
  headerDate: {
    flex: 1,
    textAlign: 'right',
    color: 'gray',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    color: 'gray',
  },
});

export default App;
