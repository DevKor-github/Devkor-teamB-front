import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useEffect, useState} from 'react';
import React from 'react';
import ProgressBar from '@components/ProgessBar';
import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {setNavigationHeader} from '@src/navigator/TimetableNavigator';
import {
  fetchTodayPolls,
  fetchTodayPollsById,
  fetchUpdateTodayPolls,
  TodayPolls,
} from '@src/data/briefingApi';
import PollsModal from '../Timetable/TimetablePollsModal';
import {earnPoints, RewardType} from '../Store/StoreHandler';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const BriefingHeader = ({text}: {text: String}) => {
  return (
    <View style={headerStyle.container}>
      <Text style={headerStyle.title}>{text}</Text>
    </View>
  );
};

const BriefingProgressBar = ({
  imgsource,
  progress,
  lectureName,
  text,
}: {
  imgsource: any;
  progress: number;
  lectureName: any;
  text: any;
}) => {
  const percentage = Math.round(progress);
  return (
    <View style={[styles.item, {...GlobalStyles.row}]}>
      <Image source={imgsource} style={styles.icon} />
      <View style={styles.progresscontainer}>
        <View style={styles.textcontainer}>
          <Text style={styles.text}>오늘 {lectureName} 들은 </Text>
          <Text style={{...GlobalStyles.boldText, color: Colors.primary[500]}}>
            {percentage}
          </Text>
          <Text style={styles.text}>%의 학생이</Text>
        </View>
        <ProgressBar progress={progress}>
          <View style={GlobalStyles.row}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </ProgressBar>
      </View>
    </View>
  );
};

interface BriefingScreenProps {
  route: any;
  navigation: any;
}

const getPollsData = async (courseId: number) => {
  const date = getFormattedDate();
  const data = await fetchTodayPolls(courseId, date);
  if (data.length === 0) {
    throw Error('Invalid Polls Data');
  } else {
    const poll = data.reduce((prev, current) =>
      prev.id > current.id ? prev : current,
    );
    const todayData = await fetchTodayPollsById(poll.id);
    return todayData;
  }
};

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${date}T00:00`;
  return formattedDate;
};

const AnswerTodayPolls = ({
  courseName,
  handleBriefingAnswer,
}: {
  courseName: String;
  handleBriefingAnswer: Function;
}) => {
  return (
    <View style={answerStyle.container}>
      <>
        <Text style={answerStyle.text}>
          아직 {courseName}의 브리핑을 답변하지 않았어요
        </Text>
        <TouchableOpacity
          style={answerStyle.button}
          onPress={() => handleBriefingAnswer()}>
          <Text style={answerStyle.buttonText}>답변하고 포인트 받기</Text>
        </TouchableOpacity>
      </>
    </View>
  );
};

const MyTodayPolls = ({poll}: {poll: TodayPolls}) => {
  return (
    <View>
      <BouncyCheckbox
        disabled={true}
        isChecked={poll.check_attention}
        style={pollStyles.bouncyCheckbox}
        textStyle={pollStyles.checkboxTextStyle}
        fillColor={Colors.ui.primary}
        iconStyle={pollStyles.checkboxStyle}
        innerIconStyle={pollStyles.checkboxStyle}
        text="출석체크를 진행했어요!"
      />
      <BouncyCheckbox
        disabled={true}
        isChecked={poll.check_homework}
        style={pollStyles.bouncyCheckbox}
        textStyle={pollStyles.checkboxTextStyle}
        fillColor={Colors.ui.primary}
        iconStyle={pollStyles.checkboxStyle}
        innerIconStyle={pollStyles.checkboxStyle}
        text="과제가 있었어요!"
      />
      <BouncyCheckbox
        disabled={true}
        isChecked={poll.check_test}
        style={pollStyles.bouncyCheckbox}
        textStyle={pollStyles.checkboxTextStyle}
        fillColor={Colors.ui.primary}
        iconStyle={pollStyles.checkboxStyle}
        innerIconStyle={pollStyles.checkboxStyle}
        text="시험 공지가 있었어요!"
      />
    </View>
  );
};

const BriefingScreen: React.FC<BriefingScreenProps> = ({route, navigation}) => {
  const {course, summary} = route.params;
  const [poll, setPoll] = useState<TodayPolls>();
  const [voted, setVoted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);

  const handlePollUpdate = async (data: any) => {
    let newPoll = poll!;
    newPoll.check_attention = data.check_attention;
    newPoll.check_test = data.check_test;
    newPoll.check_homework = data.check_homework;
    newPoll.answered_at = new Date();
    setPoll(newPoll);
    await fetchUpdateTodayPolls(newPoll.id, data);
    await earnPoints(RewardType.SURVEY);
  };

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setPoll(await getPollsData(Number(course.id)));
        setVoted(poll !== undefined && poll.answered_at !== null);
      } catch (e) {
        setPoll(undefined);
        setVoted(false);
      }
    };
    fetchPolls();
  }, [course, voted, poll, setVoted]);

  useEffect(() => {
    setNavigationHeader(navigation, [course.course_name, course.instructor]);
  }, [course.course_name, course.instructor, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.briefingContainer}>
        <BriefingHeader text="오늘의 브리핑" />
        <BriefingProgressBar
          imgsource={require('@assets/icons/briefing_calendar.png')}
          progress={summary.attendance_percentage}
          lectureName={course.course_name}
          text="출석체크를 진행했다고 답변했어요"
        />
        <BriefingProgressBar
          imgsource={require('@assets/icons/briefing_book.png')}
          progress={summary.assignment_percentage}
          lectureName={course.course_name}
          text="과제가 있었다고 답변했어요"
        />
        <BriefingProgressBar
          imgsource={require('@assets/icons/briefing_bell.png')}
          progress={summary.notification_percentage}
          lectureName={course.course_name}
          text="공지가 있었다고 답변했어요"
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.briefingContainer}>
        <BriefingHeader text="내가 답변한 브리핑" />
        {voted ? (
          <MyTodayPolls poll={poll!} />
        ) : (
          <AnswerTodayPolls
            courseName={course.course_name}
            handleBriefingAnswer={() => setShowModal(true)}
          />
        )}
      </View>
      <PollsModal
        course={course}
        visible={showModal}
        onClose={handleCloseModal}
        onUpdate={handlePollUpdate}
      />
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
    fontSize: FontSizes.xLarge,
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

const pollStyles = StyleSheet.create({
  bouncyCheckbox: {
    padding: 8,
  },
  checkboxTextStyle: {
    textDecorationLine: 'none',
    color: Colors.text.black,
    fontSize: FontSizes.medium,
    ...GlobalStyles.boldText,
  },
  checkboxStyle: {
    borderRadius: 2,
    borderBlockColor: Colors.ui.primary,
    width: 18,
    height: 18,
  },
});

const answerStyle = StyleSheet.create({
  container: {
    paddingVertical: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.ui.gray,
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
  },
  text: {
    color: Colors.text.accent,
    fontSize: FontSizes.medium,
    marginBottom: 8,
    ...GlobalStyles.text,
  },
  button: {
    backgroundColor: Colors.ui.primary,
    margin: 'auto',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: Colors.text.white,
    fontSize: FontSizes.small,
    margin: 'auto',
    ...GlobalStyles.boldText,
  },
});

const styles = StyleSheet.create({
  divider: {marginTop: 12},
  container: {padding: 12},
  briefingContainer: {
    backgroundColor: Colors.ui.background,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    ...GlobalStyles.shadow,
    gap: 12,
  },
  progresscontainer: {
    width: 260,
  },
  textcontainer: {
    marginLeft: 12,
    marginBottom: 4,
    ...GlobalStyles.row,
  },
  item: {
    paddingVertical: 16,
    borderColor: Colors.ui.gray,
    borderWidth: 1,
    borderRadius: 8,
  },
  text: {
    fontSize: FontSizes.medium,
    ...GlobalStyles.text,
  },
  icon: {
    width: 41,
    height: 41,
    marginLeft: 12,
    marginRight: 6,
    borderRadius: 20,
    marginVertical: 'auto',
  },
});

export default BriefingScreen;
