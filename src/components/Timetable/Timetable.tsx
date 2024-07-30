import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  calculateTotalSlots,
  getLabels,
  filterOnlineLecture,
  groupByDay,
  getLectureColor,
  convertTo12HourFormat,
  convertToSlot,
} from '@components/Timetable/TimetableUtils';

import {GlobalStyles} from '@src/GlobalStyles';
import {Lecture, SimpleLecture} from '@src/Types';
import Colors from '@src/Colors';

const slotHeight = 48;
const labelSize = 20;
const innerBorderSize = 1;
const largeFontSize = 12;
const smallFontSize = 11;
const singleSlotHeight = 4;

interface TimetableProps {
  lectures: Lecture[];
  onPress: Function;
  candidate?: Lecture | undefined;
  scrollable?: boolean;
}

type TimetableType = React.FC<TimetableProps>;

const TimetableHeader = ({labels}: {labels: string[]}) => {
  return (
    <View style={GlobalStyles.row}>
      <View style={styles.cell} />
      {labels.map(day => (
        <View key={day} style={styles.daySlot}>
          <Text style={styles.daySlotLabel}>{day}</Text>
        </View>
      ))}
    </View>
  );
};

const ClickableLecture = ({
  lecture,
  onPress,
}: {
  lecture: SimpleLecture;
  onPress: Function;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(lecture.id)}
      style={{
        backgroundColor: getLectureColor(lecture.id),
        top: singleSlotHeight * convertToSlot(lecture.start),
        height:
          singleSlotHeight *
            (convertToSlot(lecture.end) - convertToSlot(lecture.start)) -
          innerBorderSize,
        ...clickableLectureStyle.container,
      }}>
      <Text style={clickableLectureStyle.nameText}>{lecture.name}</Text>
      <Text style={clickableLectureStyle.roomText}>{lecture.room}</Text>
    </TouchableOpacity>
  );
};

const TimetableBody: TimetableType = ({lectures, candidate, onPress}) => {
  const candidates = candidate === undefined ? [] : [candidate];
  const slotCount = calculateTotalSlots([...lectures, ...candidates]);
  const labels = getLabels(lectures);
  const lecturesByDay = groupByDay(lectures);
  const candidateByDay = groupByDay(candidates);

  return (
    <View style={GlobalStyles.row}>
      <View style={styles.hourColumn}>
        {Array.from({length: slotCount}, (_, slot) => (
          <View key={`hour-${slot}`} style={styles.hourSlot}>
            <Text style={styles.hourSlotLabel}>
              {convertTo12HourFormat(slot)}
            </Text>
          </View>
        ))}
      </View>
      {labels.map(day => (
        <View key={day} style={styles.body}>
          {Array.from({length: slotCount}, (_, slot) => (
            <View key={`slot-${day}-${slot}`} style={styles.slot} />
          ))}
          {lecturesByDay[day].map(lecture => (
            <ClickableLecture
              key={`lecture-${lecture.id}-${day}`}
              lecture={lecture}
              onPress={onPress}
            />
          ))}
          {candidateByDay[day].map(e => (
            <View
              key={`candidate-${e.id}-${day}`}
              style={{
                top: singleSlotHeight * convertToSlot(e.start),
                height:
                  singleSlotHeight *
                    (convertToSlot(e.end) - convertToSlot(e.start)) -
                  innerBorderSize,
                ...clickableLectureStyle.candidate,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const TimetableFooter: TimetableType = ({lectures, onPress}) => {
  if (lectures.length === 0) {
    return null;
  }

  return (
    <View>
      {lectures.map(lecture => {
        return (
          <TouchableOpacity
            key={lecture.id}
            style={styles.list}
            onPress={() => onPress(lecture.id)}>
            <Text style={styles.text}>{lecture.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Timetable: TimetableType = ({
  lectures,
  onPress,
  candidate,
  scrollable = false,
}) => {
  const maxHeight = scrollable ? slotHeight * 7 + labelSize + 4 : null;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (candidate !== undefined) {
      const minHeight = candidate.time.length
        ? singleSlotHeight * convertToSlot(candidate.time[0].start)
        : 1e5;

      (scrollViewRef.current as any).scrollTo({
        x: 0,
        y: minHeight,
        animated: true,
      });
    }
  });

  return (
    <View
      style={{
        maxHeight: maxHeight,
        ...styles.container,
      }}>
      <TimetableHeader labels={getLabels(lectures)} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        bounces={false}
        ref={scrollViewRef}>
        <TimetableBody
          lectures={lectures}
          onPress={onPress}
          candidate={candidate}
        />
        <TimetableFooter
          lectures={filterOnlineLecture(lectures)}
          onPress={onPress}
        />
      </ScrollView>
    </View>
  );
};

const clickableLectureStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    padding: 4,
  },
  roomText: {
    color: Colors.text.white,
    fontSize: smallFontSize,
    ...GlobalStyles.text,
  },
  nameText: {
    color: Colors.text.white,
    fontSize: largeFontSize,
    ...GlobalStyles.boldText,
  },
  candidate: {
    position: 'absolute',
    width: '100%',
    padding: 4,
    backgroundColor: Colors.ui.secondary,
    opacity: 0.5,
  },
});

const styles = StyleSheet.create({
  cell: {
    width: labelSize,
    borderBottomWidth: innerBorderSize,
    borderBottomColor: Colors.ui.onPrimary,
  },
  scrollView: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  container: {
    borderWidth: 2,
    borderColor: Colors.ui.primary,
    borderRadius: 10,
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.shadow,
  },
  body: {
    borderColor: Colors.ui.onPrimary,
    borderLeftWidth: innerBorderSize,
    ...GlobalStyles.expand,
  },
  text: {
    color: Colors.text.black,
    fontSize: largeFontSize,
    ...GlobalStyles.text,
  },
  list: {
    padding: 12,
    borderBottomWidth: innerBorderSize,
    borderColor: Colors.ui.onPrimary,
  },
  slot: {
    borderColor: Colors.ui.onPrimary,
    borderBottomWidth: innerBorderSize,
    height: slotHeight,
  },
  daySlot: {
    height: labelSize,
    justifyContent: 'center',
    borderColor: Colors.ui.onPrimary,
    borderLeftWidth: innerBorderSize,
    borderBottomWidth: 1,
    ...GlobalStyles.expand,
  },
  daySlotLabel: {
    textAlign: 'center',
    color: Colors.text.black,
    fontSize: largeFontSize,
    ...GlobalStyles.text,
  },
  hourColumn: {
    width: 20,
  },
  hourSlot: {
    borderColor: Colors.ui.onPrimary,
    borderBottomWidth: innerBorderSize,
    height: labelSize,
    padding: 2,
    ...GlobalStyles.expand,
  },
  hourSlotLabel: {
    textAlign: 'right',
    fontSize: smallFontSize,
    ...GlobalStyles.text,
  },
});

export default Timetable;
