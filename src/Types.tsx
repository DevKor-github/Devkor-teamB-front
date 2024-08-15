export class UserInfo {
  id: string;
  name: string;
  profile: string;

  constructor(id: string, name: string, profile: string) {
    this.id = id;
    this.name = name;
    this.profile = profile;
  }
}

export class TimeSlot {
  day: string;
  start: string;
  end: string;

  constructor(day: string, start: string, end: string) {
    this.day = day;
    this.start = start;
    this.end = end;
  }

  overlap(other: TimeSlot) {
    const [cS, cE] = this.toInt();
    const [oS, oE] = other.toInt();

    if (this.day !== other.day) {
      return false;
    } else if (cE <= oS) {
      return false;
    } else if (oE <= cS) {
      return false;
    } else {
      return true;
    }
  }

  toInt() {
    const [sH, sM] = this.start.split(':');
    const [eH, eM] = this.end.split(':');
    const start = parseInt(sH, 10) * 60 + parseInt(sM, 10);
    const end = parseInt(eH, 10) * 60 + parseInt(eM, 10);
    return [start, end];
  }
}

export type Lecture = {
  name: string;
  professor: string;
  room: string;
  id: string;
  type: string;
  credit: string;
  mate: number;
  time: TimeSlot[];
  timeInfo: string;
};

export type Comment = {
  commentId: number;
  author: string;
  content: string;
  date: string;
  updatedDate: string;
  isChosen: boolean;
  postId: number;
  // attachments: Attachment[];
};

export type Attachment = {
  uri: string;
  name: string;
  type: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type Post = {
  postId: number;
  author: UserInfo;
  title: string;
  postDate: string;
  view: number;
  content: string;
  // comments: Comment[];
  // attachments: Attachment[];
  images: Attachment[];
  files: Attachment[];
  tags: any[];
};

// API 맞춰서 바꾼 타입
type Period = Array<number>;

export interface CourseProps {
  id: number;
  course_id: string;
  course_name: string;
  year: number;
  semester: number;
  instructor: string;
  classification: string;
  credits: number;
  course_week: string[];
  course_period: Period[];
  course_room: string;
  enrollment: number;
}

export interface CourseMinimal {
  id: number;
  course_id: string;
  course_name: string;
  course_room: string;
  instructor: string;
  start: string;
  end: string;
}

export class Course implements CourseProps {
  id;
  course_id;
  course_name;
  year;
  semester;
  instructor;
  classification;
  credits;
  course_week;
  course_period;
  course_room;
  enrollment;

  constructor(value: CourseProps) {
    this.id = value.id;
    this.course_id = value.course_id;
    this.course_name = value.course_name;
    this.year = value.year;
    this.semester = value.semester;
    this.instructor = value.instructor;
    this.classification = value.classification;
    this.credits = value.credits;
    this.course_week = value.course_week;
    this.course_period = value.course_period;
    this.course_room = value.course_room;
    this.enrollment = value.enrollment;
  }

  static fromJson = (json: CourseProps): Course => {
    const {
      id,
      course_id,
      course_name,
      year,
      semester,
      instructor,
      classification,
      credits,
      course_week,
      course_period,
      course_room,
    } = json;
    const enrollment = 0;

    return new Course({
      id,
      course_id,
      course_name,
      year,
      semester,
      instructor,
      classification,
      credits,
      course_week,
      course_period,
      course_room,
      enrollment,
    });
  };

  getCourseTime = (): [string, Period][] =>
    this.course_week.map((key, index) => [key, this.course_period[index]]);

  getCourseSlot = () => {
    const timetable: {[key: number]: [string, string]} = {
      1: ['09:00', '10:15'],
      2: ['10:30', '11:45'],
      3: ['12:00', '13:15'],
      4: ['13:30', '14:45'],
      5: ['15:00', '16:15'],
      6: ['16:30', '17:45'],
      7: ['18:00', '18:50'],
    };

    return this.getCourseTime().flatMap(([day, period]) =>
      period.filter(p => p <= 7).map(p => new CourseSlot(day, ...timetable[p])),
    );
  };

  getTimeInfo = () => {
    const timeInfo = this.getCourseTime().map(([day, period]) => {
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
}

export class CourseSlot {
  day: string;
  start: string;
  end: string;

  constructor(day: string, start: string, end: string) {
    this.day = day;
    this.start = start;
    this.end = end;
  }

  overlap(other: CourseSlot) {
    const [cS, cE] = this.toInt();
    const [oS, oE] = other.toInt();

    if (this.day !== other.day) {
      return false;
    } else if (cE <= oS) {
      return false;
    } else if (oE <= cS) {
      return false;
    } else {
      return true;
    }
  }

  toInt() {
    const [sH, sM] = this.start.split(':');
    const [eH, eM] = this.end.split(':');
    const start = parseInt(sH, 10) * 60 + parseInt(sM, 10);
    const end = parseInt(eH, 10) * 60 + parseInt(eM, 10);
    return [start, end];
  }
}
