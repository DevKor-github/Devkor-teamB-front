export interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

export interface SimpleLecture {
  name: string;
  room: string;
  id: string;
  start: string;
  end: string;
}

export interface Lecture {
  name: string;
  professor: string;
  room: string;
  id: string;
  type: string;
  credit: string;
  mate: number;
  time: TimeSlot[];
  timeInfo: string;
}

export type Schedule = Lecture[];

export enum PageType {
  daily,
  weekly,
}

export class Today {
  month: number;
  date: number;
  day: number;

  constructor() {
    const today = new Date();
    this.month = today.getMonth() + 1;
    this.date = today.getDate();
    this.day = today.getDay();
  }

  isToday(): boolean {
    const today = new Date();
    return this.day === today.getDay();
  }

  toString(): string {
    const label = ['일', '월', '화', '수', '목', '금', '토'];
    return `${this.month}월 ${this.date}일 ${label[this.day]}요일`;
  }
}