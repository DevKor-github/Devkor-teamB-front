import {Lecture, Post, TimeSlot, UserInfo, Tag} from '@src/Types';

export const mockTags: Tag[] = [
  {
    id: 1,
    name: '중간고사',
  },
  {
    id: 2,
    name: '브리핑',
  },
  {
    id: 3,
    name: '출석',
  },
  {
    id: 4,
    name: '기말고사',
  },
  {
    id: 5,
    name: '과제',
  },
];

export const tagColors: {[key: number]: string} = {
  1: '#FFE0EF',
  2: '#E8E7FE',
  3: 'lightgreen',
  4: 'yellow',
  5: 'orange',
};

export const mockLectures: Lecture[] = [
  {
    name: '과목A',
    professor: '교수1',
    room: '강의실 1호',
    id: 'ABCD123',
    mate: 38,
    type: '전공선택',
    credit: '3학점',
    timeInfo: '월, 수 (1)',
    time: [
      {day: '월', start: '09:00', end: '10:15'},
      {day: '수', start: '09:00', end: '10:15'},
    ],
  },
  {
    name: '과목B',
    professor: '교수2',
    room: '강의실 2호',
    id: 'ABCD124',
    mate: 38,
    type: '전공선택',
    credit: '3학점',
    timeInfo: '금 (2)',
    time: [{day: '금', start: '10:30', end: '11:45'}],
  },
  {
    name: '과목C (영강)',
    professor: '교수3',
    room: '강의실 3호',
    id: 'ABCD125',
    mate: 38,
    type: '전공선택',
    credit: '3학점',
    timeInfo: '월, 수 (3)',
    time: [
      {day: '월', start: '12:00', end: '13:15'},
      {day: '수', start: '12:00', end: '13:15'},
    ],
  },
  {
    name: '과목D',
    professor: '교수4',
    room: '강의실 4호',
    id: 'ABCD126',
    mate: 38,
    type: '전공선택',
    credit: '3학점',
    timeInfo: '월, 수 (4)',
    time: [
      {day: '월', start: '13:30', end: '14:45'},
      {day: '수', start: '13:30', end: '14:45'},
    ],
  },
  {
    name: '과목E',
    professor: '교수5',
    room: '',
    id: 'ABCD127',
    mate: 38,
    type: '교양',
    credit: '3학점',
    timeInfo: '',
    time: [],
  },
  {
    name: '과목F',
    professor: '교수6',
    room: '',
    id: 'ABCD128',
    mate: 38,
    type: '교양',
    credit: '3학점',
    timeInfo: '',
    time: [],
  },
  {
    name: '기초정보디자인(영강)',
    professor: '허나은',
    room: '미디어관 901호',
    id: 'ARDE229',
    mate: 38,
    type: '전공선택',
    credit: '3학점',
    timeInfo: '목 (5-6)',
    time: [{day: '목', start: '15:00', end: '17:45'}],
  },
  {
    name: '미술과문화',
    professor: '이응진',
    mate: 49,
    room: '교양관 105호',
    id: 'ARDE113',
    type: '학문의기초',
    credit: '3학점',
    timeInfo: '화 (1-2)',
    time: [{day: '화', start: '09:00', end: '11:45'}],
  },
];

export const mockPosts: Map<string, Post[]> = new Map([
  [
    'ABCD123',
    [
      {
        postId: 1,
        title: '오늘의 날씨',
        author: new UserInfo('user001', 'USER1', 'https://picsum.photos/232'),
        postDate: '2024-05-24 23:40:00',
        view: 10,
        content: '오늘은 날씨가 정말 좋네요! 밖에서 산책하기 딱 좋은 날이에요.',
        attachments: [
          {
            uri: 'https://picsum.photos/500',
            name: 'weather.jpg',
            type: 'image/jpeg',
          },
        ],
        tags: [
          {
            id: 5,
            name: '과제',
          },
        ],
        comments: [
          {
            commentId: 0,
            userId: 'user123',
            content: '맞아요! 날씨가 너무 좋아서 기분이 좋아지네요.',
            date: '2024-01-01',
            attachments: [
              {
                uri: 'https://picsum.photos/504',
                name: 'sunny.jpg',
                type: 'image/jpeg',
              },
            ],
          },
          {
            commentId: 1,
            userId: 'user456',
            content: '그렇죠! 이런 날은 특별한 에너지를 받는 것 같아요.',
            date: '2024-01-01',
            attachments: [],
          },
        ],
      },
      {
        postId: 2,
        title: '오늘의 책',
        author: new UserInfo('user002', 'USER2', 'https://picsum.photos/422'),
        postDate: '2024-03-24 22:19:05',
        view: 8,
        content:
          '오늘은 책을 읽는 것만으로도 힐링이 되는 날이에요. 여러분은 어떻게 힐링하시나요?',
        attachments: [],
        tags: [],
        comments: [
          {
            commentId: 0,
            userId: 'commenter3',
            content:
              '저도 책을 읽는 걸 좋아해요. 마음이 평화로워지는 기분이 들어요.',
            date: '2024-01-01',
            attachments: [],
          },
        ],
      },
      {
        postId: 3,
        title: '오늘의 저녁',
        author: new UserInfo('user003', 'USER3', 'https://picsum.photos/221'),
        postDate: '2024-01-24 12:45:10',
        view: 5,
        content:
          '오늘은 친구들과 함께 맛있는 저녁 식사를 했어요. 특별한 순간을 함께한 것 같아 기분이 좋네요.',
        attachments: [
          {
            uri: 'https://picsum.photos/501',
            name: 'dinner.jpg',
            type: 'image/jpeg',
          },
          {
            uri: 'https://picsum.photos/502',
            name: 'table.jpg',
            type: 'image/jpeg',
          },
        ],
        tags: [
          {
            id: 1,
            name: '중간고사',
          },
        ],
        comments: [],
      },
      {
        postId: 4,
        title: '최근 음악',
        author: new UserInfo('user004', 'USER4', 'https://picsum.photos/235'),
        postDate: '2023-12-22 8:13:39',
        view: 12,
        content: '최근에 들었던 음악 중에 너무 좋았던 노래가 있어요.',
        attachments: [],
        tags: [
          {
            id: 1,
            name: '중간고사',
          },
          {
            id: 3,
            name: '출석',
          },
        ],
        comments: [
          {
            commentId: 0,
            userId: 'commenter4',
            content: '노래 추천 좋아요! 무슨 노래인지 궁금하네요.',
            date: '2024-01-01',
            attachments: [],
          },
        ],
      },
      {
        postId: 5,
        title: '오늘의 영화',
        author: new UserInfo('user005', 'USER5', 'https://picsum.photos/95'),
        postDate: '2022-05-20 10:31:05',
        view: 3,
        content:
          '오늘은 집에서 영화를 보면서 푹 쉬는 날이에요. 특별한 영화 추천이 있을까요?',
        attachments: [
          {
            uri: 'https://picsum.photos/503',
            name: 'movie.jpg',
            type: 'image/jpeg',
          },
        ],
        tags: [
          {
            id: 1,
            name: '중간고사',
          },
          {
            id: 3,
            name: '출석',
          },
        ],
        comments: [
          {
            commentId: 0,
            userId: 'commenter5',
            content:
              "영화 추천이요? '인셉션' 같은 거 보시면 재미있을 것 같아요!",
            date: '2024-01-01',
            attachments: [],
          },
          {
            commentId: 1,
            userId: 'commenter6',
            content:
              "'인셉션' 좋은 선택이에요. 시간 가는 줄 모르고 봤던 기억이 나네요.",
            date: '2024-01-01',
            attachments: [],
          },
        ],
      },
    ],
  ],
  [
    'ARDE113',
    [
      {
        postId: 1,
        title: 'Introduction to Python',
        author: new UserInfo(
          'user_01',
          'Alice Smith',
          'https://example.com/image1.jpg',
        ),
        postDate: '2024-01-01 10:00:00',
        view: 150,
        content:
          'Welcome to the Introduction to Python course. Feel free to ask any questions here.',
        attachments: [],
        tags: [
          {
            id: 1,
            name: '중간고사',
          },
        ],
        comments: [
          {
            commentId: 1,
            userId: 'user_02',
            content: 'Thank you for the introduction!',
            date: '2024-01-01',
            attachments: [],
          },
          {
            commentId: 2,
            userId: 'user_03',
            content: 'Excited to start learning!',
            date: '2024-01-01',
            attachments: [],
          },
        ],
      },
      {
        postId: 2,
        title: 'Python Data Structures',
        author: new UserInfo(
          'user_04',
          'Bob Johnson',
          'https://example.com/image2.jpg',
        ),
        postDate: '2024-01-02 11:30:00',
        view: 200,
        content:
          'This post will cover lists, dictionaries, and other data structures in Python.',
        attachments: [
          {
            uri: 'https://example.com/data_structures.jpg',
            name: 'data_structures.jpg',
            type: 'image/jpeg',
          },
        ],
        tags: [
          {
            id: 1,
            name: '중간고사',
          },
          {
            id: 2,
            name: '브리핑',
          },
        ],
        comments: [
          {
            commentId: 3,
            userId: 'user_05',
            content: 'What is the difference between a list and a tuple?',
            date: '2024-01-01',
            attachments: [],
          },
          {
            commentId: 4,
            userId: 'user_06',
            content: 'Can you give examples of dictionary use cases?',
            date: '2024-01-01',
            attachments: [],
          },
        ],
      },
      {
        postId: 3,
        title: 'Control Flow in Python',
        author: new UserInfo(
          'user_07',
          'Carol Davis',
          'https://example.com/image3.jpg',
        ),
        postDate: '2024-01-03 09:00:00',
        view: 175,
        content:
          'In this post, we will discuss loops, conditionals, and error handling in Python.',
        attachments: [],
        tags: [
          {
            id: 2,
            name: '브리핑',
          },
        ],
        comments: [
          {
            commentId: 5,
            userId: 'user_08',
            content: 'How do you handle exceptions in Python?',
            date: '2024-01-01',
            attachments: [],
          },
          {
            commentId: 6,
            userId: 'user_09',
            content: 'What are the different types of loops in Python?',
            date: '2024-01-01',
            attachments: [],
          },
        ],
      },
      {
        postId: 4,
        title: 'Functions in Python',
        author: new UserInfo(
          'user_10',
          'David Wilson',
          'https://example.com/image4.jpg',
        ),
        postDate: '2024-01-04 14:15:00',
        view: 220,
        content: "Let's learn about defining and calling functions in Python.",
        attachments: [
          {
            uri: 'https://example.com/functions.jpg',
            name: 'functions.jpg',
            type: 'image/jpeg',
          },
        ],
        tags: [
          {
            id: 1,
            name: '중간고사',
          },
          {
            id: 3,
            name: '출석',
          },
        ],
        comments: [
          {
            commentId: 7,
            userId: 'user_11',
            content: 'What is the syntax for defining a function?',
            date: '2024-01-01',
            attachments: [],
          },
          {
            commentId: 8,
            userId: 'user_12',
            content: 'Can functions return multiple values?',
            date: '2024-01-01',
            attachments: [],
          },
        ],
      },
      {
        postId: 5,
        title: 'Python Modules and Packages',
        author: new UserInfo(
          'user_13',
          'Eve Thompson',
          'https://example.com/image5.jpg',
        ),
        postDate: '2024-01-05 16:45:00',
        view: 190,
        content:
          'This post will cover how to use and create modules and packages in Python.',
        attachments: [],
        tags: [],
        comments: [
          {
            commentId: 9,
            userId: 'user_14',
            content: 'What is the difference between a module and a package?',
            date: '2024-01-01',
            attachments: [],
          },
          {
            commentId: 10,
            userId: 'user_15',
            content: 'How do you import a module in Python?',
            date: '2024-01-01',
            attachments: [],
          },
        ],
      },
    ],
  ],
]);

const dateToString = (date: Date): string => {
  const hms = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const ymd = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  return `${ymd} ${hms}`;
};

class PointsManager {
  points = 0;
  listeners: Function[] = [];
  history: [number, string, string][] = [];

  constructor() {
    this.listeners = [];
    this.points = 200;
    this.history = [[200, '신규 회원 가입', dateToString(new Date())]];
  }

  getHistory() {
    return this.history;
  }

  getPoints() {
    return this.points;
  }

  addPoints(amount: number) {
    if (amount > 0) {
      this.points += amount;
      this.history.unshift([amount, '포인트 적립', dateToString(new Date())]);
      this.notifyListeners();
    }
  }

  usePoints(amount: number, info: string) {
    if (amount > 0 && amount <= this.points) {
      this.points -= amount;
      this.history.unshift([-amount, info, dateToString(new Date())]);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  addListener(callback: Function) {
    this.listeners.push(callback);
  }

  removeListener(callback: Function) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback: Function) => callback(this.points));
  }
}

const PointInstance = new PointsManager();
export {PointInstance};
