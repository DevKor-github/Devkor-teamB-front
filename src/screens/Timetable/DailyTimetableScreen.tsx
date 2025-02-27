import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  Alert,
} from 'react-native';

import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {CourseBlock} from '@src/Types';
import {useNavigation} from '@react-navigation/native';
import {
  getFormattedDate,
  parseTime,
} from '@src/components/Timetable/TimetableUtils';
import PollsModal from '@src/screens/Timetable/TimetablePollsModal';
import {
  fetchTodayPolls,
  fetchTodayPollsById,
  fetchUpdateTodayPolls,
  TodayPolls,
} from '@src/data/briefingApi';
import {earnPoints, RewardType} from '../Store/StoreHandler';
import {BriefingEventHandler} from '@src/Events';

const CourseItem = ({
  course,
  poll,
  active,
  expand,
  showDialog,
  callback,
}: {
  course: CourseBlock;
  poll: TodayPolls | undefined;
  active: boolean;
  expand: boolean;
  showDialog: Function;
  callback: Function;
}) => {
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const navigation = useNavigation<any>();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: expand ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [expand, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const toggleActive = () => {
    if (!poll) {
      if (!expand && isFirstOpen) {
        setIsFirstOpen(false);
        Alert.alert(
          '오늘의 브리핑 이용 불가',
          '강의를 등록한 다음 날부터 브리핑을 작성할 수 있어요. 자정이 지나면 다시 확인해 주세요!',
        );
      }
    } else if (poll.answered_at === null) {
      showDialog();
    }
    callback();
  };

  return (
    <TouchableOpacity onPress={toggleActive}>
      <View
        style={[itemStyles.container, active && itemStyles.activeContainer]}>
        <View style={itemStyles.headerRow}>
          {poll && poll.answered_at === null && (
            <Image
              source={require('@assets/icons/warn_circle.png')}
              style={[itemStyles.statusIcon]}
            />
          )}
          <Text style={itemStyles.titleText}>{course.course_name}</Text>
          <Animated.Image
            source={require('@assets/icons/arrow_right.png')}
            style={[styles.iconStyle, {transform: [{rotate: spin}]}]}
          />
        </View>
        <Text style={itemStyles.subTitleText}>
          {course.start + ' / '}
          {course.course_room + ' / '}
          {course.instructor}
        </Text>
        {expand && (
          <View>
            <View style={itemStyles.briefingContainer}>
              <View style={itemStyles.briefingTextContainer}>
                <Image
                  source={require('@assets/icons/smile_circle.png')}
                  style={itemStyles.smileIcon}
                />
                <Text style={itemStyles.briefingText}>
                  지난 시간에 출석을 불렀어요.
                </Text>
              </View>
              <View style={itemStyles.briefingTextContainer}>
                <Image
                  source={require('@assets/icons/smile_circle.png')}
                  style={itemStyles.smileIcon}
                />
                <Text style={itemStyles.briefingText}>
                  지난 시간에 과제 공지가 있었어요.
                </Text>
              </View>
              <View style={itemStyles.briefingTextContainer}>
                <Image
                  source={require('@assets/icons/smile_circle.png')}
                  style={itemStyles.smileIcon}
                />
                <Text style={itemStyles.briefingText}>
                  지난 시간에 시험 공지가 있었어요.
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={itemStyles.navigateContainer}
                onPress={() => {
                  navigation.navigate('Community', {course: course});
                }}>
                <View style={itemStyles.navigateButton}>
                  <Text style={itemStyles.navigateText}>게시글 확인하기</Text>
                  <Image
                    source={require('@assets/icons/arrow_right_circle.png')}
                    style={itemStyles.arrowIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const Separator = () => <View style={styles.separator} />;

const EmptyCourseView = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>오늘은 수업이 없는 날이에요</Text>
    </View>
  );
};

const getPollsData = async (courseId: number) => {
  const date = getFormattedDate();
  const data = await fetchTodayPolls(courseId, date);
  if (data.length === 0) {
    throw Error('Empty Polls Data');
  } else {
    const poll = data.reduce((prev, current) =>
      prev.id > current.id ? prev : current,
    );
    const todayData = await fetchTodayPollsById(poll.id);
    return todayData;
  }
};

const DailyTimetableScreen = ({courses}: {courses: CourseBlock[]}) => {
  const [activeCourse, setActiveCourse] = useState<number>(-1);
  const [selectedCourse, setSelectedCourse] = useState<number>(-1);
  const [showModal, setShowModal] = useState(false);
  const [poll, setPoll] = useState<Record<string, TodayPolls | undefined>>({});

  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    BriefingEventHandler.addListener('BRIEFING_UPDATED', (poll: TodayPolls) => {
      earnPoints(RewardType.SURVEY);
      fetchUpdateTodayPolls(poll);
      setPoll(prev => ({
        ...prev,
        [poll.course_fk]: poll,
      }));
    });

    return () => BriefingEventHandler.removeListener('BRIEFING_UPDATED');
  }, []);

  const handlePollUpdate = async (summary: any) => {
    const id = courses[selectedCourse].id;
    let data: TodayPolls | undefined = poll[id];
    if (data) {
      data.check_attention = summary.check_attention;
      data.check_test = summary.check_test;
      data.check_homework = summary.check_homework;
      data.answered_at = new Date();
      BriefingEventHandler.emit('BRIEFING_UPDATED', data);
    }
  };

  useEffect(() => {
    const fetchPolls = async () => {
      const pollData: Record<string, TodayPolls | undefined> = {};
      for (const course of courses) {
        try {
          const data = await getPollsData(Number(course.id));
          pollData[course.id] = data;
        } catch (e) {
          pollData[course.id] = undefined;
        }
      }

      setPoll(pollData);
    };
    fetchPolls();
  }, [courses]);

  useEffect(() => {
    const timer = setInterval(() => {
      const time = new Date();
      const now = parseTime(time);
      let found = false;
      for (let i = 0; i < courses.length; i++) {
        if (parseTime(courses[i].end) > now) {
          setActiveCourse(i);
          found = true;
          break;
        }
      }
      if (!found) {
        setActiveCourse(-1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [courses]);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.scrollView}
        contentContainerStyle={GlobalStyles.expand}
        ItemSeparatorComponent={Separator}
        bounces={false}
        data={courses}
        ListEmptyComponent={EmptyCourseView}
        renderItem={({item, index}: {item: CourseBlock; index: number}) => (
          <CourseItem
            course={item}
            poll={poll[item.id]}
            showDialog={() => setShowModal(true)}
            active={activeCourse === index}
            expand={selectedCourse === index}
            callback={() => {
              if (selectedCourse === index) {
                setSelectedCourse(-1);
              } else {
                setSelectedCourse(index);
              }
            }}
          />
        )}
      />
      {selectedCourse !== -1 && (
        <PollsModal
          course={courses[selectedCourse]}
          visible={showModal}
          onClose={handleCloseModal}
          onUpdate={handlePollUpdate}
        />
      )}
    </View>
  );
};

export default DailyTimetableScreen;

const itemStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ui.background,
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.ui.background,
    ...GlobalStyles.shadow,
  },
  activeContainer: {
    borderColor: Colors.ui.primary,
    borderWidth: 1,
    backgroundColor: Colors.primary[50],
  },
  statusIcon: {
    width: FontSizes.large,
    height: FontSizes.large,
    marginRight: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleText: {
    paddingRight: 6,
    textAlign: 'center',
    fontSize: FontSizes.xLarge,
    ...GlobalStyles.boldText,
  },
  subTitleText: {
    fontSize: FontSizes.medium,
    color: Colors.text.gray,
    ...GlobalStyles.text,
  },
  briefingContainer: {
    backgroundColor: Colors.ui.background,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: Colors.primary[100],
    borderWidth: 1,
    borderRadius: 10,
  },
  smileIcon: {
    width: FontSizes.large,
    height: FontSizes.large,
    marginRight: 8,
  },
  briefingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 8,
  },
  briefingText: {
    fontSize: FontSizes.large,
    ...GlobalStyles.text,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arrowIcon: {
    width: FontSizes.xLarge,
    height: FontSizes.xLarge,
    marginLeft: 8,
  },
  navigateText: {
    fontSize: FontSizes.xLarge,
    ...GlobalStyles.boldText,
  },
  navigateContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: Colors.ui.background,
    borderColor: Colors.primary[100],
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  separator: {
    height: 12,
  },
  scrollView: {
    padding: 12,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  activeLectureContent: {
    backgroundColor: '#EF478E',
    height: 25,
  },
  inactiveLectureContent: {
    backgroundColor: '#FFE6E6',
  },
  questionContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.ui.disabled,
    padding: 9,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'left',
    paddingLeft: 12,
    paddingVertical: 7,
  },
  contentText: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    paddingVertical: 2,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.shadow,
  },
  modalTitle: {
    flex: 1,
    fontSize: FontSizes.xLarge,
    alignSelf: 'center',
    paddingLeft: 8,
    ...GlobalStyles.boldText,
  },
  modalTitlePink: {
    fontSize: 17,
    fontWeight: '700',
    color: '#E8036E',
    marginBottom: 20,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  checkboxLabel: {
    fontSize: 11,
    color: '#333',
    textAlign: 'left',
  },
  submitButton: {
    backgroundColor: '#E8036E',
    borderRadius: 10,
    marginTop: 20,
    width: '40%',
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 2,
  },
  iconStyle: {
    width: 18,
    height: 18,
    tintColor: Colors.text.gray,
  },
  statusImage: {
    marginLeft: 9,
    marginTop: 5,
  },
  bellIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  bouncyCheckbox: {
    padding: 8,
  },
  checkboxTextStyle: {
    color: '#010101',
    fontWeight: '500',
    fontSize: 15,
    textDecorationLine: 'none',
    fontFamily: 'Pretendard',
    padding: 1,
    marginBottom: 1,
  },
  checkboxStyle: {
    borderRadius: 0,
    borderBlockColor: '#ff1385',
    width: 18,
    height: 18,
  },
  faceIcon: {
    width: 18,
    height: 18,
    marginRight: 9,
    marginTop: 3,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ui.background,
  },
  emptyText: {
    fontSize: FontSizes.large,
    color: Colors.text.black,
    ...GlobalStyles.text,
  },
});
