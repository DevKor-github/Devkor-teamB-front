import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Colors from '@src/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {
  Course,
  CourseMinimal,
  CourseMinimalData,
  TimetableModel,
} from '@src/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';

const fetchCourses = async (callback: Function) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_URL}/courses/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    const courseMinimal = response.data.map((e: CourseMinimalData) =>
      CourseMinimal.fromJson(e),
    );
    const value = await fetchCourseInfo(courseMinimal);
    callback(value);
  } catch (e) {
    console.error(e);
  }
};

const fetchCourseInfo = async (courseMinimal: CourseMinimal[]) => {
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

const fetchCreateTimetable = async (userId: number) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const timetable = new TimetableModel({
      student: userId,
      courses: [],
      semester: '2',
      year: '2024',
    });
    await axios.post(`${API_URL}/timetables/`, timetable, {
      headers: {
        authorization: `token ${token}`,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const fetchTimetable = async (uid: number, callback: Function) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_URL}/timetables/${uid}/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    if (response.status === 200) {
      const value = TimetableModel.fromJson(response.data);
      callback(value);
    } else if (response.status === 404) {
      await fetchCreateTimetable(uid);
    } else {
      throw Error(`Error code ${response.status}`);
    }
  } catch (e) {
    console.error(e);
  }
};

const RegistrationInfoScreen = ({route}: {route: any}) => {
  const {userId}: {userId: number} = route.params;
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetable, setTimetable] = useState<TimetableModel | undefined>(
    undefined,
  );
  const navigation = useNavigation<any>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        navigation.navigate('Register', {
          courses: courses,
          timetable: timetable,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [loading, courses, navigation, timetable]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCourses(setCourses);
      await fetchTimetable(userId, setTimetable);
      setLoading(false);
    };
    fetchData();
  }, [setLoading, userId, setTimetable, setCourses]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.topContainer}>
        <Image
          style={styles.appIcon}
          source={require('@assets/icons/app_logo.png')}
        />
        <Text style={styles.appLogo}>KU&A</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.titleRow}>
          <Image
            style={styles.titleIcon}
            source={require('@assets/icons/app_logo.png')}
          />
          <Text style={styles.title}>반갑습니다!</Text>
        </View>
        <Text style={styles.subTitle}>당신의 시간표를 등록해주세요</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    overflow: 'hidden',
    backgroundColor: Colors.ui.primary,
    ...GlobalStyles.expand,
  },
  topContainer: {flex: 3},
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 40,
  },
  appIcon: {
    position: 'absolute',
    resizeMode: 'contain',
    tintColor: 'rgba(250, 96, 170, 1)',
    width: 500,
    bottom: 0,
    left: -100,
  },
  appLogo: {
    position: 'absolute',
    top: 120,
    right: -100,
    fontSize: 120,
    color: Colors.primary[100],
    transform: [{rotate: '-90deg'}],
    ...GlobalStyles.logo,
  },
  titleRow: {
    alignItems: 'flex-end',
    ...GlobalStyles.row,
  },
  titleIcon: {
    height: 64,
    width: 64,
    tintColor: Colors.ui.background,
    resizeMode: 'contain',
  },
  title: {
    fontSize: FontSizes.xxxLarge,
    color: Colors.text.white,
    paddingVertical: 4,
    paddingHorizontal: 12,
    ...GlobalStyles.boldText,
  },
  subTitle: {
    fontSize: FontSizes.xLarge,
    color: Colors.text.white,
    paddingVertical: 12,
    paddingHorizontal: 4,
    ...GlobalStyles.text,
  },
});

export default RegistrationInfoScreen;
