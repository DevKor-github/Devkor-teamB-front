import {API_URL} from '@env';
import {logger} from '@src/logger';
import axios from 'axios';
import {setToken} from './authStorage';

export const fetchLogin = async (username: string, password: string) => {
  try {
    const {data, status} = await axios.post(
      `${API_URL}/student/login/`,
      {username: username, password: password},
      {validateStatus: x => x === 200 || x === 400},
    );

    if (status === 200) {
      logger.info('fetchLogin', status);
      await setToken(data.Token);
      return {status};
    } else {
      logger.info('fetchLogin', status);
      return {token: null, status};
    }
  } catch (e) {
    logger.error('fetchLogin', e);
    throw Error('Failed to login');
  }
};
