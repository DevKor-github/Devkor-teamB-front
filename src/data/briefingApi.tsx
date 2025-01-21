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

export const fetchUpdateTodayPolls = async (id: number, data: any) => {
  try {
    const token = await getToken();
    const {status} = await axios.post(
      `${API_URL}/todaypolls/${id}/answer/`,
      data,
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
