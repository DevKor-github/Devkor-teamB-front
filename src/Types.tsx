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

export type SimpleLecture = {
  name: string;
  room: string;
  id: string;
  start: string;
  end: string;
};

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
  userId: string;
  content: string;
  date: string;
};

export type Attachment = {
  uri: string;
  name: string;
  type: string;
};

export type Post = {
  postId: number;
  author: UserInfo;
  title: string;
  postDate: string;
  view: number;
  content: string;
  comments: Comment[];
  attachments: Attachment[];
};
