import React, {useState} from 'react';
import {View, Text, StyleSheet, Modal, Image} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {API_URL} from '@env';
// import {Course, CourseBlock} from '@src/Types';
import {CourseBlock} from '@src/Types';
import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {TouchableOpacity} from 'react-native-gesture-handler';
// import jwtDecode from 'jwt-decode';
// import { default as jwtDecode } from 'jwt-decode';
// import jwtDecode = require('jwt-decode');

// const PollsModal = ({ visible, onClose, selectedLecture, lectureId }) => {
//   const [checkboxState, setCheckboxState] = useState<{ [key: string]: any }>({});

//   const handleCheckboxChange = (lectureId: string, key: string) => {
//     setCheckboxState((prevState) => ({
//       ...prevState,
//       [lectureId]: {
//         ...prevState[lectureId],
//         [key]: !prevState[lectureId]?.[key],
//       }
//     }));
//     console.log("checkState print: ", checkboxState);
//   };

//   const handleCloseModal = () => {
//     if (!selectedLecture || !selectedLecture.id) {
//       console.error("No lecture selected or invalid lectureId");
//       return;
//     }

//     const handleData = async () => {
//       const lectureState = checkboxState[lectureId] || {
//         attendance: false,
//         assignment: false,
//         notice: false,
//       };

//       const PollsData = {
//         check_attention: lectureState.attendance,
//         check_test: lectureState.notice,
//         check_homework: lectureState.assignment,
//         expired: false, // Assuming "해당사항 없음" is mapped to "expired" //이건 back에서 처리??
//         course_fk: 3, // Assuming `course_fk` is the course ID
//         student:  1, // Assuming student ID is 0;
//       }

//       console.log("PollsData to send:", PollsData);
//       console.log("course_fk type", typeof(PollsData.course_fk));

//       //POST!!

//       // GET !!
//       // try{
//       //   const token = await AsyncStorage.getItem('userToken');
//       //   const response = await axios.get(`${API_URL}/todaypolls/`,
//       //     {
//       //       headers: {
//       //       Authorization: `token ${token}`,
//       //     }
//       //   });

//       //   if (response.status === 200) {
//       //         onClose();
//       //         console.log("submit success");
//       //         console.log(response.data);
//       //       }

//       // } catch(e){
//       //   onClose();
//       // }

//       // const id = 4;
//       // try{
//       //   const token = await AsyncStorage.getItem('userToken');
//       //   const response = await axios.get(`${API_URL}/todaypolls/${id}`,
//       //     {
//       //       headers: {
//       //       Authorization: `token ${token}`,
//       //     }
//       //   });

//       //   if (response.status === 204 || response.status === 200) {  // 생성 성공
//       //     onClose();  // 모달 닫기
//       //     console.log("response : " , response.data);
//       //     // console.log('Delete success');
//       //   } else {
//       //     console.log('Unexpected response:', response.status);
//       //   }
//       // } catch (e :any) {
//       //   if (e.response) {
//       //     console.log('Error response data:', e.response.data);
//       //   } else {
//       //     console.log('Request failed:', e.message);
//       //   }
//       //   onClose();  // 실패 시에도 모달 닫기
//       // }

//       try{
//         const token = await AsyncStorage.getItem('userToken');
//         const response = await axios.get(`${API_URL}/courses/`,
//           {
//             headers: {
//             Authorization: `token ${token}`,
//           }
//         });
//         if (response.status === 204 || response.status === 200) {  // 생성 성공
//           onClose();  // 모달 닫기
//           console.log("response : " , response.data);
//           const targetCourseId = 'test7';  // 여기에 원하는 course_id 값을 입력하세요.
//           let targetId: any = null;
//           // 응답 데이터에서 특정 course_id를 가진 객체 찾기
//           response.data.forEach( course => {
//             if (course.course_id === targetCourseId) {
//               targetId = course.id;  // 해당 course_id를 가진 id 값을 targetId에 저장
//               }
//               console.log('course_fk', targetId);
//        }); // console.log('Delete success');
//        try {

//         const token = await AsyncStorage.getItem('userToken');
//         const response = await axios.post(`${API_URL}/todaypolls/`, PollsData,
//           {
//             headers: {
//             Authorization: `token ${token}`,
//           }
//         });

//         console.log(response.status);
//         if (response.status === 201) {
//           onClose();
//           console.log("submit success");
//         }

//       } catch (error: any) {
//         // console.error(e);
//         // onClose();
//         if (error.response) {
//           console.log('Error response data:', error.response.data);
//           console.log('Error response status:', error.response.status);
//           console.log('Error response headers:', error.response.headers);
//         } else if (error.request) {
//           console.log('No response received:', error.request);
//         } else {
//           console.log('Error in setting up request:', error.message);
//         }
//         onClose();
//             }

//         } else {
//           console.log('Unexpected response:', response.status);
//         }
//       } catch (e :any) {
//         if (e.response) {
//           console.log('Error response data:', e.response.data);
//         } else {
//           console.log('Request failed:', e.message);
//         }
//         onClose();  // 실패 시에도 모달 닫기
//       }
//     }
//     handleData();

//   };

interface PollsModalProps {
  course: CourseBlock;
  visible: boolean;
  onClose: Function;
}

const PollsModal: React.FC<PollsModalProps> = ({course, visible, onClose}) => {
  const [checkboxState, setCheckboxState] = useState<{[key: string]: any}>({});

  const handleCheckboxChange = (lectureId: string, key: string) => {
    setCheckboxState(prevState => ({
      ...prevState,
      [lectureId]: {
        ...prevState[lectureId],
        [key]: !prevState[lectureId]?.[key],
      },
    }));
    console.log('checkState print: ', checkboxState);
  };

  const handleCloseModal = () => {
    onClose();
    // const handleData = async () => {
    //   try {
    //     const token = await AsyncStorage.getItem('userToken');
    //     const response = await axios.get(`${API_URL}/courses/`, {
    //       headers: {
    //         Authorization: `token ${token}`,
    //       },
    //     });

    //     if (response.status === 200 || response.status === 204) {
    //       //여기를 고쳐야합니다 !!!! 강의 학수번호에 맞춰서 !!!
    //       const targetCourseId = 'test7'; // Replace 'test7' with the desired course_id value
    //       let targetId = null;

    //       // Find the course with the specific course_id
    //       response.data.forEach((item: Course) => {
    //         if (item.course_id === targetCourseId) {
    //           targetId = item.course_id; // Store the id
    //         }
    //       });

    //       if (targetId) {
    //         console.log('course_fk:', targetId);

    //         const lectureState = checkboxState[course.course_id] || {
    //           attendance: false,
    //           assignment: false,
    //           notice: false,
    //         };

    //         const PollsData = {
    //           check_attention: lectureState.attendance,
    //           check_test: lectureState.notice,
    //           check_homework: lectureState.assignment,
    //           expired: false,
    //           course_fk: targetId,
    //           student: 1,
    //         };

    //         // Now, post the data
    //         const postResponse = await axios.post(
    //           `${API_URL}/todaypolls/`,
    //           PollsData,
    //           {
    //             headers: {
    //               Authorization: `token ${token}`,
    //             },
    //           },
    //         );

    //         if (postResponse.status === 201) {
    //           console.log('Submit success');
    //           onClose();
    //         } else {
    //           console.log(
    //             'Unexpected response during POST:',
    //             postResponse.status,
    //           );
    //         }
    //       } else {
    //         console.error(`Course with course_id ${targetCourseId} not found.`);
    //         onClose();
    //       }
    //     } else {
    //       console.log('Unexpected response:', response.status);
    //     }
    //   } catch (error) {
    //     console.error('Error:', error);
    //     onClose();
    //   }
    // };
    // handleData();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => onClose()}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <Image
              resizeMode="contain"
              source={require('@assets/icons/briefing_bell.png')}
              style={styles.bellIcon}
            />
            <Text style={styles.modalTitle}>
              오늘{' '}
              <Text style={styles.modalTitleAccent}>{course.course_name}</Text>
              의 {'\n'}어떤 공지가 있었나요?
            </Text>
          </View>

          <View style={styles.questionContainer}>
            <BouncyCheckbox
              style={styles.bouncyCheckbox}
              textStyle={styles.checkboxTextStyle}
              fillColor={Colors.ui.primary}
              iconStyle={styles.checkboxStyle}
              innerIconStyle={styles.checkboxStyle}
              text="출석체크를 진행했어요!"
              onPress={() => {
                handleCheckboxChange(course.course_id, 'attendance');
              }}
            />
            <BouncyCheckbox
              style={styles.bouncyCheckbox}
              textStyle={styles.checkboxTextStyle}
              fillColor={Colors.ui.primary}
              iconStyle={styles.checkboxStyle}
              innerIconStyle={styles.checkboxStyle}
              text="과제가 있었어요!"
              onPress={() => {
                handleCheckboxChange(course.course_id, 'assignment');
              }}
            />
            <BouncyCheckbox
              style={styles.bouncyCheckbox}
              textStyle={styles.checkboxTextStyle}
              fillColor={Colors.ui.primary}
              iconStyle={styles.checkboxStyle}
              innerIconStyle={styles.checkboxStyle}
              text="공지가 있었어요!"
              onPress={() => {
                handleCheckboxChange(course.course_id, 'notice');
              }}
            />
            <BouncyCheckbox
              style={styles.bouncyCheckbox}
              textStyle={styles.checkboxTextStyle}
              fillColor={Colors.ui.primary}
              iconStyle={styles.checkboxStyle}
              innerIconStyle={styles.checkboxStyle}
              text="해당사항 없음!"
              onPress={() => {
                handleCheckboxChange(course.course_id, 'none');
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCloseModal}>
            <Text style={styles.submitButtonText}>제출하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 12,
  },
  scrollView: {
    padding: 12,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.ui.background,
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
  modalTitleAccent: {
    color: Colors.text.accent,
  },
  submitButton: {
    backgroundColor: Colors.ui.primary,
    borderRadius: 10,
    marginTop: 12,
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  submitButtonText: {
    color: Colors.text.white,
    fontSize: FontSizes.large,
    textAlign: 'center',
    ...GlobalStyles.boldText,
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

export default PollsModal;
