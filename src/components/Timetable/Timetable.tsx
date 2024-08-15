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
import {Course, CourseMinimal} from '@src/Types';
import Colors from '@src/Colors';

const slotHeight = 48;
const labelSize = 20;
const innerBorderSize = 1;
const largeFontSize = 12;
const smallFontSize = 11;
const singleSlotHeight = 4;

interface TimetableProps {
  courses: Course[];
  onPress: Function;
  candidate?: Course;
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
  course,
  onPress,
}: {
  course: CourseMinimal;
  onPress: Function;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(course)}
      style={{
        backgroundColor: getLectureColor(course.id),
        top: singleSlotHeight * convertToSlot(course.start),
        height:
          singleSlotHeight *
            (convertToSlot(course.end) - convertToSlot(course.start)) -
          innerBorderSize,
        ...clickableLectureStyle.container,
      }}>
      <Text style={clickableLectureStyle.nameText}>{course.course_name}</Text>
      <Text style={clickableLectureStyle.roomText}>{course.course_room}</Text>
    </TouchableOpacity>
  );
};

const TimetableBody: TimetableType = ({courses, candidate, onPress}) => {
  const candidates = candidate === undefined ? [] : [candidate];
  const slotCount = calculateTotalSlots([...courses, ...candidates]);
  const labels = getLabels(courses);
  const coursesByDay = groupByDay(courses);
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
          {coursesByDay[day].map(e => (
            <ClickableLecture
              key={`lecture-${e.id}-${day}-${e.end}`}
              course={e}
              onPress={onPress}
            />
          ))}
          {candidateByDay[day].map(e => (
            <View
              key={`candidate-${e.id}-${day}-${e.end}`}
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

const TimetableFooter: TimetableType = ({courses, onPress}) => {
  if (courses.length === 0) {
    return null;
  }

  return (
    <View>
      {courses.map(course => {
        return (
          <TouchableOpacity
            key={course.id}
            style={styles.list}
            onPress={() => onPress(course.id)}>
            <Text style={styles.text}>{course.course_name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Timetable: TimetableType = ({
  courses,
  onPress,
  candidate,
  scrollable = false,
}) => {
  const maxHeight = scrollable ? slotHeight * 7 + labelSize + 4 : null;
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (candidate !== undefined) {
      const courseSlot = candidate.getCourseSlot();
      const minHeight = courseSlot.length
        ? singleSlotHeight * convertToSlot(courseSlot[0].start)
        : 1e5;

      if (scrollViewRef.current !== null) {
        scrollViewRef.current.scrollTo({
          x: 0,
          y: minHeight,
          animated: true,
        });
      }
    }
  });

  return (
    <View
      style={{
        maxHeight: maxHeight,
        ...styles.container,
      }}>
      <TimetableHeader labels={getLabels(courses)} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        bounces={false}
        ref={scrollViewRef}>
        <TimetableBody
          courses={courses}
          onPress={onPress}
          candidate={candidate}
        />
        <TimetableFooter
          courses={filterOnlineLecture(courses)}
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
