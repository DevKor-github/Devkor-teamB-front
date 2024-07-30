import {Lecture, SimpleLecture} from '@src/Types';
import Colors from '@src/Colors.tsx';
import {ColorValue} from 'react-native';

const colorMap: Map<string, number> = new Map();
const defaultSlotCount = 7;
const defaultStartTime = 9;
const defaultLabel = ['월', '화', '수', '목', '금'];

const strToInt = (timeStr: string) => {
  const [hourStr, minStr] = timeStr.split(':');
  return [parseInt(hourStr, 10), parseInt(minStr, 10)];
};

// 인덱스를 12시간 형식으로 변환하는 함수
export const convertTo12HourFormat = (index: number) => {
  // 기본 시작 시간을 24시 형식으로 변환
  const baseTime = defaultStartTime + index;
  // 13~23시는 1~11시로 변환
  return baseTime > 12 ? baseTime - 12 : baseTime;
};

// 강의 블럭의 색상을 구하는 함수
export const getLectureColor = (id: string): ColorValue => {
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
export const groupByDay = (lectures: Lecture[]) => {
  const items: Record<string, SimpleLecture[]> = {};
  defaultLabel.forEach(day => (items[day] = []));

  lectures.forEach(lecture => {
    const {name, id, room, time} = lecture;
    time.forEach(timeSlot => {
      const {day, start, end} = timeSlot;
      items[day].push({name, id, room, start, end});
    });
  });

  return items;
};

// 시간표의 전체 슬롯 수를 계산하는 함수
export const calculateTotalSlots = (lectures: Lecture[]) => {
  if (lectures.length === 0) {
    return defaultSlotCount;
  }

  let latestEndTime = defaultStartTime;
  lectures.forEach(lecture => {
    lecture.time.forEach(timeSlot => {
      let [hour, minute] = strToInt(timeSlot.end);
      hour -= minute === 0 ? 1 : 0; // 주어진 시간이 정각인지 확인하는 구문
      latestEndTime = Math.max(hour, latestEndTime);
    });
  });
  const slotCount = latestEndTime - defaultStartTime + 1;
  return Math.max(defaultSlotCount, slotCount);
};

export const getLabels = (lectures: Lecture[]) => {
  const label = [...defaultLabel];
  if (lectures.length === 0) {
    return label;
  }

  let hasSaturday = lectures.some(lec =>
    lec.time.some(time => time.day === '토'),
  );
  let hasSunday = lectures.some(lec =>
    lec.time.some(time => time.day === '일'),
  );
  if (hasSaturday || hasSunday) {
    label.push('토');
    if (hasSunday) {
      label.push('일');
    }
  }
  return label;
};

export const filterOnlineLecture = (lectures: Lecture[]) =>
  lectures.filter(lec => lec.time.length === 0);

export function doesOverlap(target: Lecture, desc: Lecture[]): boolean {
  for (const timeSlot of target.time) {
    for (const existingLecture of desc) {
      for (const existingTimeSlot of existingLecture.time) {
        if (timeSlot.overlap(existingTimeSlot)) {
          return true;
        }
      }
    }
  }
  return false;
}
