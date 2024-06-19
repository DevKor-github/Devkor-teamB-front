import {Lecture, Schedule, SimpleLecture, TimeSlot} from './TimetableTypes.tsx';

const colors = ['crimson', 'green', 'orange', 'darkviolet'];
const colorMap: Map<string, number> = new Map();
const defaultSlotCount = 7;
const defaultStartTime = 9;
const defaultMaxEndTime = 23;

export const getStartTime = (i: number) => {
  return defaultStartTime + i - (i > 3 ? 12 : 0);
};

export function getLectureColor(id: string): string {
  if (!colorMap.has(id)) {
    colorMap.set(id, colorMap.size + 1);
  }
  const idx = (colorMap.get(id) as number) % colors.length;
  return colors[idx];
}

export function getLectureSlot(time: string): number {
  const [hour, minute] = time.split(':');
  const parseTime = parseInt(hour, 10) * 60 + parseInt(minute, 10);
  return Math.floor((parseTime - 540) / 5);
}

export function getLectureByDays(lectures: Schedule) {
  const lecturesByDay: {[key: string]: SimpleLecture[]} = {};
  lectures.forEach((lec: Lecture) =>
    lec.time.forEach((time: TimeSlot) => {
      if (!lecturesByDay[time.day]) {
        lecturesByDay[time.day] = [];
      }
      lecturesByDay[time.day].push({
        name: lec.name,
        id: lec.id,
        start: time.start,
        end: time.end,
        room: lec.room,
      });
    }),
  );
  return lecturesByDay;
}

export function getSlotCount(lectures: Lecture[]): number {
  if (lectures.length > 0) {
    let maxEndTime = defaultStartTime;
    lectures.forEach(lec => {
      lec.time.forEach(time => {
        let [hour, min] = time.end.split(':');
        maxEndTime = Math.max(
          parseInt(hour, 10) - (parseInt(min, 10) === 0 ? 1 : 0),
          maxEndTime,
        );
      });
    });
    maxEndTime = Math.min(defaultMaxEndTime, maxEndTime);
    return Math.max(defaultSlotCount, maxEndTime - defaultStartTime + 1);
  } else {
    return defaultSlotCount;
  }
}

export function getLabels(lectures: Schedule): string[] {
  const label = ['월', '화', '수', '목', '금'];
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
}

export function getOnlineLecture(lectures: Schedule): Schedule {
  return lectures.filter(lec => lec.time.length === 0);
}
