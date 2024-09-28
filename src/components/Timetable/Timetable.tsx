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
  getCourseSlot,
  DEFAULT_SLOT_COUNT,
} from '@components/Timetable/TimetableUtils';

import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {Course, CourseBlock} from '@src/Types';
import Colors from '@src/Colors';

const slotHeight = 48;
const labelSize = 20;
const innerBorderSize = 1;
const singleSlotHeight = 4;

interface TimetableProps {
  courses: Course[];
  onPress: Function;
  candidate?: Course;
  scrollable?: boolean;
  slotCount?: number;
}

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
  course: CourseBlock;
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

const TimetableBody: React.FC<TimetableProps> = ({
  courses,
  candidate,
  onPress,
}) => {
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
          {coursesByDay[day].map(course => (
            <ClickableLecture
              key={`lecture-${course.id}-${day}-${course.end}`}
              course={course}
              onPress={onPress}
            />
          ))}
          {candidateByDay[day].map(course => (
            <View
              key={`candidate-${course.id}-${day}-${course.end}`}
              style={{
                top: singleSlotHeight * convertToSlot(course.start),
                height:
                  singleSlotHeight *
                    (convertToSlot(course.end) - convertToSlot(course.start)) -
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

const TimetableFooter: React.FC<TimetableProps> = ({courses, onPress}) => {
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

const Timetable: React.FC<TimetableProps> = ({
  courses,
  onPress,
  candidate,
  scrollable = false,
}) => {
  const maxHeight = scrollable
    ? slotHeight * DEFAULT_SLOT_COUNT + labelSize + 4
    : null;
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (candidate !== undefined) {
      const courseSlot = getCourseSlot(candidate);
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
    fontSize: FontSizes.small,
    ...GlobalStyles.text,
  },
  nameText: {
    color: Colors.text.white,
    fontSize: FontSizes.regular,
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
    fontSize: FontSizes.regular,
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
    fontSize: FontSizes.regular,
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
    fontSize: FontSizes.small,
    ...GlobalStyles.text,
  },
});

export default Timetable;
