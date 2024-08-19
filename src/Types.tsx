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

// 새로 추가한 타입

// PostMinimal
export interface PostMinimalData {
  id: number;
  title: string;
}

export class PostMinimal implements PostMinimalData {
  id: number;
  title: string;

  constructor(value: PostMinimalData) {
    this.id = value.id;
    this.title = value.title;
  }

  static fromJson = (json: PostMinimalData) => new PostMinimal(json);
}

// CourseMinimal
export interface CourseMinimalData {
  id: number;
  course_id: string;
}

export class CourseMinimal implements CourseMinimalData {
  id: number;
  course_id: string;

  constructor(value: CourseMinimalData) {
    this.id = value.id;
    this.course_id = value.course_id;
  }

  static fromJson = (json: CourseMinimalData) => new CourseMinimal(json);
}

// Course
export interface CourseData {
  id: number;
  course_id: string;
  course_name: string;
  year: number;
  semester: number;
  instructor: string;
  classification: string;
  credits: number;
  course_week: string[];
  course_period: Array<number>[];
  course_room: string;
  enrollment: number;
}

export class Course implements CourseData {
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

  constructor(value: CourseData) {
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
    this.enrollment = 0; //value.enrollment;
  }

  static fromJson = (json: CourseData): Course => new Course(json);
}

// 주간시간표 구현 편의를 위한 인터페이스
export interface CourseBlock extends TimeSlot {
  id: number;
  course_id: string;
  course_name: string;
  course_room: string;
  instructor: string;
}

export interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

export interface TimetableData {
  student: number;
  year: string;
  semester: string;
  courses: Course[];
}

export class TimetableModel implements TimetableData {
  student: number;
  year: string;
  semester: string;
  courses: Course[];

  constructor(value: TimetableData) {
    this.student = value.student;
    this.year = value.year;
    this.semester = value.semester;
    this.courses = value.courses.map(json => Course.fromJson(json));
  }

  static fromJson = (json: TimetableData): TimetableModel => {
    return new TimetableModel(json);
  };
}

// 시간표 업데이트를 위한 인터페이스
export interface TimetableUpdateData {
  student: number;
  year: string;
  semester: string;
  course_ids: number[];
}

export interface TimetablePartialUpdateData {
  student: number;
  year: string;
  semester: string;
}
