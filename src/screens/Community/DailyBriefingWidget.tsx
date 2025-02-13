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

const DailyBriefingWidget = ({course}: {course: CourseBlock}) => {
  const [summary, setSummary] = useState<BriefingSummary>({
    response_percentage: 0,
    attendance_percentage: 0,
    assignment_percentage: 0,
    notification_percentage: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const briefingList = await fetchBriefing(course.id, new Date());
      if (briefingList.length > 0) {
        const briefing = await fetchBriefingById(briefingList[0].id);
        setSummary(briefing.content.summary);
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
