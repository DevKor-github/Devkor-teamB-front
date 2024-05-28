import {Schedule} from './screens/timetable/TimetableTypes.tsx';
import {Community} from './screens/community/CommunityTypes.tsx';
import UserInfo from './UserTypes.tsx';

export const mockLectures: Schedule = [
  {
    name: '과목1',
    professor: '교수1',
    room: '정보통신관 205호',
    id: 'ABCD123',
    time: [
      {
        day: '금',
        start: '15:30',
        end: '19:00',
      },
    ],
  },
  {
    name: '과목2',
    professor: '교수2',
    room: '정보통신관 205호',
    id: 'ABCD124',
    time: [
      {
        day: '화',
        start: '13:30',
        end: '14:45',
      },
      {
        day: '목',
        start: '13:30',
        end: '14:45',
      },
    ],
  },
  {
    name: '과목3',
    professor: '교수3',
    room: '애기능생활관 302호',
    id: 'ABCD125',
    time: [
      {
        day: '월',
        start: '10:30',
        end: '11:45',
      },
      {
        day: '수',
        start: '10:30',
        end: '11:45',
      },
    ],
  },
  {
    name: '과목4',
    professor: '교수4',
    room: '애기능생활관 302호',
    id: 'ABCD126',
    time: [
      {
        day: '월',
        start: '15:00',
        end: '17:45',
      },
    ],
  },
  {
    name: '과목5',
    professor: '교수5',
    room: '',
    id: 'ABCD127',
    time: [],
  },
  {
    name: '과목6',
    professor: '교수6',
    room: '',
    id: 'ABCD128',
    time: [],
  },
];

export const mockCommunities: Community = new Map([
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
          },
          {
            commentId: 1,
            userId: 'user456',
            content: '그렇죠! 이런 날은 특별한 에너지를 받는 것 같아요.',
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
          },
          {
            commentId: 1,
            userId: 'commenter6',
            content:
              "'인셉션' 좋은 선택이에요. 시간 가는 줄 모르고 봤던 기억이 나네요.",
          },
        ],
      },
    ],
  ],
]);