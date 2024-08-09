import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ImageSourcePropType,
  Dimensions,
} from 'react-native';
import DailyTimetableScreen from '@screens/Timetable/DailyTimetableScreen';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import Colors from '@src/Colors';
import WeeklyTimetableScreen from '@screens/Timetable/WeeklyTimetableScreen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

enum ViewMode {
  Daily,
  Weekly,
}

class DateUtil {
  private static instance: DateUtil;

  private month: number;
  private date: number;
  private day: number;

  private constructor() {
    const today = new Date();
    this.month = today.getMonth() + 1;
    this.date = today.getDate();
    this.day = today.getDay();
  }

  public static getInstance(): DateUtil {
    if (!DateUtil.instance) {
      DateUtil.instance = new DateUtil();
    }
    return DateUtil.instance;
  }

  public toString(): string {
    const label = ['일', '월', '화', '수', '목', '금', '토'];
    return `${this.month}월 ${this.date}일 ${label[this.day]}요일`;
  }
}

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
  const style = enabled ? navigationStyles.enabled : navigationStyles.disabled;
  return (
    <TouchableOpacity style={navigationStyles.button} onPress={() => onPress()}>
      <Image source={icon} style={navigationStyles.icon} />
      <Text style={style}>{label}</Text>
    </TouchableOpacity>
  );
};

const NavigationRow = ({
  mode,
  onClick,
}: {
  mode: ViewMode;
  onClick: Function;
}) => {
  const [date, setDate] = useState(DateUtil.getInstance());
  useEffect(() => {
    const interval = setInterval(() => setDate(DateUtil.getInstance()), 1000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <View style={navigationStyles.container}>
      <View style={GlobalStyles.row}>
        <NavigationButton
          label="Daily"
          icon={
            mode === ViewMode.Daily
              ? require('@assets/icons/daily1.png')
              : require('@assets/icons/daily2.png')
          }
          enabled={mode === ViewMode.Daily}
          onPress={() => onClick(ViewMode.Daily)}
        />
        <NavigationButton
          label="Weekly"
          icon={
            mode === ViewMode.Weekly
              ? require('@assets/icons/weekly1.png')
              : require('@assets/icons/weekly2.png')
          }
          enabled={mode === ViewMode.Weekly}
          onPress={() => onClick(ViewMode.Weekly)}
        />
      </View>
      <Text style={navigationStyles.dateText}>{date.toString()}</Text>
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
          <TouchableOpacity>
            <Image
              style={headerStyles.icon}
              source={require('@assets/icons/bell.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={headerStyles.icon}
              source={require('@assets/icons/setting.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const TimetableScreen = () => {
  const [viewMode, setViewMode] = useState(ViewMode.Daily);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const width = Dimensions.get('window').width;
  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / width);
    setViewMode(index);
  };

  return (
    <View style={styles.container}>
      <TimetableHeader />
      <NavigationRow
        mode={viewMode}
        onClick={(mode: ViewMode) => {
          scrollViewRef.current?.scrollTo({x: mode * width, animated: true});
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
        <View style={{width}}>
          <DailyTimetableScreen />
        </View>
        <View style={{width}}>
          <WeeklyTimetableScreen />
        </View>
      </ScrollView>
    </View>
  );
};

const navigationStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
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
  enabled: {
    textAlign: 'center',
    fontSize: FontSizes.xxLarge,
    color: Colors.text.accent,
    ...GlobalStyles.boldText,
  },
  disabled: {
    textAlign: 'center',
    fontSize: FontSizes.xxLarge,
    color: Colors.text.lightgray,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
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
