import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  getLectureSlot,
  getSlotCount,
  getLabels,
  getOnlineLecture,
  getStartTime,
  getLectureByDays,
  getLectureColor,
} from './TimetableUtils.tsx';
import {Lecture, Schedule, SimpleLecture} from './TimetableTypes.tsx';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

const slotHeight = 48;
const labelSize = 20;
const borderWidth = 1;
const borderColor = 'lightgray';
const fontColor = '#373737';
const largeFontSize = 12;
const smallFontSize = 11;
const backgroundColor = 'white';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    borderColor: borderColor,
    backgroundColor: backgroundColor,
    borderLeftWidth: borderWidth,
  },
  text: {
    color: 'black',
    fontSize: largeFontSize,
  },
  row: {
    flexDirection: 'row',
  },
  container: {
    elevation: 3,
    overflow: 'hidden',
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderRadius: 12,
    backgroundColor: backgroundColor,
  },
  list: {
    padding: 12,
    borderTopWidth: borderWidth,
    borderColor: borderColor,
    backgroundColor: backgroundColor,
  },
  slot: {
    borderTopWidth: borderWidth,
    borderColor: borderColor,
    height: slotHeight,
  },
  daySlot: {
    flex: 1,
    borderColor: borderColor,
    borderLeftWidth: borderWidth,
    height: labelSize,
    justifyContent: 'center',
    backgroundColor: backgroundColor,
  },
  daySlotLabel: {
    textAlign: 'center',
    color: fontColor,
    fontSize: largeFontSize,
  },
  hourColumn: {
    width: 20,
  },
  hourSlot: {
    flex: 1,
    borderColor: borderColor,
    borderTopWidth: borderWidth,
    backgroundColor: backgroundColor,
    height: labelSize,
    padding: 2,
  },
  hourSlotLabel: {
    textAlign: 'right',
    color: fontColor,
    fontSize: smallFontSize,
  },
});

function TimetableHeader({labels}: {labels: string[]}) {
  const keyPrefix = 'timetableheader';
  return (
    <View style={styles.row}>
      <View style={{width: labelSize}} />
      {labels.map(day => (
        <View key={keyPrefix + day} style={styles.daySlot}>
          <Text style={styles.daySlotLabel}>{day}</Text>
        </View>
      ))}
    </View>
  );
}

function ClickableLecture({lecture}: {lecture: SimpleLecture}) {
  const minSlotHeight = 4;
  const navigation = useNavigation<StackNavigationProp<any>>();
  const style = StyleSheet.create({
    container: {
      padding: 4,
      backgroundColor: getLectureColor(lecture.id),
      position: 'absolute',
      width: '100%',
      top: minSlotHeight * getLectureSlot(lecture.start) + borderWidth,
      height:
        minSlotHeight *
          (getLectureSlot(lecture.end) - getLectureSlot(lecture.start)) -
        borderWidth,
    },
    roomText: {
      color: 'white',
      fontSize: smallFontSize,
    },
    nameText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: largeFontSize,
    },
  });
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('CommunityScreen', {lecture: lecture})}
      style={style.container}>
      <>
        <Text style={style.nameText}>{lecture.name}</Text>
        <Text style={style.roomText}>{lecture.room}</Text>
      </>
    </TouchableOpacity>
  );
}

const TimetableBody = ({lectures}: {lectures: Schedule}) => {
  const keyPrefix = 'timetablebody';
  const slotCount = getSlotCount(lectures);
  const labels = getLabels(lectures);
  const lectureByDays = getLectureByDays(lectures);

  return (
    <View style={styles.row}>
      <View style={styles.hourColumn}>
        {Array.from({length: slotCount}, (_, i) => (
          <View key={`${keyPrefix}${i}`} style={styles.hourSlot}>
            <Text style={styles.hourSlotLabel}>{getStartTime(i)}</Text>
          </View>
        ))}
      </View>
      {labels.map(day => (
        <View key={`${keyPrefix}${day}`} style={styles.body}>
          {Array.from({length: slotCount}, (_, i) => (
            <View key={`${keyPrefix}${i}`} style={styles.slot} />
          ))}
          {lectureByDays[day] &&
            lectureByDays[day].map((lecture: SimpleLecture) => (
              <ClickableLecture
                key={`${keyPrefix}${day}${lecture.id}`}
                lecture={lecture}
              />
            ))}
        </View>
      ))}
    </View>
  );
};

function TimetableFooter({lectures}: {lectures: Lecture[]}) {
  const keyPrefix = 'timetablefooter';
  const navigation = useNavigation<StackNavigationProp<any>>();

  if (lectures.length === 0) {
    return null;
  } else {
    return (
      <View>
        {lectures.map(lecture => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.list}
            key={keyPrefix + lecture.id}
            onPress={() =>
              navigation.navigate('CommunityScreen', {lecture: lecture})
            }>
            <Text style={styles.text}>{lecture.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

export default function WeeklyTimetable({lectures}: {lectures: Schedule}) {
  return (
    <View style={styles.container}>
      <TimetableHeader labels={getLabels(lectures)} />
      <TimetableBody lectures={lectures} />
      <TimetableFooter lectures={getOnlineLecture(lectures)} />
    </View>
  );
}
