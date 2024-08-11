import React, { useState } from 'react';
import { mockLectures } from '../../MockData.tsx';
import Accordion from 'react-native-collapsible/Accordion';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/AntDesign.js';
import {HeaderStyleInterpolators, StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

const getCurrentDay = () => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date(2024, 8, 2);
  return days[today.getDay()];
};

const filterLecturesByDay = (lectures: any[], day: string) => {
  return lectures.filter(lecture =>
    lecture.time.some((timeSlot: any) => timeSlot.day === day)
  ).map(lecture => {
    const TimeSlot = lecture.time.find((timeSlot: any) => timeSlot.day === day);
    return{
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
  }});
};

const currentDay = getCurrentDay();
const todayLectures = filterLecturesByDay(mockLectures, currentDay);

const App = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [lectureClicks, setLectureClicks] = useState<{ [key: string]: number }>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [modalOptions, setModalOptions] = useState<{ [key: string]: any }>({});
  const[checkboxState, setCheckboxState] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleSetSections = (section: any[]) => {
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
        [selectedLectureId]: 1, // 클릭 횟수를 1로 설정
      });
      setActiveSection(section.includes(undefined) ? null : section[0]);
      setModalOptions({
        ...modalOptions,
        [selectedLectureId]: modalOptions[selectedLectureId] || {
          attendance: false,
          assignment: false,
          announcement: false,
          none: false,
        }
      });
    } else {
      setLectureClicks({
        ...lectureClicks,
        [selectedLectureId]: lectureClicks[selectedLectureId] + 1,
      });
      setActiveSection(section.includes(undefined) ? null : section[0]);
      setSelectedLecture(todayLectures[section[0]]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOptionChange = (option: string) => {
    if (selectedLecture) {
      const lectureId = selectedLecture.id;
      setModalOptions(prevModalOptions => ({
        ...prevModalOptions,
        [lectureId]: {
          ...prevModalOptions[lectureId],
          [option]: !prevModalOptions[lectureId][option],
        }
      }));
    }
  };

  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  const isNowInLectureTime = (section: any) => {
    const beforeConvert = new Date(2024,8,6,13,45,0).toTimeString().slice(0, 5)
    const currentTime = convertTimeToMinutes(beforeConvert); // 현재 시간 "HH:mm" 형식으로 변환
    const startTime = convertTimeToMinutes(section.start);
    const endTime = convertTimeToMinutes(section.end);
    return currentTime >= startTime && currentTime <= endTime;
  }

  const isTouched = (section: any) => {
    if (!lectureClicks[section.id]) return true;
    else  return false; 
  }
  const renderHeader = (section: any, _: any, isActive: boolean) => {
    const value = isNowInLectureTime(section);
    console.log({value});

    return(
      <Animatable.View duration={400} transition="backgroundColor">

<Animatable.View  style={[
          styles.lectureHeader,
          isNowInLectureTime(section) && styles.nowLectureHeader, // 현재 시간이 수업 시간이라면 적용
          isActive && styles.lectureHeaderActive, // 활성 상태라면 적용
         ]}>
          <View style={styles.headerRow}>
        <Image source={ isTouched(section)? 
                        require('@assets/images/statusBlue.png') : require('@assets/images/statusGreen.png')} // Replace with your avatar image URL
                        style={styles.statusImage}
                    />
{/* <Image source={lectureClicks(section.id) > 0  ? require('@assets/images/statusBlue.png'): require('@assets/images/statusGreen.png'} style={styles.statusImage}/> */}
          <Text style={styles.lectureHeaderText}>{section.name} </Text>
          <Icon name={isActive ? 'down' : 'right'} size={15} color="#333" style={styles.iconStyle} />
        </View>
        <Text style={styles.lectureHeaderSubText}>{section.start} / {section.room} / {section.professor}</Text>
        
        
        {isActive && <View style={styles.lectureContent}>
          <View>
            {section.content.map((item: any, index: any) => (
              <View key={index} style={styles.checkboxContainer}>
                <Image source={ require('@assets/icons/icon_smile.png')} style={styles.faceIcon}/>
                <Text style={styles.contentText}>{item}</Text>
              </View>
            ))}
          </View>
          </View>
          }

        {isActive&&
          <View>
            <TouchableOpacity style={styles.briefingButton}
            onPress={() => {navigation.navigate('Community', { id: section.id })}}
              >
                <View style={styles.navigateButtonInOneRow}>
              <Text style={styles.briefingText}>{section.briefing}</Text>
              <Image source={ require('@assets/icons/icon_arrow_circle.png')} style={styles.arrowIcon}/>
                </View>
            </TouchableOpacity>
            </View>
          }
        
 </Animatable.View>
  
      </Animatable.View>
    );
  };

  const renderContent = (section: any, _: any, isActive: boolean) => {
    return null; // isActive가 false일 때는 아무것도 렌더링하지 않음
  };
  

  const lectureId = selectedLecture?.id;
  const currentOptions = modalOptions[lectureId] || {
    attendance: false,
    assignment: false,
    announcement: false,
    none: false,
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
        <Accordion
          activeSections={[activeSection]}
          sections={todayLectures}
          touchableComponent={TouchableOpacity}
          expandMultiple={false}
          renderHeader={renderHeader}
          renderContent={renderContent}
          duration={400}
          onChange={handleSetSections}
        />
      </ScrollView>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.headerRow}>
            <Image
                        source={require('@assets/images/bellImage.png')} 
                        style={styles.bellImage}
                    />
              <Text style={styles.modalTitle}>오늘 <Text style={styles.modalTitlePink}>{selectedLecture?.name}</Text>의 {'\n'}어떤 공지가 있었나요?</Text>
            </View>

            <View style={styles.questionContainer}>
              <BouncyCheckbox style={styles.bouncyCheckbox} 
               textStyle={styles.checkboxTextStyle} fillColor={'#ff1385'} iconStyle={styles.checkboxStyle} innerIconStyle={styles.checkboxStyle}
              text="출석체크를 진행했어요!" onPress={() => {setCheckboxState(!checkboxState)}}/>
            {/* <View style={styles.checkboxContainer}> */}
              {/* <Text style={styles.checkboxLabel}>출석체크를 진행했어요!</Text> */}
            {/* </View> */}

              <BouncyCheckbox style={styles.bouncyCheckbox} 
              textStyle={styles.checkboxTextStyle} fillColor={'#ff1385'} iconStyle={styles.checkboxStyle} innerIconStyle={styles.checkboxStyle} 
              text="과제가 있었어요!"onPress={() => {setCheckboxState(!checkboxState)}}/>

              <BouncyCheckbox style={styles.bouncyCheckbox} 
              textStyle={styles.checkboxTextStyle} fillColor={'#ff1385'} iconStyle={styles.checkboxStyle} innerIconStyle={styles.checkboxStyle}
              text="공지가 있었어요!" onPress={() => {setCheckboxState(!checkboxState)}}/>
              
              <BouncyCheckbox style={styles.bouncyCheckbox} 
              textStyle={styles.checkboxTextStyle} fillColor={'#ff1385'} iconStyle={styles.checkboxStyle} innerIconStyle={styles.checkboxStyle}
              text="해당사항 없음!" onPress={() => {setCheckboxState(!checkboxState)}}/> 
           </View>

            <TouchableHighlight style={styles.submitButton} onPress={handleCloseModal}>
              <Text style={styles.submitButtonText}>제출하기</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '100%',
    padding: 10,

  },
  lectureContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    borderColor: '#FFF',
    borderWidth: 1,
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
  activeLectureContent: {
    backgroundColor: '#EF478E',
    height: 25,
  },
  inactiveLectureContent: {
    backgroundColor: '#FFE6E6',
  },
  questionContainer:{
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 9,
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 0 }, // 그림자 오프셋
    shadowOpacity: 0.25, // 그림자 투명도
    shadowRadius: 3, // 그림자 반경

    // Android 그림자 설정
    elevation: 3, // 그림자 강도 (Android에서는 elevation으로 설정)
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'left',
    paddingLeft: 12,
    paddingVertical: 7,
  },
  checkbox: {
    marginRight: 10,
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
  modalContainer: { //modal 뒷 배경
    flex: 1,
    borderRadius: 0, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(121,111,116,0.95)',
  },
  modalContent: {
    padding: 20,
    width: '80%',
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: 'rgba(169, 130, 152, 0.25)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'black',
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 8,
  },
  modalTitlePink:{
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
    marginTop: 3,
  },
  statusImage:{
    marginLeft: 9,
    marginTop: 5,
  },
  bellImage: {
    marginBottom: 10, 
  },
  bouncyCheckbox:{
    padding: 8,
  },
  checkboxTextStyle:{
    color: '#010101',
    fontWeight: '500',
    fontSize: 15,
    textDecorationLine: "none",
    fontFamily: 'Pretendard',
    padding: 1,
    marginBottom: 1,
  },
  checkboxStyle:{
    borderRadius: 0,
    borderBlockColor: '#ff1385',
    width: 18,
    height: 18,
  },
  faceIcon:{
    width: 18, 
    height: 18,
    marginRight: 9,
    marginTop: 3,
    
  },
  navigateButtonInOneRow:{
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'flex-end',

  },
  arrowIcon:{
    width: 18, 
    height: 18,
    marginRight: 9,
    marginTop: 3,
    marginLeft: 9,


  }
});

export default App;
