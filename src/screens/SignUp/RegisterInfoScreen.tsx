import React, {useEffect, useRef, useCallback} from 'react';
import {Image, StyleSheet, Text, View, Animated} from 'react-native';
import Colors from '@src/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {TimetableModel} from '@src/Types';
import {
  fetchAllCourses,
  fetchCreateTimetable,
  fetchTimetableData,
} from '@src/data/studentApi';
import {getUserId} from '@src/data/authStorage';
import {logger} from '@src/logger';
import {getTimetableId} from '@src/components/Timetable/TimetableUtils';

const ICON_SIZE = 540;

const ICON_START_POSITION = -ICON_SIZE;
const ICON_CENTER_POSITION = -100;
const ICON_END_POSITION = ICON_SIZE;

const LOGO_START_POSITION = 1000;
const LOGO_CENTER_POSITION = 180;
const LOGO_END_POSITION = -320;

const TEXT_START_POSITION = 80;
const TEXT_CENTER_POSITION = 0;
const TEXT_END_POSITION = -800;

const ANIMATION_DURATION = 1500;

const RegistrationInfoScreen = ({navigation}: {navigation: any}) => {
  const logoAnimation = useRef(new Animated.Value(LOGO_START_POSITION)).current;
  const iconAnimation = useRef(new Animated.Value(ICON_START_POSITION)).current;
  const textAnimation = useRef(new Animated.Value(TEXT_START_POSITION)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;

  const runEnterAnimation = useCallback(() => {
    return new Promise<void>(resolve => {
      Animated.parallel([
        Animated.timing(iconAnimation, {
          toValue: ICON_CENTER_POSITION,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnimation, {
          toValue: LOGO_CENTER_POSITION,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(textAnimation, {
          toValue: TEXT_CENTER_POSITION,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        resolve();
      });
    });
  }, [iconAnimation, logoAnimation, textAnimation]);

  const runExitAnimation = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return new Promise<void>(resolve => {
      Animated.parallel([
        Animated.timing(iconAnimation, {
          toValue: ICON_END_POSITION,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnimation, {
          toValue: LOGO_END_POSITION,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(textAnimation, {
          toValue: TEXT_END_POSITION,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(({finished}) => {
        if (finished) {
          resolve();
        }
      });
    });
  }, [iconAnimation, logoAnimation, textAnimation, opacityAnimation]);

  const getTimetable = async () => {
    const id = await getTimetableId();
    if (id === -1) {
      const month = new Date().getMonth() + 1 < 8 ? '1' : '2';
      const year = new Date().getFullYear().toString();
      const userId = await getUserId();
      const newTimetable = new TimetableModel({
        student: Number(userId),
        courses: [],
        semester: month,
        year: year,
      });
      await fetchCreateTimetable(newTimetable);
      return newTimetable;
    } else {
      const timetable = await fetchTimetableData(id);
      return TimetableModel.fromJson(timetable);
    }
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        await runEnterAnimation();
        const courses = await fetchAllCourses();
        const timetable = await getTimetable();
        await runExitAnimation();
        navigation.navigate('Register', {
          courses: courses,
          timetable: timetable,
        });
      };
      fetchData();
    } catch (e: any) {
      logger.error('RegisterInfoScreen', e.toString());
    }
  }, [runEnterAnimation, navigation, runExitAnimation]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.topContainer}>
        <Animated.Image
          style={[
            styles.appIcon,
            {
              transform: [{translateX: iconAnimation}],
            },
          ]}
          source={require('@assets/icons/app_logo.png')}
        />
      </View>
      <Animated.View
        style={[styles.bottomContainer, {opacity: opacityAnimation}]}>
        <View style={styles.textContainer}>
          <Animated.View
            style={[
              styles.titleRow,
              {
                transform: [{translateY: textAnimation}],
              },
            ]}>
            <Image
              style={styles.titleIcon}
              source={require('@assets/icons/app_logo.png')}
            />
            <Text style={styles.title}>반갑습니다!</Text>
          </Animated.View>
        </View>
        <View style={[styles.textContainer]}>
          <Animated.Text
            style={[
              styles.subTitle,
              {
                transform: [{translateY: textAnimation}],
              },
            ]}>
            당신의 시간표를 등록해주세요
          </Animated.Text>
        </View>
        <View style={styles.bottomPadding} />
      </Animated.View>
      <Animated.Text
        style={[
          styles.appLogo,
          {
            opacity: opacityAnimation,
            transform: [{translateY: logoAnimation}, {rotate: '-90deg'}],
          },
        ]}>
        KU&A
      </Animated.Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ui.primary,
    overflow: 'hidden',
  },
  topContainer: {flex: 3},
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 40,
  },
  appIcon: {
    position: 'absolute',
    resizeMode: 'contain',
    tintColor: Colors.primary[300],
    width: ICON_SIZE,
    bottom: 0,
  },
  appLogo: {
    position: 'absolute',
    right: -100,
    fontSize: 124,
    color: Colors.primary[100],
    ...GlobalStyles.logo,
  },
  titleRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
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
  textContainer: {
    backgroundColor: Colors.ui.primary,
  },
  bottomPadding: {
    flex: 1,
    backgroundColor: Colors.ui.primary,
  },
});

export default RegistrationInfoScreen;
