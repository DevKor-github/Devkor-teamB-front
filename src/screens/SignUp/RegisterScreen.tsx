import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '@src/Colors';
import BottomSheet, {BottomSheetState} from '@components/BottomSheet';
import FloatingButton from '@components/FloatingButton';
import Icon from 'react-native-vector-icons/Octicons';
import {RadioButton, RadioGroup} from '@components/RadioButton';
import SearchBar from '@components/SearchBar';
import {Course, CourseMinimal, CourseMinimalData, Lecture} from '@src/Types';
import Timetable from '@components/Timetable/Timetable';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {doesOverlap, getTimeInfo} from '@components/Timetable/TimetableUtils';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProps = StackNavigationProp<any>;

const API_URL = "http://3.37.163.236:8000/"

const LectureAddButton = ({onPress}: {onPress: Function}) => {
  return (
    <TouchableOpacity
      style={buttonStyles.addButtonContainer}
      onPress={() => onPress()}>
      <View style={buttonStyles.addButton}>
        <Text style={buttonStyles.addButtonText}>추가</Text>
      </View>
    </TouchableOpacity>
  );
};

const LectureItem = ({
  item,
  onItemAdd,
  selected,
}: {
  item: Course;
  onItemAdd: Function;
  selected: boolean;
}) => {
  return (
    <View
      key={item.id}
      style={selected ? itemStyles.selectedContainer : itemStyles.container}>
      <View>
        <View style={GlobalStyles.row}>
          <Text style={itemStyles.courseName}>{item.course_name}</Text>
          <Text style={itemStyles.courseMate}>
            함께 듣는 사람 {item.enrollment}
          </Text>
        </View>
        <Text style={itemStyles.lecturer}>{item.instructor}</Text>
      </View>
      <View style={GlobalStyles.row}>
        <View style={GlobalStyles.expand}>
          <View style={GlobalStyles.row}>
            <Text style={itemStyles.courseInfo}>{getTimeInfo(item)}</Text>
            <Text style={itemStyles.courseInfo}>{item.course_room}</Text>
          </View>
          <View style={GlobalStyles.row}>
            <Text style={itemStyles.courseInfo}>{item.classification}</Text>
            <Text style={itemStyles.courseInfo}>{item.credits}</Text>
            <Text style={itemStyles.courseInfo}>{item.course_id}</Text>
          </View>
        </View>
        {selected && <LectureAddButton onPress={() => onItemAdd(item)} />}
      </View>
    </View>
  );
};

const LectureList = ({
  items,
  onItemAdd,
  onTap,
}: {
  items: Course[];
  onItemAdd: Function;
  onTap: Function;
}) => {
  const [index, setIndex] = useState(-1);
  const onPress = (e: any) => {
    setIndex(e.index === index ? -1 : e.index);
    onTap(e.index === index ? undefined : e.item);
  };

  return (
    <FlatList
      data={items}
      showsVerticalScrollIndicator={false}
      renderItem={e => (
        <TouchableOpacity onPress={() => onPress(e)}>
          <LectureItem
            item={e.item}
            selected={e.index === index}
            onItemAdd={(item: Lecture) => {
              setIndex(-1);
              onTap(undefined);
              onItemAdd(item);
            }}
          />
        </TouchableOpacity>
      )}
      ListFooterComponent={<View style={itemStyles.listFooter} />}
      keyExtractor={(item, idx) => `${idx}${item.id}`}
    />
  );
};

const CompleteButton = ({disabled}: {disabled: boolean}) => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => navigation.reset({routes: [{name: 'Home'}]})}
      style={buttonStyles.completeButtonContainer}>
      <View
        style={[
          disabled ? buttonStyles.deactivated : buttonStyles.activated,
          buttonStyles.completeButton,
        ]}>
        <Text style={buttonStyles.completeButtonText}>완료</Text>
      </View>
    </TouchableOpacity>
  );
};

const RegistrationBottomSheet = ({
  state,
  onStateChange,
  height,
  items,
  onItemAdd,
  onItemSelect,
}: {
  state: BottomSheetState;
  onStateChange: Function;
  onItemAdd: Function;
  items: Course[];
  onItemSelect: Function;
  height: number;
}) => {
  const [filterOption, setFilterOption] = useState(0);
  const [query, setQuery] = useState('');

  return (
    <BottomSheet height={height} state={state} onStateChange={onStateChange}>
      <SearchBar
        icon={
          <Image
            style={styles.icon}
            source={require('@assets/icons/class.png')}
          />
        }
        text={query}
        placeholder={'강의 찾기'}
        onChangeText={setQuery}
        onSubmit={() => {}}
      />
      <RadioGroup option={filterOption} onPress={setFilterOption}>
        <RadioButton label="과목명" />
        <RadioButton label="교수명" />
        <RadioButton label="과목코드" />
      </RadioGroup>
      <LectureList items={items} onTap={onItemSelect} onItemAdd={onItemAdd} />
    </BottomSheet>
  );
};

const RegistrationBody = ({courses}: {courses: Course[]}) => {
  const [state, setState] = useState(BottomSheetState.HIDDEN);
  const [addedCourses, setAddedCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(
    undefined,
  );
  const [contentHeight, setContentHeight] = useState(0);

  return (
    <View style={GlobalStyles.expand}>
      <View onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
        <Timetable
          courses={addedCourses}
          scrollable
          candidate={selectedCourse}
          onPress={(id: number) =>
            Alert.alert('수업을 삭제하겠습니까?', '', [
              {text: '취소'},
              {
                text: '삭제',
                style: 'destructive',
                onPress: () =>
                  setAddedCourses(addedCourses.filter(e => e.id !== id)),
              },
            ])
          }
        />
        <FloatingButton onPress={() => setState(BottomSheetState.HALF)}>
          <Icon name="plus" size={24} color={Colors.ui.background} />
        </FloatingButton>
      </View>
      <CompleteButton disabled={addedCourses.length === 0} />
      <RegistrationBottomSheet
        state={state}
        onStateChange={setState}
        height={contentHeight + 16}
        items={courses}
        onItemSelect={(e: Course) => setSelectedCourse(e)}
        onItemAdd={(newCourse: Course) => {
          setState(BottomSheetState.HALF);
          if (addedCourses.find(e => e.id === newCourse.id)) {
            Alert.alert('이미 등록된 수업입니다');
          } else if (doesOverlap(newCourse, addedCourses)) {
            Alert.alert('다른 수업과 시간이 겹칩니다');
          } else {
            setAddedCourses([...addedCourses, newCourse]);
          }
        }}
      />
    </View>
  );
};

const RegistrationHeader = ({subTitle}: {subTitle: string}) => {
  return (
    <View style={headerStyles.container}>
      <Text style={headerStyles.title}>KU&A</Text>
      <Text style={headerStyles.subTitle}>{subTitle}</Text>
    </View>
  );
};

const fetchLectureInfo = async (courseMinimal: CourseMinimal[]) => {
  try {
    const items: Course[] = await Promise.all(
      courseMinimal.map(async (data: CourseMinimalData) => {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/courses/${data.id}/`, {
          headers: {
            authorization: `token ${token}`,
          },
        });
        return Course.fromJson(response.data);
      }),
    );
    return items;
  } catch (e) {
    console.error(e);
  }
};

const RegisterScreen = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/courses/`, {
          headers: {
            authorization: `token ${token}`,
          },
        });
        const courseMinimal = response.data.map((e: CourseMinimalData) =>
          CourseMinimal.fromJson(e),
        );
        const value = await fetchLectureInfo(courseMinimal);
        setCourses(value!);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };

    fetchData();
  }, [setCourses]);

  return (
    <View style={styles.background}>
      <SafeAreaView edges={['top']} style={styles.safeArea} />
      <View style={GlobalStyles.expand}>
        <View style={styles.top} />
        <View style={styles.bottom} />
        <View style={styles.content}>
          <RegistrationHeader subTitle={'2024학년도 1학기'} />
          <RegistrationBody courses={courses} />
        </View>
      </View>
      {loading && (
        <ActivityIndicator
          size={'large'}
          color={Colors.ui.primary}
          style={GlobalStyles.indicator}
        />
      )}
    </View>
  );
};

const itemStyles = StyleSheet.create({
  selectedContainer: {
    height: 100,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: Colors.ui.onPrimary,
    justifyContent: 'space-between',
  },
  container: {
    height: 100,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderColor: Colors.ui.disabled,
    justifyContent: 'space-between',
  },
  courseName: {
    flex: 1,
    fontSize: 16,
    ...GlobalStyles.boldText,
  },
  lecturer: {
    fontSize: 12,
    color: Colors.text.gray,
    ...GlobalStyles.text,
  },
  courseInfo: {
    fontSize: 12,
    color: Colors.text.gray,
    marginTop: 4,
    marginRight: 8,
    textAlignVertical: 'center',
    ...GlobalStyles.text,
  },
  courseMate: {
    fontSize: 12,
    color: Colors.text.gray,
    ...GlobalStyles.text,
  },
  listFooter: {
    height: 16,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  title: {
    fontSize: FontSizes.huge,
    color: Colors.text.white,
    ...GlobalStyles.logo,
  },
  subTitle: {
    fontSize: FontSizes.large,
    color: Colors.text.white,
    ...GlobalStyles.text,
  },
});

const buttonStyles = StyleSheet.create({
  completeButtonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  completeButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 64,
    borderRadius: 10,
  },
  activated: {
    backgroundColor: Colors.ui.primary,
  },
  deactivated: {
    backgroundColor: Colors.ui.disabled,
  },
  completeButtonText: {
    color: Colors.text.white,
    fontSize: 18,
    ...GlobalStyles.boldText,
  },
  addButtonContainer: {
    justifyContent: 'flex-end',
  },
  addButton: {
    backgroundColor: Colors.ui.primary,
    borderRadius: 100,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  addButtonText: {
    color: Colors.text.white,
    fontSize: FontSizes.regular,
    ...GlobalStyles.boldText,
  },
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.expand,
  },
  safeArea: {backgroundColor: Colors.ui.primary},
  bottom: {flex: 7},
  top: {
    flex: 3,
    backgroundColor: Colors.ui.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  icon: {width: 24, height: 24},
});

export default RegisterScreen;
