import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useEffect, useState} from 'react';
import React from 'react';
import ProgressBar from '@components/ProgessBar';
import {CourseBlock} from '@src/Types';
import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {
  BriefingSummary,
  fetchBriefing,
  fetchBriefingById,
} from '@src/data/briefingApi';
import {fetchCourseInfo} from '@src/data/studentApi';

const BriefingHeader = ({
  course,
  summary,
}: {
  course: CourseBlock;
  summary: BriefingSummary;
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const handlePressMore = () => {
    navigation.navigate('BriefingScreen', {
      course: course,
      summary: summary,
    });
  };

  return (
    <View style={headerStyle.container}>
      <Text style={headerStyle.title}> 지난 수업 브리핑</Text>
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

const getTargetDate = (day: string) => {
  const today = new Date();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const targetDayIndex = dayNames.findIndex(
    d => d.toLowerCase() === day.toLowerCase(),
  );

  const todayIndex = today.getDay();
  let daysToSubtract = todayIndex - targetDayIndex;

  const targetDate = new Date();
  targetDate.setDate(today.getDate() - daysToSubtract);
  return targetDate;
};

const DailyBriefingWidget = ({
  course,
  day,
}: {
  course: CourseBlock;
  day: string;
}) => {
  const [summary, setSummary] = useState<BriefingSummary>({
    response_percentage: 0,
    attendance_percentage: 0,
    assignment_percentage: 0,
    notification_percentage: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const targetDate = getTargetDate(day);
      const briefingList = await fetchBriefing(course.id, targetDate);
      let attendance = 0;
      let assignment = 0;
      let notification = 0;
      let total_briefing = 0;
      if (briefingList.length > 0) {
        for (const briefing of briefingList) {
          const x = await fetchBriefingById(briefing.id);
          if (!x.answered_at) {
            attendance += x.check_attention ? 1 : 0;
            assignment += x.check_homework ? 1 : 0;
            notification += x.check_test ? 1 : 0;
            total_briefing += 1;
          }
        }
        if (total_briefing !== 0) {
          attendance /= total_briefing;
          assignment /= total_briefing;
          notification /= total_briefing;
        }
        setSummary({
          response_percentage: 0,
          attendance_percentage: Math.round(attendance * 100),
          assignment_percentage: Math.round(assignment * 100),
          notification_percentage: Math.round(notification * 100),
        });
      }
    };
    fetchData();
  }, [course]);

  return (
    <View style={styles.container}>
      <BriefingHeader course={course} summary={summary} />
      <AttendanceProgressBar progress={summary.attendance_percentage} />
      <AssignmentProgressBar progress={summary.assignment_percentage} />
      <NotificationProgressBar progress={summary.notification_percentage} />
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
