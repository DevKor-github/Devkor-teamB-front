import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import ProgressBar from '../../component/ProgessBar.tsx';
import {Lecture} from '../timetable/TimetableTypes.tsx';
import {Color} from '../../component/Color.tsx';

const highlightColor = Color.ui.primary;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderColor: highlightColor,
    borderWidth: 2,
    margin: 12,
    padding: 12,
  },
  item: {
    paddingVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    paddingBottom: 4,
    fontSize: 16,
  },
  text: {
    paddingBottom: 4,
  },
});

function BriefingHeader({lectureName}: {lectureName: string}) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{lectureName} 오늘의 브리핑</Text>
      <TouchableOpacity>
        <Text>자세히 보기 〉</Text>
      </TouchableOpacity>
    </View>
  );
}
function ExamProgress({progress}: {progress: number}) {
  return (
    <View style={styles.item}>
      <Text style={styles.text}>시험 관련 공지가 있었어요</Text>
      <ProgressBar progress={progress} />
    </View>
  );
}

function AttendanceProgress({progress}: {progress: number}) {
  return (
    <View style={styles.item}>
      <Text style={styles.text}>출석 관련 공지가 있었어요</Text>
      <ProgressBar progress={progress} />
    </View>
  );
}
function AssignmentProgress({progress}: {progress: number}) {
  return (
    <View style={styles.item}>
      <Text style={styles.text}>과제 관련 공지가 있었어요</Text>
      <ProgressBar progress={progress} />
    </View>
  );
}

function TodayBriefingWidget({lecture}: {lecture: Lecture}) {
  return (
    <View style={styles.container}>
      <BriefingHeader lectureName={lecture.name} />
      <ExamProgress progress={60} />
      <AttendanceProgress progress={45} />
      <AssignmentProgress progress={90} />
    </View>
  );
}

export default TodayBriefingWidget;
