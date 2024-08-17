import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Modal,
  Image,
} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import jwtDecode from 'jwt-decode';
// import { default as jwtDecode } from 'jwt-decode';
// import jwtDecode = require('jwt-decode');
const API_URL = "http://15.165.198.75:8000";



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

const PollsModal = ({ visible, onClose, selectedLecture, lectureId }) => {
  const [checkboxState, setCheckboxState] = useState<{ [key: string]: any }>({});

  const handleCheckboxChange = (lectureId: string, key: string) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [lectureId]: {
        ...prevState[lectureId],
        [key]: !prevState[lectureId]?.[key],
      }
    }));
    console.log("checkState print: ", checkboxState);
  };

  const handleCloseModal = () => {
    if (!selectedLecture || !selectedLecture.id) {
      console.error("No lecture selected or invalid lectureId");
      return;
    }
    
    const handleData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/courses/`, {
          headers: {
            Authorization: `token ${token}`,
          }
        });

        if (response.status === 200 || response.status === 204) {
          //여기를 고쳐야합니다 !!!! 강의 학수번호에 맞춰서 !!!
          const targetCourseId = 'test7';  // Replace 'test7' with the desired course_id value
          let targetId = null;

          // Find the course with the specific course_id
          response.data.forEach(course => {
            if (course.course_id === targetCourseId) {
              targetId = course.id;  // Store the id
            }
          });

          if (targetId) {
            console.log('course_fk:', targetId);

            const lectureState = checkboxState[lectureId] || {
              attendance: false,
              assignment: false,
              notice: false,
            };

            const PollsData = {
              check_attention: lectureState.attendance,
              check_test: lectureState.notice,
              check_homework: lectureState.assignment,
              expired: false, 
              course_fk: targetId,   
              student: 1, 
            };

            // Now, post the data
            const postResponse = await axios.post(`${API_URL}/todaypolls/`, PollsData, {
              headers: {
                Authorization: `token ${token}`,
              }
            });

            if (postResponse.status === 201) {
              console.log("Submit success");
              onClose();
            } else {
              console.log('Unexpected response during POST:', postResponse.status);
            }

          } else {
            console.error(`Course with course_id ${targetCourseId} not found.`);
            onClose();
          }

        } else {
          console.log('Unexpected response:', response.status);
        }

      } catch (error) {
        console.error('Error:', error);
        onClose();
      }
    };

    handleData();
  };


  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <Image source={require('@assets/images/bellImage.png')} style={styles.bellImage} />
            <Text style={styles.modalTitle}>
              오늘 <Text style={styles.modalTitlePink}>{selectedLecture?.name}</Text>의 {'\n'}어떤 공지가 있었나요?
            </Text>
          </View>

          <View style={styles.questionContainer}>
            <BouncyCheckbox
              style={styles.bouncyCheckbox}
              textStyle={styles.checkboxTextStyle}
              fillColor={'#ff1385'}
              iconStyle={styles.checkboxStyle}
              innerIconStyle={styles.checkboxStyle}
              text="출석체크를 진행했어요!"
              onPress={() => { handleCheckboxChange(selectedLecture.id, 'attendance') }}
            />

            <BouncyCheckbox
              style={styles.bouncyCheckbox}
              textStyle={styles.checkboxTextStyle}
              fillColor={'#ff1385'}
              iconStyle={styles.checkboxStyle}
              innerIconStyle={styles.checkboxStyle}
              text="과제가 있었어요!"
              onPress={() => { handleCheckboxChange(selectedLecture.id, 'assignment') }}
            />

            <BouncyCheckbox
              style={styles.bouncyCheckbox}
              textStyle={styles.checkboxTextStyle}
              fillColor={'#ff1385'}
              iconStyle={styles.checkboxStyle}
              innerIconStyle={styles.checkboxStyle}
              text="공지가 있었어요!"
              onPress={() => { handleCheckboxChange(selectedLecture.id, 'notice') }}
            />

            <BouncyCheckbox
              style={styles.bouncyCheckbox}
              textStyle={styles.checkboxTextStyle}
              fillColor={'#ff1385'}
              iconStyle={styles.checkboxStyle}
              innerIconStyle={styles.checkboxStyle}
              text="해당사항 없음!"
              onPress={() => { handleCheckboxChange(selectedLecture.id, 'none') }}
            />
          </View>

          <TouchableHighlight
            style={styles.submitButton}
            onPress={handleCloseModal}
          >
            <Text style={styles.submitButtonText}>제출하기</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellImage: {
    marginBottom: 10,
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
  modalTitlePink: {
    fontSize: 17,
    fontWeight: '700',
    color: '#E8036E',
    marginBottom: 20,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  questionContainer: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  bouncyCheckbox: {
    padding: 8,
  },
  checkboxTextStyle: {
    color: '#010101',
    fontWeight: '500',
    fontSize: 15,
    textDecorationLine: "none",
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
});

export default PollsModal;
