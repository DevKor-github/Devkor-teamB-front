import React, {useState} from 'react';
import {View, Text, StyleSheet, Modal, Image} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {CourseBlock} from '@src/Types';
import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

interface PollsModalProps {
  course: CourseBlock;
  visible: boolean;
  onClose: () => void;
}

const PollsModal: React.FC<PollsModalProps> = ({course, visible, onClose}) => {
  const [checkboxState, setCheckboxState] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState(false);

  const handleCheckboxChange = (key: string) => {
    if (checkboxState.has(key)) {
      setCheckboxState(prevState => prevState.set(key, !prevState.get(key)!));
    } else {
      setCheckboxState(prevState => prevState.set(key, true));
    }
    setIsAnyCheckboxChecked(
      Array.from(checkboxState.values()).some(value => value === true),
    );
  };

  const handleCloseModal = (submitted: boolean = false) => {
    if (submitted) {
      const submitData = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const data = {
          check_attention: checkboxState.get('check_attendance') || false,
          check_test: checkboxState.get('check_test') || false,
          check_homework: checkboxState.get('check_homework') || false,
          answered_at: new Date().toISOString(),
          expired: false,
          course_fk: Number(course.id),
          student: Number(userId),
        };

        // try {
        //   const token = await AsyncStorage.getItem('userToken');
        //   const response = await axios.post(`${API_URL}/todaypolls/`, data, {
        //     headers: {
        //       authorization: `token ${token}`,
        //     },
        //   });
        //   if (response.status === 200) {
        //     onClose();
        //   }
        // } catch (error) {
        //   console.error('Failed to submit poll:', error);
        // }
      };
      submitData();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => handleCloseModal()}>
      <View style={styles.modalOverlay} onTouchStart={() => handleCloseModal()}>
        <View style={styles.modalContainer}>
          <View
            style={styles.modalContent}
            onTouchStart={e => e.stopPropagation()}>
            <View style={styles.headerRow}>
              <Image
                resizeMode="contain"
                source={require('@assets/icons/briefing_bell.png')}
                style={styles.bellIcon}
              />
              <Text style={styles.modalTitle}>
                오늘{' '}
                <Text style={styles.modalTitleAccent}>
                  {course.course_name}
                </Text>
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
                  handleCheckboxChange('check_attendance');
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
                  handleCheckboxChange('check_homework');
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
                  handleCheckboxChange('notice');
                }}
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => handleCloseModal(true)}>
                <Text style={styles.noneButtonText}>해당사항 없음</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  !isAnyCheckboxChecked
                    ? styles.submitButtonDisabled
                    : styles.submitButton
                }
                disabled={!isAnyCheckboxChecked}
                onPress={() => handleCloseModal(true)}>
                <Text style={styles.submitButtonText}>제출하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  noneButtonText: {
    color: Colors.text.accent,
    paddingHorizontal: 12,
    alignSelf: 'center',
    textAlign: 'center',
    alignContent: 'center',
    fontSize: FontSizes.medium,
    ...GlobalStyles.text,
  },
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
    width: '90%',
    marginHorizontal: 12,
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
  submitButtonDisabled: {
    backgroundColor: Colors.ui.disabled,
    borderRadius: 10,
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  submitButton: {
    backgroundColor: Colors.ui.primary,
    borderRadius: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PollsModal;
