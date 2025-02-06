import axios from 'axios';
import {API_URL} from '@env';
import {getToken} from './authStorage';
import {PermissionType} from '@src/screens/Store/StoreHandler';
import {logger} from '@src/logger';

export interface PointHistory {
  id: number;
  purpose: string;
  point: number;
  point_time: string;
  user: number;
}

export const fetchGetNowPoints = async () => {
  try {
    const token = await getToken();
    const {data} = await axios.get(`${API_URL}/student/get-now-points/`, {
      headers: {authorization: `token ${token}`},
    });
    logger.info('fetchGetNowPoints', data);
    return data as number;
  } catch (error) {
    logger.error('fetchGetNowPoints', error);
    return 0;
  }
};

export const fetchUsePoints = async (passType: PermissionType) => {
  try {
    const token = await getToken();
    const {status} = await axios.post(
      `${API_URL}/student/use-points/`,
      {point_costs: passType.days},
      {
        headers: {
          authorization: `token ${token}`,
        },
      },
    );
    logger.info('fetchUsePoints', status);
    return status === 201;
  } catch (error) {
    logger.error('fetchUsePoints', error);
    return false;
  }
};

export const fetchGetPoints = async (pointType: string) => {
  try {
    const token = await getToken();
    const {status} = await axios.post(
      `${API_URL}/student/get-points/`,
      {point_type: pointType},
      {headers: {authorization: `token ${token}`}},
    );
    logger.info('fetchGetPoints', status);
    return status === 201;
  } catch (error) {
    logger.error('fetchGetPoints', error);
    return false;
  }
};

export const fetchGivePoints = async (pointType: string, studentId: number) => {
  try {
    const token = await getToken();
    const {status} = await axios.post(
      `${API_URL}/student/get-points/`,
      {
        point_type: pointType,
        student_id: studentId
      },
      {headers: {authorization: `token ${token}`}},
    );
    logger.info('fetchGivePoints', status);
    return status === 201;
  } catch (error) {
    logger.error('fetchGivePoints', error);
    return false;
  }
};


export const fetchCheckPermission = async () => {
  try {
    const token = await getToken();
    const {status} = await axios.get(`${API_URL}/student/check-permission/`, {
      headers: {authorization: `token ${token}`},
      validateStatus: x => x === 201 || x === 400,
    });
    logger.info('fetchCheckPermission', status);
    return status === 201;
  } catch (error) {
    logger.error('fetchCheckPermission', error);
    return false;
  }
};

export const fetchGetPointHistory = async () => {
  try {
    const token = await getToken();
    const {data} = await axios.get<PointHistory[]>(
      `${API_URL}/student/get-point-history/`,
      {
        headers: {
          authorization: `token ${token}`,
        },
      },
    );
    logger.info('fetchGetPointHistory', data);
    return data;
  } catch (error) {
    logger.error('fetchGetPointHistory', error);
    return [];
  }
};
