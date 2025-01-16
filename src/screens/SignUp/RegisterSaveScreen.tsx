import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Image, StyleSheet, View} from 'react-native';
import Colors from '@src/Colors';
import {TimetableModel, TimetableUpdateData} from '@src/Types';
import {fetchTimetableUpdate} from '@src/data/studentApi';

const updateTimetable = async (timetable: TimetableModel) => {
  try {
    const updateData: TimetableUpdateData = {
      student: timetable.student,
      course_ids: timetable.courses.map(e => e.id),
      semester: timetable.semester,
      year: timetable.year,
    };

    await fetchTimetableUpdate(updateData);
  } catch (e) {
    console.error(e);
  }
};

const ActivityIndicator = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex: number) => (prevIndex + 1) % 3);
    }, 750);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={indicatorStyle.indicatorContainer}>
      {Array.from({length: 3}).map((_, index) => (
        <View
          key={index}
          style={
            index === activeIndex
              ? indicatorStyle.active
              : indicatorStyle.inactive
          }
        />
      ))}
    </View>
  );
};

const RegistrationSaveScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {timetable, skip} = route.params;
  const circleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      await updateTimetable(timetable);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigation.reset({routes: [{name: 'Home'}]});
    };
    fetchData();

    const animate = () => {
      Animated.timing(circleAnimation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        circleAnimation.setValue(0);
        animate();
      });
    };
    animate();
  }, [circleAnimation, navigation, timetable, skip]);

  const circleTranslateX = circleAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 20, -20],
  });

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <View>
          <Animated.View
            style={[
              styles.centerCircle,
              {
                transform: [{translateX: circleTranslateX}],
              },
            ]}
          />
          <Image
            style={styles.centerIcon}
            source={require('@assets/icons/app_logo.png')}
          />
        </View>
        <ActivityIndicator />
      </View>
      <Image
        style={styles.topLeftIcon}
        source={require('@assets/icons/app_logo.png')}
      />
      <Image
        style={styles.topRightIcon}
        source={require('@assets/icons/app_logo.png')}
      />
      <Image
        style={styles.bottomLeftIcon}
        source={require('@assets/icons/app_logo.png')}
      />
      <Image
        style={styles.bottomRightIcon}
        source={require('@assets/icons/app_logo.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: Colors.ui.background,
  },
  centerContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  centerIcon: {
    resizeMode: 'contain',
    height: 320,
    tintColor: Colors.primary[500],
  },
  centerCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[800],
    marginLeft: 203,
    marginTop: 145,
  },
  topLeftIcon: {
    position: 'absolute',
    top: -100,
    left: -220,
    resizeMode: 'contain',
    width: 360,
    height: 360,
    opacity: 0.3,
    tintColor: Colors.primary[600],
  },
  topRightIcon: {
    position: 'absolute',
    top: -100,
    right: -180,
    resizeMode: 'contain',
    width: 360,
    height: 360,
    tintColor: Colors.primary[100],
  },
  bottomLeftIcon: {
    position: 'absolute',
    bottom: -80,
    left: -150,
    resizeMode: 'contain',
    width: 360,
    height: 360,
    tintColor: Colors.primary[100],
  },
  bottomRightIcon: {
    position: 'absolute',
    bottom: -80,
    right: -240,
    resizeMode: 'contain',
    width: 360,
    height: 360,
    tintColor: Colors.primary[100],
  },
});


const indicatorStyle = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  active: {
    margin: 12,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary[500],
  },
  inactive: {
    margin: 12,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary[100],
  },
});

export default RegistrationSaveScreen;
