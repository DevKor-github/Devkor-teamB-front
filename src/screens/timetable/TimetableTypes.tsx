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
  time: TimeSlot[];
}

export type Schedule = Lecture[];
