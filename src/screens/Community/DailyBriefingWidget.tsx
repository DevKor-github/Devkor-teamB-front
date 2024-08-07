import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import ProgressBar from '@components/ProgessBar';
import {Lecture} from '@src/Types';
import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';

const BriefingHeader = () => {
  return (
    <View style={headerStyle.container}>
      <Text style={headerStyle.title}> 오늘의 브리핑</Text>
      {/* <TouchableOpacity>
        <View style={GlobalStyles.row}>
          <Text style={headerStyle.more}>자세히 보기</Text>
          <Image
            style={headerStyle.arrow}
            source={require('@assets/icons/arrow_right.png')}
          />
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

const NotificationProgressBar = ({progress}: {progress: number}) => {
  return (
    <View style={styles.item}>
      <ProgressBar progress={progress}>
        <View style={GlobalStyles.row}>
          <Image
            source={require('@assets/icons/smiling_face.png')}
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
            source={require('@assets/icons/smiling_face.png')}
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
            source={require('@assets/icons/smiling_face.png')}
            style={styles.icon}
          />
          <Text style={styles.text}>과제가 있었어요!</Text>
        </View>
      </ProgressBar>
    </View>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DailyBriefingWidget = ({lecture}: {lecture: Lecture}) => {
  return (
    <View style={styles.container}>
      <BriefingHeader />
      <AttendanceProgressBar progress={45} />
      <AssignmentProgressBar progress={100} />
      <NotificationProgressBar progress={60} />
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
