import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ImageSourcePropType,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { FontSizes, GlobalStyles } from '@src/GlobalStyles';
import Colors from '@src/Colors';
import WeeklyTimetableScreen from '@screens/Timetable/WeeklyTimetableScreen';
import DailyTimetableScreen from '@screens/Timetable/DailyTimetableScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchTimetableData } from '@src/data/studentApi';
import {
  getDay,
  getLabels,
  getTimetableId,
  groupByDay,
} from '@src/components/Timetable/TimetableUtils';
import { CourseBlock, TimetableModel } from '@src/Types';

enum ViewMode {
  Daily,
  Weekly,
}

const dateToString = (now: Date) => {
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const day = now.getDay();
  const label = ['일', '월', '화', '수', '목', '금', '토'];
  return `${month}월 ${date}일 ${label[day]}요일`;
};

const compareDate = (old: Date, now: Date) => {
  return (
    old.getFullYear() === now.getFullYear() &&
    old.getMonth() === now.getMonth() &&
    old.getDate() === now.getDate()
  );
};

const NavigationButton = ({
  label,
  icon,
  enabled,
  onPress,
}: {
  label: string;
  icon: ImageSourcePropType;
  enabled: boolean;
  onPress: Function;
}) => {
  return (
    <TouchableOpacity style={navigationStyles.button} onPress={() => onPress()}>
      <Image
        source={icon}
        style={[
          navigationStyles.icon,
          { tintColor: enabled ? Colors.ui.primary : Colors.ui.disabled },
        ]}
      />
      <Text
        style={[
          navigationStyles.buttonText,
          { color: enabled ? Colors.ui.primary : Colors.ui.disabled },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const NavigationRow = ({
  mode,
  date,
  onClick,
}: {
  mode: ViewMode;
  date: Date;
  onClick: Function;
}) => {
  return (
    <View style={navigationStyles.container}>
      <View style={GlobalStyles.row}>
        <NavigationButton
          label="Daily"
          icon={require('@assets/icons/icon_daily.png')}
          enabled={mode === ViewMode.Daily}
          onPress={() => onClick(ViewMode.Daily)}
        />
        <NavigationButton
          label="Weekly"
          icon={require('@assets/icons/icon_weekly.png')}
          enabled={mode === ViewMode.Weekly}
          onPress={() => onClick(ViewMode.Weekly)}
        />
      </View>
      <Text style={navigationStyles.dateText}>{dateToString(date)}</Text>
    </View>
  );
};

const TimetableHeader = () => {
  return (
    <SafeAreaView edges={['top']} style={headerStyles.safeArea}>
      <View style={headerStyles.container}>
        <View style={headerStyles.logoContainer}>
          <Image
            source={require('@assets/icons/app_logo.png')}
            style={headerStyles.logo}
          />
          <Text style={headerStyles.logoText}>KU&A</Text>
        </View>
        <View style={headerStyles.buttonContainer}>
          {/* <TouchableOpacity>
            <Image
              style={headerStyles.icon}
              source={require('@assets/icons/bell.png')}
            />
          </TouchableOpacity> */}
          {/* <TouchableOpacity>
            <Image
              style={headerStyles.icon}
              source={require('@assets/icons/setting.png')}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const TimetableScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [courses, setCourses] = useState<CourseBlock[]>([]);
  const [timetable, setTimetable] = useState<TimetableModel>(
    TimetableModel.empty(),
  );
  const [viewMode, setViewMode] = useState(ViewMode.Daily);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const width = Dimensions.get('window').width;
  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / width);
    setViewMode(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await getTimetableId();
        const data = await fetchTimetableData(id);
        getLabels(data.courses);
        const coursesByDay = groupByDay(data.courses);
        setCourses(coursesByDay[getDay()] ?? []);
        setTimetable(data);
      } catch (_) {
        setCourses([]);
        setTimetable(TimetableModel.empty());
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date();
      if (!compareDate(currentDate, newDate)) {
        setCurrentDate(newDate);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentDate]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.ui.primary} />
      <TimetableHeader />
      <NavigationRow
        mode={viewMode}
        date={currentDate}
        onClick={(mode: ViewMode) => {
          scrollViewRef.current?.scrollTo({ x: mode * width, animated: true });
        }}
      />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        bounces={false}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}>
        <View style={{ width }}>
          <DailyTimetableScreen courses={courses} />
        </View>
        <View style={{ width }}>
          <WeeklyTimetableScreen timetable={timetable} />
        </View>
      </ScrollView>
    </View>
  );
};

const navigationStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...GlobalStyles.row,
  },
  button: {
    justifyContent: 'center',
    marginRight: 16,
    ...GlobalStyles.row,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
    alignSelf: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: FontSizes.xxLarge,
    ...GlobalStyles.boldText,
  },
  dateText: {
    fontSize: FontSizes.large,
    textAlign: 'center',
    ...GlobalStyles.text,
  },
});

const headerStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.ui.primary,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  container: {
    height: 64,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...GlobalStyles.row,
  },
  logoContainer: {
    alignItems: 'baseline',
    ...GlobalStyles.expand,
    ...GlobalStyles.row,
  },
  buttonContainer: {
    ...GlobalStyles.row,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    fontSize: FontSizes.xxxLarge,
    color: Colors.text.white,
    ...GlobalStyles.logo,
  },
  icon: {
    tintColor: Colors.ui.background,
    width: 28,
    height: 28,
    marginHorizontal: 7,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.expand,
  },
});

export default TimetableScreen;
