import {API_URL} from '@env';
import axios from 'axios';
import {getToken, getUserId} from './authStorage';
import {logger} from '@src/logger';
import {
  Course,
  CourseData,
  CourseMinimal,
  CourseMinimalData,
  TimetableModel,
  TimetableUpdateData,
} from '@src/Types';

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
      throw Error('Timetable not found.');
    }
  } catch (error) {
    logger.error('fetchTimetables', error);
    throw Error('Unable to fetch timetables.');
  }
};

export const fetchCourses = async () => {
  try {
    const token = await getToken();
    const {data} = await axios.get<CourseData[]>(`${API_URL}/courses/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    logger.info('fetchCourses', data);
    return data;
  } catch (e) {
    logger.error('fetchCourses', e);
    return [];
  }
};

export const fetchCourseInfo = async (courseId: number) => {
  try {
    const token = await getToken();
    const {data} = await axios.get<CourseData>(
      `${API_URL}/courses/${courseId}/`,
      {
        headers: {
          authorization: `token ${token}`,
        },
      },
    );
    logger.info('fetchCourseInfo', data);
    return data;
  } catch (e) {
    logger.error('fetchCourseInfo', e);
    return null;
  }
};

export const fetchCreateTimetable = async (data: TimetableModel) => {
  try {
    const token = await getToken();
    const {status} = await axios.post(`${API_URL}/timetables/`, data, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    logger.info('fetchCreateTimetable', status);
    return status;
  } catch (e) {
    logger.error('fetchCreateTimetable', e);
    throw Error('Unable to create timetable.');
  }
};

export const fetchAllCourses = async () => {
  try {
    const courses = await fetchCourses();
    const courseMinimal = courses.map(CourseMinimal.fromJson);
    const items: Course[] = await Promise.all(
      courseMinimal.map(async (data: CourseMinimalData) => {
        const courseData = await fetchCourseInfo(data.id);
        return Course.fromJson(courseData!);
      }),
    );
    return items;
  } catch (e) {
    return [];
  }
};

export const fetchTimetableUpdate = async (data: TimetableUpdateData) => {
  try {
    const token = await getToken();
    const userId = await getUserId();
    const {status} = await axios.put(`${API_URL}/timetables/${userId}/`, data, {
      headers: {
        authorization: `token ${token}`,
      },
      validateStatus: x => x === 200 || x === 404,
    });
    logger.info('fetchTimetableUpdate', status);
    return status === 200;
  } catch (e) {
    logger.error('fetchTimetableUpdate', e);
    return false;
  }
};