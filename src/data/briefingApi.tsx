import axios from 'axios';
import {getToken, getUserId} from './authStorage';
import {logger} from '@src/logger';
import {API_URL} from '@env';

export interface TodayPolls {
  id: number;
  check_attention?: boolean;
  check_test?: boolean;
  check_homework?: boolean;
  created_at?: Date;
  answered_at?: Date;
  expired?: boolean;
  course_fk: number;
  student: number;
}

export interface BriefingList {
  id: number;
  course_fk: number;
  created_at: Date;
}

interface BriefingData {
  date: string;
  course_fk: number;
  course_name: string;
}

interface BriefingResponses {
  total: number;
  answered: number;
  attendance_true: number;
  assignment_true: number;
  notification_true: number;
}

export interface BriefingSummary {
  response_percentage: number;
  attendance_percentage: number;
  assignment_percentage: number;
  notification_percentage: number;
}

interface BriefingContent {
  briefing_data: BriefingData;
  responses: BriefingResponses;
  summary: BriefingSummary;
}

export interface Briefing {
  id: string;
  course_fk: number;
  content: BriefingContent;
  created_at: string;
  updated_at: string;
}
export const fetchTodayPolls = async (courseId: number, date: String) => {
  try {
    const token = await getToken();
    const userId = await getUserId();
    const {data} = await axios.get<TodayPolls[]>(`${API_URL}/todaypolls/`, {
      params: {
        student_id: Number(userId),
        course_fk: courseId,
        created_at_start: date,
      },
      headers: {
        authorization: `token ${token}`,
      },
    });
    logger.info('fetchTodayPolls', data);
    return data;
  } catch (e) {
    logger.error('fetchTodayPolls', e);
    return [];
  }
};

export const fetchTodayPollsById = async (id: number) => {
  try {
    const token = await getToken();
    const {data} = await axios.get<TodayPolls>(`${API_URL}/todaypolls/${id}/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    logger.info('fetchTodayPollsById', data);
    return data;
  } catch (e) {
    logger.error('fetchTodayPollsById', e);
    throw Error('Cannot fetch Today Polls');
  }
};

export const fetchUpdateTodayPolls = async (data: TodayPolls) => {
  try {
    const token = await getToken();
    const {status} = await axios.post(
      `${API_URL}/todaypolls/${data.id}/answer/`,
      {
        check_attention: data.check_attention,
        check_test: data.check_test,
        check_homework: data.check_homework,
      },
      {
        headers: {
          authorization: `token ${token}`,
        },
      },
    );
    logger.info('fetchUpdateTodayPolls', status);
    return status === 200;
  } catch (e) {
    logger.error('fetchUpdateTodayPolls', e);
    return false;
  }
};

// export const fetchBriefing = async (course_fk: number, date: Date) => {
//   try {
//     const created_at_start = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
//     const token = await getToken();
//     const {data} = await axios.get<Array<BriefingList>>(
//       `${API_URL}/briefings/`,
//       {
//         params: {
//           course_fk: course_fk,
//           created_at_start: created_at_start,
//         },
//         headers: {
//           authorization: `token ${token}`,
//         },
//       },
//     );
//     logger.info('fetchBriefing', data);
//     return data;
//   } catch (e) {
//     logger.error('fetchBriefing', e);
//     return [];
//   }
// };

export const fetchBriefing = async (course_fk: number, date: Date) => {
  try {
    const created_at_start = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}T00:00`;
    const token = await getToken();
    const {data} = await axios.get<Array<TodayPolls>>(
      `${API_URL}/todaypolls/`,
      {
        params: {
          course_fk: course_fk,
          created_at_start: created_at_start,
        },
        headers: {
          authorization: `token ${token}`,
        },
      },
    );
    logger.info('fetchBriefing', data);
    return data;
  } catch (e) {
    logger.error('fetchBriefing', e);
    return [];
  }
};

// export const fetchBriefingById = async (id: number) => {
//   try {
//     const token = await getToken();
//     const {data} = await axios.get<Briefing>(`${API_URL}/briefings/${id}/`, {
//       headers: {
//         authorization: `token ${token}`,
//       },
//     });
//     logger.info('fetchBriefingById', data);
//     return data;
//   } catch (e) {
//     logger.error('fetchBriefingById', e);
//     throw Error('Cannot fetch Briefing');
//   }
// };

export const fetchBriefingById = async (id: number) => {
  try {
    const token = await getToken();
    const {data} = await axios.get<TodayPolls>(`${API_URL}/todaypolls/${id}/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    logger.info('fetchBriefingById', data);
    return data;
  } catch (e) {
    logger.error('fetchBriefingById', e);
    throw Error('Cannot fetch Briefing');
  }
};
