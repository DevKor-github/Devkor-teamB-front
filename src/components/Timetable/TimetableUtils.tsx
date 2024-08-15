import {Course, CourseBlock, TimeSlot} from '@src/Types';
import Colors from '@src/Colors.tsx';
import {ColorValue} from 'react-native';

const colorMap: Map<number, number> = new Map();
const defaultSlotCount = 7;
const defaultStartTime = 9;
const defaultLabel = ['월', '화', '수', '목', '금'];

const strToInt = (timeStr: string) => {
  const [hourStr, minStr] = timeStr.split(':');
  return [parseInt(hourStr, 10), parseInt(minStr, 10)];
};

const getCourseTime = (course: Course): [string, Array<number>][] =>
  course.course_week.map((key, index) => [key, course.course_period[index]]);

// 인덱스를 12시간 형식으로 변환하는 함수
export const convertTo12HourFormat = (index: number) => {
  // 기본 시작 시간을 24시 형식으로 변환
  const baseTime = defaultStartTime + index;
  // 13~23시는 1~11시로 변환
  return baseTime > 12 ? baseTime - 12 : baseTime;
};

// 강의 블럭의 색상을 구하는 함수
export const getLectureColor = (id: number): ColorValue => {
  const colors: ColorValue[] = Object.values(Colors.subject);

  if (!colorMap.has(id)) {
    colorMap.set(id, colorMap.size + 1);
  }
  const idx = (colorMap.get(id) as number) % colors.length;
  return colors[idx];
};

// 강의 블럭이 차지하는 시간표 슬롯을 계산하는 함수
// 5분 단위로 한 칸을 차지하도록 설정
export const convertToSlot = (time: string) => {
  const [hour, minute] = strToInt(time);
  const endMinute = hour * 60 + minute;
  const startMinute = defaultStartTime * 60;
  const slot = Math.floor((endMinute - startMinute) / 5);
  return slot;
};

// 강의를 요일 별로 분류하는 함수
export const groupByDay = (courses: Course[]) => {
  const items: Record<string, CourseBlock[]> = {};
  defaultLabel.forEach(day => (items[day] = []));

  courses.forEach((course: Course) => {
    const courseSlots: TimeSlot[] = getCourseSlot(course);
    courseSlots.forEach((slot: TimeSlot) => {
      const newCourse: CourseBlock = {
        id: course.id,
        course_id: course.course_id,
        course_name: course.course_name,
        course_room: course.course_room,
        instructor: course.instructor,
        ...slot,
      };
      items[slot.day].push(newCourse);
    });
  });

  return items;
};

// 시간표의 전체 슬롯 수를 계산하는 함수
export const calculateTotalSlots = (courses: Course[]) => {
  if (courses.length === 0) {
    return defaultSlotCount;
  }
  const coursesSlots = courses.map(e => getCourseSlot(e));
  let latestEndTime = defaultStartTime;
  coursesSlots.forEach(e => {
    e.forEach(slot => {
      let [hour, minute] = strToInt(slot.end);
      hour -= minute === 0 ? 1 : 0; // 주어진 시간이 정각인지 확인하는 구문
      latestEndTime = Math.max(hour, latestEndTime);
    });
  });
  const slotCount = latestEndTime - defaultStartTime + 1;
  return Math.max(defaultSlotCount, slotCount);
};

export const getLabels = (courses: Course[]) => {
  const label = [...defaultLabel];
  if (courses.length === 0) {
    return label;
  }

  const coursesSlots = courses.map(e => getCourseSlot(e));
  let hasSaturday = coursesSlots.some(e => e.some(v => v.day === '토'));
  let hasSunday = coursesSlots.some(e => e.some(v => v.day === '일'));
  if (hasSaturday || hasSunday) {
    label.push('토');
    if (hasSunday) {
      label.push('일');
    }
  }
  return label;
};

export const filterOnlineLecture = (courses: Course[]) =>
  courses.filter(course => course.course_period.length === 0);

export function doesOverlap(target: Course, desc: Course[]): boolean {
  for (const timeSlot of getCourseSlot(target)) {
    for (const existingLecture of desc) {
      for (const existingTimeSlot of getCourseSlot(existingLecture)) {
        if (overlap(timeSlot, existingTimeSlot)) {
          return true;
        }
      }
    }
  }
  return false;
}

export const overlap = (from: TimeSlot, to: TimeSlot) => {
  const toInt = (target: TimeSlot) => {
    const [sH, sM] = target.start.split(':');
    const [eH, eM] = target.end.split(':');
    const start = parseInt(sH, 10) * 60 + parseInt(sM, 10);
    const end = parseInt(eH, 10) * 60 + parseInt(eM, 10);
    return [start, end];
  };

  const [cS, cE] = toInt(from);
  const [oS, oE] = toInt(to);

  if (from.day !== to.day) {
    return false;
  } else if (cE <= oS) {
    return false;
  } else if (oE <= cS) {
    return false;
  } else {
    return true;
  }
};

export const getCourseSlot = (e: Course): TimeSlot[] => {
  const timetable: {[key: number]: [string, string]} = {
    1: ['09:00', '10:15'],
    2: ['10:30', '11:45'],
    3: ['12:00', '13:15'],
    4: ['13:30', '14:45'],
    5: ['15:00', '16:15'],
    6: ['16:30', '17:45'],
    7: ['18:00', '18:50'],
  };

  return getCourseTime(e).flatMap(([day, period]) =>
    period
      .filter(p => p <= 7)
      .map(p => {
        const [start, end] = timetable[p];
        return {day, start, end};
      }),
  );
};

export const getTimeInfo = (e: Course) => {
  const timeInfo = getCourseTime(e).map(([day, period]) => {
    if (period.length > 1) {
      return `${day}(${period.join(',')})`;
    } else if (period.length === 1) {
      return `${day}(${period[0]})`;
    } else {
      return '';
    }
  });
  return timeInfo.join(', ');
};
