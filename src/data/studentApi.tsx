import {API_URL} from '@env';
import axios from 'axios';
import {getToken, getUserId} from './authStorage';
import {logger} from '@src/logger';
import {TimetableModel} from '@src/Types';

interface StudentInfo {
  user_id: number;
  nickname: string;
  points: number;
  permission_date: Date;
  permission_type: string;
}

export const fetchUserInfo = async () => {
  try {
    const token = await getToken();
    const {data, status} = await axios.get<StudentInfo>(
      `${API_URL}/student/user-info/`,
      {
        headers: {authorization: `token ${token}`},
        validateStatus: x => x === 200 || x === 404,
      },
    );
    logger.info('fetchUserInfo', data);
    return {data, status};
  } catch (error) {
    logger.error('fetchUserInfo', error);
    throw Error('Unable to fetch user info.');
  }
};

export const fetchStudentImage = async (name: string) => {
  try {
    const token = await getToken();
    const {data} = await axios.get(`${API_URL}/student/image/`, {
      params: {name: name},
      headers: {authorization: `token ${token}`},
    });
    logger.info('fetchStudentImage', data[0]);
    return data[0].image;
  } catch (error) {
    logger.error('fetchStudentImage', error);
    return null;
  }
};

export const fetchTimetables = async () => {
  try {
    const token = await getToken();
    const userId = await getUserId();
    const {data, status} = await axios.get<TimetableModel>(
      `${API_URL}/timetables/${userId}/`,
      {
        headers: {authorization: `token ${token}`},
        validateStatus: x => x === 200 || x === 404,
      },
    );
    logger.info('fetchTimetables', status);
    if (status === 200) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    logger.error('fetchTimetables', error);
    throw Error('Unable to fetch timetables.');
  }
};
