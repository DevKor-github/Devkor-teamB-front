import React, { useState, useEffect } from 'react';
import { mockLectures } from '../../MockData.tsx';
import Accordion from 'react-native-collapsible/Accordion';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign.js';
import { useNavigation } from '@react-navigation/native';
import PollsModal from './PollsModal.tsx';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { filter } from 'fontawesome-free-6.5.2-web/js/v4-shims.js';
import { ColorSpace } from 'react-native-reanimated';


const API_URL = 'http://15.165.198.75:8000';

const getCurrentDay = () => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date(2024, 8, 2);
  return days[today.getDay()];
};

//user의 id 정보 불러오기
const fetchUserData = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/student/user-info/`, {
          headers: {
            Authorization: `token ${token}`,
          }
        });
        console.log('user_id: ', response.data.user_id);
        const user_id =  response.data.user_id;
         return user_id;
  }catch(e){
    console.error('Error:', e);
    return null;
  } 

}
//user의 id가지고 user가 등록한 시간표 불러오는 함수
const fetchUserTimetable = async (user_id : string) => {
  try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/timetables/${user_id}/`, {
        headers: {
          Authorization: `token ${token}`,
        }
      });
      return response.data;
    } catch (e) {
      console.error('Error fetching timetable:', e);
      return null;
    }
  }
  
//user가 가진 시간표 호출하는 함수
const fetchAndLogLectureDetails = async () => {
  const user_id = await fetchUserData(); // Assuming fetchUserData() is defined and working
  if (user_id) {
    const timetable = await fetchUserTimetable(user_id); // Assuming fetchUserTimetable() is defined and working
    // const courseWeeks = timetable.courses.map(timetable => timetable.course_week);
    console.log('user가 가진 ', timetable);
    const lectureTime = timetable.courses.map(timetable => timetable.course_period);
    console.log('수업 시간 출력해볼라고: ', lectureTime);
    return timetable;
    // console.log('user가 가 courseweeks ', courseWeeks);
  }
};

// const table = fetchAndLogLectureDetails();
const filterLecture = async () => {
  const timetable = await fetchAndLogLectureDetails();
  // console.log("timetable 저장 완료: ", timetable);
  // const courseWeeks = timetable.courses.map(course => course.course_week);
  // console.log(courseWeeks);
  if (!timetable || !timetable.courses) {
    console.log("시간표를 불러오지 못했습니다.");
    return;
  }

  const day = getCurrentDay();
  console.log("오늘 요일: ", day);

  // 요일에 해당하는 수업 필터링
  const todayLectures = timetable.courses.filter(course => 
    // course.course_week.some((timeSlot) => timeSlot.day === day)
    course.course_week.some((timeSlot) => timeSlot.includes(day))

  );
  
  console.log("오늘의 수업: ", todayLectures);
  return todayLectures;
}

filterLecture();

//일단 그냥 모든 시간표로 요일 정리해보기 
// const fetchData = async () => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const response = await axios.get(`${API_URL}/courses/`, {
//       headers: {
//         authorization: `token ${token}`,
//       },
//     });
//     const lectureInfo = response.data;
//     console.log(lectureInfo);
//     return lectureInfo;

//   } catch (e) {
//     console.error(e);
//   }
// };

// fetchData();

const filterLecturesByDay = (lectures: any[], day: string) => {
  return lectures.filter(lecture =>
    lecture.time.some((timeSlot: any) => timeSlot.day === day)
  ).map(lecture => {
    const TimeSlot = lecture.time.find((timeSlot: any) => timeSlot.day === day);
    return {
      id: lecture.id,
      name: lecture.name,
      start: TimeSlot?.start,
      end: TimeSlot?.end,
      room: lecture.room,
      professor: lecture.professor,
      content: [
        '출석을 자주 부르는 과목이에요.',
        '지난 시간에 과제 공지가 있었어요.',
        '지난 시간에 휴강 공지가 있었어요.',
      ],
      briefing: '게시글 확인하기',
      survey: [],
    };
  });
};




const currentDay = getCurrentDay();
console.log(currentDay);
//filterlecture가 app 실행 전에 다 끝마쳐져야 함! 그래서 여기선 안 먹음
// const todayLectures_2 = filterLecture();
// console.log('수정한 오늘의 강의들: ', todayLectures_2);
const todayLectures = filterLecturesByDay(mockLectures, currentDay);
// console.log('원본의 오늘의 강의들: ', todayLectures);
// const todayLectures = filterLecture();

const App = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [lectureClicks, setLectureClicks] = useState<{ [key: string]: number }>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [todayLectures, setTodayLectures] = useState<any[]>([]); // 상태 추가
  const [isPollAnswered, setIsPollAnswered] = useState<boolean |false>(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLectures = async () => {
      const lectures = await filterLecture();
      console.log('Fetched lectures:', lectures); // filterLecture로 반환된 값을 콘솔에 출력

      setTodayLectures(lectures || []); // 받아온 데이터를 상태로 저장
    };
    fetchLectures();
    console.log('오늘의 강의들(상태로 저장된거)', todayLectures);
  }, []);

  const lectureBriefing = async () => {
    
  }
  const fetchBriefings = async (courseId: Number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/briefings/${courseId}`, {
        headers: {
          Authorization: `token ${token}`,
        },
        // params: {
        //   course_fk: courseId,
        // },
      });
      console.log('courseId as input: ', courseId);
      console.log('Fetched briefings:', response.data); // 브리핑 데이터를 콘솔에 출력
      return response.data;
    } catch (error) {
      console.error('Error fetching briefings:', error);
      return null;
    }
  };
  // const handleSetSections = async (section: any[]) => {
  //   if (section.length === 0 || section[0] === undefined) {
  //     setActiveSection(null);
  //     return;
  //   }
  //   const selectedLectureId = todayLectures[section[0]]?.id;

  //   if (!selectedLectureId) {
  //     setActiveSection(null);
  //     return;
  //   }

  //   if (!lectureClicks[selectedLectureId]) {
  //     setShowModal(true);
  //     setSelectedLecture(todayLectures[section[0]]);
  //     setLectureClicks({
  //       ...lectureClicks,
  //       [selectedLectureId]: 1,
  //     });
  //     setActiveSection(section.includes(undefined) ? null : section[0]);

  //     const briefings = await fetchBriefings(selectedLectureId);
  //     // console.log('Briefings for selected lecture:', briefings);
  //     setSelectedLecture({ ...todayLectures[section[0]], content: briefings });

  //   } else {
  //     setLectureClicks({
  //       ...lectureClicks,
  //       [selectedLectureId]: lectureClicks[selectedLectureId] + 1,
  //     });
  //     setActiveSection(section.includes(undefined) ? null : section[0]);
  //     setSelectedLecture(todayLectures[section[0]]);
  //   }
  // };
  const handleSetSections = async (section: any[]) => {
    if (section.length === 0 || section[0] === undefined) {
      setActiveSection(null);
      return;
    }
    const selectedLectureId = todayLectures[section[0]]?.id;
  
    if (!selectedLectureId) {
      setActiveSection(null);
      return;
    }
  
    if (!lectureClicks[selectedLectureId]) {
      setShowModal(true);
      setSelectedLecture(todayLectures[section[0]]);
      setLectureClicks({
        ...lectureClicks,
        [selectedLectureId]: 1,
      });
      setActiveSection(section.includes(undefined) ? null : section[0]);
  
      const briefings = await fetchBriefings(selectedLectureId);
  
      // Briefing 결과에 따라 새로운 briefingResult 변수 생성
      const briefingResult = {
        attendance: briefings.content.summary.attendance_percentage >= 50,
        notification: briefings.content.summary.notification_percentage >= 50,
        assignment: briefings.content.summary.assignment_percentage >= 50,
      };
  
      console.log('Briefing Result:', briefingResult);
  
      // 선택된 강의에 브리핑 내용 및 결과 추가
      // setSelectedLecture({ ...todayLectures[section[0]], content: briefings, briefingResult });
      // 선택된 섹션에 briefingResult를 포함시켜 상태 업데이트
    const updatedSection = { ...todayLectures[section[0]], briefingResult };
    setSelectedLecture(updatedSection);

    // 오늘의 강의들 상태에 업데이트된 섹션 반영
    const updatedLectures = todayLectures.map((lecture, idx) => 
      idx === section[0] ? updatedSection : lecture
    );
    setTodayLectures(updatedLectures);

  
    } else {
      setLectureClicks({
        ...lectureClicks,
        [selectedLectureId]: lectureClicks[selectedLectureId] + 1,
      });
      setActiveSection(section.includes(undefined) ? null : section[0]);
      setSelectedLecture(todayLectures[section[0]]);
    }
  };
  

 

  //현재시간 저장 
  const beforeConvert = new Date(2024, 8, 6, 12, 0, 0).toTimeString().slice(0, 5);
  console.log(beforeConvert);

  const renderHeader = (section: any, _: any, isActive: boolean) => {

    const convertTimeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }
    const currentTime = convertTimeToMinutes(beforeConvert); 
    //section을 아직 몰라 ..
    // const startTime = convertTimeToMinutes(section.start);
    // const endTime = convertTimeToMinutes(section.end);

    // const startTime = convertTimeToMinutes(section.course_period[0]?.[0]); // 예: "09:00" 형식의 시간값이 course_period 배열의 첫번째에 있다고 가정
    // const endTime = convertTimeToMinutes(section.course_period[0]?.[1]); // 종료 시간도 동일한 방식으로 가정
    // console.log('starttime2: ', startTime_2);

    const isNowInLectureTime = () => {
      return currentTime >= startTime && currentTime <= endTime;
    }

    const isLectureEnded = ()=>{
        return startTime <= currentTime;
    }

    const isTouched = () => !lectureClicks[section.id];
    // console.log(selectedLecture,"강의 설문 클릭했니??? 횟수: ", lectureClicks[selectedLecture.id])
    return (
      <Animatable.View duration={400} transition="backgroundColor">
        <Animatable.View
          style={[
            styles.lectureHeader,
            isActive && styles.nowLectureHeaderActive
            // (isNowInLectureTime() && !isActive) && styles.nowLectureHeader,
            // (isNowInLectureTime() && isActive) && styles.nowLectureHeaderActive,
            // (!isNowInLectureTime() && isActive) && styles.lectureHeaderActive,
          ]}
        >
          <View style={styles.headerRow}>
            <Image
              // source={isLectureEnded() ? {{isTouched() ? require('@assets/images/statusBlue.png') : require('@assets/icons/warn_circle_!.png')}}: {}}
              // style={styles.statusImage}
              source={
                // require('@assets/icons/warn_circle_!.png') 
                // isLectureEnded()
                //   ? 
                isTouched()
                    ? require('@assets/icons/warn_circle_!.png') 
                    : require('@assets/images/statusBlue.png')
                //   : {}
              }
              style={styles.statusImage}
            />
            <Text style={styles.lectureHeaderText}>{section.course_name} </Text>
            <Icon name={isActive ? 'down' : 'right'} size={15} color="#333" style={styles.iconStyle} />
          </View>
          <Text style={styles.lectureHeaderSubText}>{section.course_period} / {section.course_room} / {section.instructor}</Text>

          {isActive && 
          <View style={styles.lectureContent}>
            {/* <View> */}
              {/* {section.content.map((item: any, index: any) => (
                <View key={index} style={styles.checkboxContainer}>
                  <Image source={require('@assets/icons/icon_smile.png')} style={styles.faceIcon} />
                  <Text style={styles.contentText}>{item}</Text>
                </View>
              ))} */}
            {/* </View> */}
            {/* 새로운 briefingResult를 화면에 표시 */}
            <View style={styles.checkboxContainer}>
            <Image source={require('@assets/icons/icon_smile.png')} style={styles.faceIcon} />
              <Text style={styles.contentText}>
                {section.briefingResult?.attendance ? '출석 체크를 진행했어요!' : '출석 체크는 없었어요!' }
              </Text>
            </View>
            <View style={styles.checkboxContainer}>
            <Image source={require('@assets/icons/icon_smile.png')} style={styles.faceIcon} />
              <Text style={styles.contentText}>
               {section.briefingResult?.notification ? '지난 시간에 공지가 있었어요!' : '공지는 없었어요!'}
              </Text>
            </View>
            <View style={styles.checkboxContainer}>
            <Image source={require('@assets/icons/icon_smile.png')} style={styles.faceIcon} />
              <Text style={styles.contentText}>
                {section.briefingResult?.assignment ? '지난 시간에 과제가 있었어요!' : '과제는 없었어요!'}
              </Text>
            </View>

          </View>
          }

          {isActive &&
            <View>
              <TouchableOpacity style={styles.briefingButton}
                onPress={() => { navigation.navigate('Community', {course: section}) }}
              >
                <View style={styles.navigateButtonInOneRow}>
                  <Text style={styles.briefingText}>게시판 확인하기</Text>
                  <Image source={require('@assets/icons/icon_arrow_circle.png')} style={styles.arrowIcon} />
                </View>
              </TouchableOpacity>
            </View>
          }

        </Animatable.View>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
        <Accordion
          activeSections={[activeSection]}
          sections={todayLectures}
          // sections={filterLecture}
          touchableComponent={TouchableOpacity}
          expandMultiple={false}
          renderHeader={renderHeader}
          renderContent={() => null}
          duration={400}
          onChange={handleSetSections}
        />
      </ScrollView>

      <PollsModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        selectedLecture={selectedLecture}
        lectureId={selectedLecture?.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '100%',
    padding: 10,
  },
  lectureHeader: {
    backgroundColor: '#FFF',
    padding: 7,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 3,
    borderColor: '#FFF',
    borderWidth: 2.5,
    height: 85,
    elevation: 8,
    overflow: 'hidden',
  },
  nowLectureHeader: {
    backgroundColor: '#FFE7F3',
    padding: 7,
    borderRadius: 10,
    marginVertical: 5,
    borderColor: '#FF1485',
    borderWidth: 1.5,
    height: 85,
    elevation: 8,
    overflow: 'hidden',
  },
  lectureHeaderActive: {
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    height: 290,
    overflow: 'hidden',
  },
  nowLectureHeaderActive: {
    backgroundColor: '#FFE7F3',
    borderColor: '#FF1485',
    height: 290,
    overflow: 'hidden',
  },
  lectureHeaderText: {
    paddingVertical: 1,
    paddingLeft: 10,
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 5,
    color: '#333',
    marginRight: 3,
  },
  lectureHeaderSubText: {
    paddingLeft: 10,
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '400',
    marginVertical: 1,
    color: '#666',
  },
  lectureContent: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FF4081',
    marginTop: 12,
    paddingVertical: 10,
    height: 140,
    borderColor: '#EDB5D0',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  briefingButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#FFF',
    borderColor: '#EDB5D0',
    borderRadius: 10,
    borderWidth: 1,
    height: 53,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  briefingText: {
    color: '#2D0519',
    fontWeight: '700',
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  statusImage: {
    marginLeft: 9,
    marginTop: 5,
  },
  faceIcon: {
    width: 18,
    height: 18,
    marginRight: 9,
    marginTop: 3,
  },
  navigateButtonInOneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arrowIcon: {
    width: 18,
    height: 18,
    marginRight: 9,
    marginTop: 3,
    marginLeft: 9,
  },
  iconStyle: {
    marginTop: 3,
  },
});

export default App;
