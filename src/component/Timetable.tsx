// WeeklyTimetableScreen.tsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {
  getLectureSlot,
  getSlotCount,
  getLabels,
  getOnlineLecture,
  getStartTime,
  getLectureByDays,
  getLectureColor,
} from '../screens/timetable/TimetableUtils.tsx';
import {Schedule, SimpleLecture} from '../screens/timetable/TimetableTypes.tsx';

import {Color} from './Color.tsx';

const slotHeight = 48;
const labelSize = 20;
const innerBorderSize = 1;
const largeFontSize = 12;
const smallFontSize = 11;
const borderRadius = 12;
const minSlotHeight = 4;

interface ClickableLectureProps {
  lecture: SimpleLecture;
  onPress: Function;
}

interface TimetableProps {
  lectures: Schedule;
  onPress: Function;
}

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

const ClickableLecture: React.FC<ClickableLectureProps> = ({
  lecture,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(lecture.id)}
      style={{
        backgroundColor: getLectureColor(lecture.id),
        top: minSlotHeight * getLectureSlot(lecture.start) + innerBorderSize,
        height:
          minSlotHeight *
            (getLectureSlot(lecture.end) - getLectureSlot(lecture.start)) -
          innerBorderSize,
        ...clickableLectureStyle.container,
      }}>
      <Text style={clickableLectureStyle.nameText}>{lecture.name}</Text>
      <Text style={clickableLectureStyle.roomText}>{lecture.room}</Text>
    </TouchableOpacity>
  );
};

const TimetableBody: React.FC<TimetableProps> = ({lectures, onPress}) => {
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
                onPress={onPress}
              />
            ))}
        </View>
      ))}
    </View>
  );
};

const TimetableFooter: React.FC<TimetableProps> = ({lectures, onPress}) => {
  const keyPrefix = 'timetablefooter';

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
            onPress={() => onPress(lecture.id)}>
            <Text style={styles.text}>{lecture.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
};

const Timetable: React.FC<TimetableProps> = ({lectures, onPress}) => {
  return (
    <View style={styles.container}>
      <TimetableHeader labels={getLabels(lectures)} />
      <TimetableBody lectures={lectures} onPress={onPress} />
      <TimetableFooter
        lectures={getOnlineLecture(lectures)}
        onPress={onPress}
      />
    </View>
  );
};

const clickableLectureStyle = StyleSheet.create({
  container: {
    padding: 4,
    position: 'absolute',
    width: '100%',
  },
  roomText: {
    color: Color.text.onPrimary,
    fontSize: smallFontSize,
  },
  nameText: {
    color: Color.text.onPrimary,
    fontWeight: 'bold',
    fontSize: largeFontSize,
  },
});

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: Color.ui.primary,
    borderRadius: borderRadius,
    backgroundColor: Color.ui.white,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {width: 0, height: 1},
      },
      android: {
        elevation: 3,
      },
    }),
  },
  body: {
    flex: 1,
    borderColor: Color.ui.onPrimary,
    borderLeftWidth: innerBorderSize,
  },
  text: {
    color: Color.text.default,
    fontSize: largeFontSize,
  },
  row: {
    flexDirection: 'row',
  },
  list: {
    padding: 12,
    borderTopWidth: innerBorderSize,
    borderColor: Color.ui.onPrimary,
  },
  slot: {
    borderTopWidth: innerBorderSize,
    borderColor: Color.ui.onPrimary,
    height: slotHeight,
  },
  daySlot: {
    flex: 1,
    height: labelSize,
    justifyContent: 'center',
    borderColor: Color.ui.onPrimary,
    borderLeftWidth: innerBorderSize,
  },
  daySlotLabel: {
    textAlign: 'center',
    color: Color.text.placeholder,
    fontSize: largeFontSize,
  },
  hourColumn: {
    width: 20,
  },
  hourSlot: {
    flex: 1,
    borderColor: Color.ui.onPrimary,
    borderTopWidth: innerBorderSize,
    height: labelSize,
    padding: 2,
  },
  hourSlotLabel: {
    textAlign: 'right',
    color: Color.text.placeholder,
    fontSize: smallFontSize,
  },
});

export default Timetable;