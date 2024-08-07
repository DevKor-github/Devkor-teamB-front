import {Lecture, Post, TimeSlot, UserInfo} from '@src/Types';

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
      new TimeSlot('월', '09:00', '10:15'),
      new TimeSlot('수', '09:00', '10:15'),
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
    time: [new TimeSlot('금', '10:30', '11:45')],
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
      new TimeSlot('월', '12:00', '13:15'),
      new TimeSlot('수', '12:00', '13:15'),
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
      new TimeSlot('월', '13:30', '14:45'),
      new TimeSlot('수', '13:30', '14:45'),
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
    time: [new TimeSlot('목', '15:00', '17:45')],
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
    time: [new TimeSlot('화', '09:00', '11:45')],
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
        comments: [
          {
            commentId: 0,
            userId: 'user123',
            content: '맞아요! 날씨가 너무 좋아서 기분이 좋아지네요.',
            date: '2024-01-01',
          },
          {
            commentId: 1,
            userId: 'user456',
            content: '그렇죠! 이런 날은 특별한 에너지를 받는 것 같아요.',
            date: '2024-01-01',
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
        comments: [
          {
            commentId: 0,
            userId: 'commenter3',
            content:
              '저도 책을 읽는 걸 좋아해요. 마음이 평화로워지는 기분이 들어요.',
            date: '2024-01-01',
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
        comments: [],
      },
      {
        postId: 4,
        title: '최근 음악',
        author: new UserInfo('user004', 'USER4', 'https://picsum.photos/235'),
        postDate: '2023-12-22 8:13:39',
        view: 12,
        content: '최근에 들었던 음악 중에 너무 좋았던 노래가 있어요.',
        comments: [
          {
            commentId: 0,
            userId: 'commenter4',
            content: '노래 추천 좋아요! 무슨 노래인지 궁금하네요.',
            date: '2024-01-01',
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
        comments: [
          {
            commentId: 0,
            userId: 'commenter5',
            content:
              "영화 추천이요? '인셉션' 같은 거 보시면 재미있을 것 같아요!",
            date: '2024-01-01',
          },
          {
            commentId: 1,
            userId: 'commenter6',
            content:
              "'인셉션' 좋은 선택이에요. 시간 가는 줄 모르고 봤던 기억이 나네요.",
            date: '2024-01-01',
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
        comments: [
          {
            commentId: 1,
            userId: 'user_02',
            content: 'Thank you for the introduction!',
            date: '2024-01-01',
          },
          {
            commentId: 2,
            userId: 'user_03',
            content: 'Excited to start learning!',
            date: '2024-01-01',
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
        comments: [
          {
            commentId: 3,
            userId: 'user_05',
            content: 'What is the difference between a list and a tuple?',
            date: '2024-01-01',
          },
          {
            commentId: 4,
            userId: 'user_06',
            content: 'Can you give examples of dictionary use cases?',
            date: '2024-01-01',
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
        comments: [
          {
            commentId: 5,
            userId: 'user_08',
            content: 'How do you handle exceptions in Python?',
            date: '2024-01-01',
          },
          {
            commentId: 6,
            userId: 'user_09',
            content: 'What are the different types of loops in Python?',
            date: '2024-01-01',
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
        comments: [
          {
            commentId: 7,
            userId: 'user_11',
            content: 'What is the syntax for defining a function?',
            date: '2024-01-01',
          },
          {
            commentId: 8,
            userId: 'user_12',
            content: 'Can functions return multiple values?',
            date: '2024-01-01',
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
        comments: [
          {
            commentId: 9,
            userId: 'user_14',
            content: 'What is the difference between a module and a package?',
            date: '2024-01-01',
          },
          {
            commentId: 10,
            userId: 'user_15',
            content: 'How do you import a module in Python?',
            date: '2024-01-01',
          },
        ],
      },
    ],
  ],
]);
