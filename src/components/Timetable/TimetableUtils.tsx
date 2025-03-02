import {
  Course,
  CourseBlock,
  CourseSchedule,
  Schedule,
  TimeSlot,
} from '@src/Types';
import Colors from '@src/Colors.tsx';
import {ColorValue} from 'react-native';
import {fetchTimetables} from '@src/data/studentApi';

const colorMap: Map<number, number> = new Map();
export const DEFAULT_SLOT_COUNT = 7;
const defaultStartTime = 9;

const defaultLabel = ['월', '화', '수', '목', '금'];
let label = [...defaultLabel];

const strToInt = (timeStr: string) => {
  const [hourStr, minStr] = timeStr.split(':');
  return [parseInt(hourStr, 10), parseInt(minStr, 10)];
};

const getCourseTime = (course: Course): [string, Array<number>][] =>
  course.course_schedule.map((value: CourseSchedule) => [
    value.day,
    value.schedule.map((e: Schedule) => e.period),
  ]);

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
  label.forEach(day => (items[day] = []));

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

  Object.keys(items).forEach(day => {
    items[day].sort((a, b) => a.start.localeCompare(b.start));
  });

  return items;
};

// 시간표의 전체 슬롯 수를 계산하는 함수
export const calculateTotalSlots = (courses: Course[]) => {
  if (courses.length === 0) {
    return DEFAULT_SLOT_COUNT;
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
  return Math.max(DEFAULT_SLOT_COUNT, slotCount);
};

export const getLabels = (courses: Course[]) => {
  label = [...defaultLabel];

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
  courses.filter(course => course.course_week.length === 0);

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

export const getCourseSlot = (course: Course): TimeSlot[] => {
  const timetable: {[key: number]: [string, string]} = {
    1: ['09:00', '10:15'],
    2: ['10:30', '11:45'],
    3: ['12:00', '13:15'],
    4: ['13:30', '14:45'],
    5: ['15:00', '16:15'],
    6: ['16:30', '17:45'],
    7: ['18:00', '18:50'],
  };

  return getCourseTime(course).flatMap(([day, period]) => {
    const arr = period.filter(p => p < 10);
    if (arr.length === 0) {
      return [];
    }

    const result = [];
    let start = arr[0];
    let end = start;

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === end + 1) {
        end = arr[i];
      } else {
        result.push({
          day: day,
          start: timetable[start][0],
          end: timetable[end][1],
        });
        start = arr[i];
        end = start;
      }
    }

    result.push({day: day, start: timetable[start][0], end: timetable[end][1]});
    return result;
  });
};

const convertRange = (arr: number[]) => {
  const result = [];
  let start = arr[0];
  let end = start;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === end + 1) {
      end = arr[i];
    } else {
      result.push(start === end ? `${start}` : `${start}-${end}`);
      start = end = arr[i];
    }
  }
  result.push(start === end ? `${start}` : `${start}-${end}`);
  return result;
};

export const getTimeInfo = (e: Course) => {
  const timeInfo = getCourseTime(e).map(([day, period]) => {
    if (period.length > 1) {
      return `${day}(${convertRange(period).join(',')})`;
    } else if (period.length === 1) {
      return `${day}(${period[0]})`;
    } else {
      return '';
    }
  });
  return timeInfo.join(', ');
};

export const getDay = () => {
  const label = ['일', '월', '화', '수', '목', '금', '토'];
  const idx = new Date().getDay();
  return label[idx];
};

export const parseTime = (time: string | Date) => {
  if (typeof time === 'string') {
    const [hour, minute] = strToInt(time);
    return hour * 100 + minute;
  } else {
    const hour = time.getHours();
    const minute = time.getMinutes();
    return hour * 100 + minute;
  }
};

export const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${date}T00:00`;
  return formattedDate;
};

export const getTimetableId = () => {
  const month = new Date().getMonth() + 1 < 8 ? '1' : '2';
  const year = new Date().getFullYear().toString();
  return fetchTimetables(year, month);
};
