import {View, Text} from 'react-native';
import React from 'react';
import ProgressBar from '../../ProgressBar.tsx';

const highlightColor = '#f91482';

function ExamProgress({progress}: {progress: number}) {
  return (
    <View>
      <Text>시험 관련 공지가 있었어요</Text>
      <ProgressBar progress={progress} highlightColor={highlightColor} />
    </View>
  );
}

function AttendanceProgress({progress}: {progress: number}) {
  return (
    <View>
      <Text>출석 관련 공지가 있었어요</Text>
      <ProgressBar progress={progress} highlightColor={highlightColor} />
    </View>
  );
}
function AssignmentProgress({progress}: {progress: number}) {
  return (
    <View>
      <Text>과제 관련 공지가 있었어요</Text>
      <ProgressBar progress={progress} highlightColor={highlightColor} />
    </View>
  );
}

function TodayBriefingWidget() {
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: highlightColor,
        borderWidth: 1,
        padding: 12,
        margin: 12,
        elevation: 5,
      }}>
      <ExamProgress progress={60} />
      <AttendanceProgress progress={45} />
      <AssignmentProgress progress={90} />
    </View>
  );
}

export default TodayBriefingWidget;
