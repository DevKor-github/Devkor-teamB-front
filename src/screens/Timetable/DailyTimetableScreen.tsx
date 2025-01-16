import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
} from 'react-native';

import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {CourseBlock} from '@src/Types';
import {useNavigation} from '@react-navigation/native';
import {parseTime} from '@src/components/Timetable/TimetableUtils';
import PollsModal from '@src/screens/Timetable/TimetablePollsModal';

// const fetchValidPolls = async (id: number) => {
//   const token = await AsyncStorage.getItem('userToken');
//   const response = await axios.get(`${API_URL}/todaypolls/${id}/`, {
//     headers: {
//       authorization: `token ${token}`,
//     },
//   });
//   const createdAt = response.data.created_at;
//   console.log('생성 시간: ', createdAt);

//   const now = new Date();
//   const createdDate = new Date(createdAt).toDateString();
//   const nowDate = now.toDateString();
//   return createdDate === nowDate;
// };

// const fetchTodayPolls = async (courseId: number) => {
//   const token = await AsyncStorage.getItem('userToken');
//   const userId = await AsyncStorage.getItem('userId');
//   console.log(courseId);
//   const response = await axios.get(
//     `${API_URL}/todaypolls/?student_id=${Number(userId)}&course_fk=${courseId}`,
//     {
//       headers: {
//         authorization: `token ${token}`,
//       },
//     },
//   );

//   return response.data
//     .map((poll: any) => fetchValidPolls(poll.id))
//     .some((valid: boolean) => valid);
// };

const CourseItem = ({
  course,
  active,
  expand,
  showDialog,
  callback,
}: {
  course: CourseBlock;
  active: boolean;
  expand: boolean;
  showDialog: Function;
  callback: Function;
}) => {
  const navigation = useNavigation<any>();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [voted] = useState(false);

  // useEffect(() => {
  //   const fetchPolls = async () => {
  //     const hasVoted = await fetchTodayPolls(Number(course.id));
  //     setVoted(hasVoted);
  //   };
  //   fetchPolls();
  // }, [course.id]);

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
    if (!voted) {
      showDialog();
    }
    callback();
  };

  return (
    <TouchableOpacity onPress={toggleActive}>
      <View
        style={[itemStyles.container, active && itemStyles.activeContainer]}>
        <View style={itemStyles.headerRow}>
          {!voted && (
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
                  출석을 자주 부르는 과목이에요.
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
                  지난 시간에 휴강 공지가 있었어요.
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

const DailyTimetableScreen = ({courses}: {courses: CourseBlock[]}) => {
  const [activeCourse, setActiveCourse] = useState<number>(-1);
  const [selectedCourse, setSelectedCourse] = useState<number>(-1);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const time = new Date();
      const now = parseTime(time);
      for (let i = 0; i < courses.length; i++) {
        if (parseTime(courses[i].end) > now) {
          setActiveCourse(i);
          break;
        }
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
