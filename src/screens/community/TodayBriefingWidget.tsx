import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
  } from 'react-native';
  import React from 'react';
  // import ProgressBar from '../../ProgessBar.tsx';
  import ProgressBar from '../../component/ProgessBar.tsx';
  import {Lecture} from '../timetable/TimetableTypes.tsx';
  
  const highlightColor = '#f91482';
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 12,
      borderColor: highlightColor,
      borderWidth: 1,
      margin: 12,
      padding: 12,
      elevation: 5,
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
  function ExamProgress({progress,text}: {progress: number,text:string}) {
    return (
      <View style={styles.item}>
        {/* <Text style={styles.text}>시험 관련 공지가 있었어요</Text> */}
        <ProgressBar progress={progress} text={text}/>
      </View>
    );
  }
  
  function AttendanceProgress({progress,text}: {progress: number,text:string}) {
    return (
      <View style={styles.item}>
        {/* <Text style={styles.text}>출석 관련 공지가 있었어요</Text> */}
        <ProgressBar progress={progress} text={text}/>
      </View>
    );
  }
  function AssignmentProgress({progress,text}: {progress: number,text:string}) {
    return (
      <View style={styles.item}>
        {/* <Text style={styles.text}>과제 관련 공지가 있었어요</Text> */}
        <ProgressBar progress={progress} text={text}/>
      </View>
    );
  }
  
  function TodayBriefingWidget({lecture}: {lecture: Lecture}) {
    return (
      <View style={styles.container}>
        <BriefingHeader lectureName={lecture.name} />
        <ExamProgress progress={60} text="시험 관련 공지가 있었어요"/>
        <AttendanceProgress progress={45} text="출석 관련 공지가 있었어요"/>
        <AssignmentProgress progress={90} text="과제 관련 공지가 있었어요"/>
      </View>
    );
  }
  
  export default TodayBriefingWidget;