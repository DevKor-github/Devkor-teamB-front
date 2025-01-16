import {API_URL} from '@env';
import {logger} from '@src/logger';
import axios from 'axios';
import {getLoginId, getToken, setToken} from './authStorage';

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

export const fetchPasswordChange = async (
  old_password: string,
  new_password: string,
) => {
  try {
    const token = await getToken();
    const username = await getLoginId();
    const {data, status} = await axios.post(
      `${API_URL}/student/password-change/`,
      {
        username: username,
        old_password: old_password,
        new_password: new_password,
        isfind: false,
      },
      {
        headers: {
          authorization: `token ${token}`,
        },
        validateStatus: x => x === 201 || x === 400,
      },
    );
    logger.info('fetchPasswordChange', data);
    return status === 201;
  } catch (e) {
    logger.error('fetchPasswordChange', e);
    throw Error('Failed to change password');
  }
};

export const fetchSignUp = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const query = {
      username: username,
      email: email,
      password: password,
      first_name: '',
      last_name: '',
      group: '',
    };
    const {data, status} = await axios.post(`${API_URL}/student/signup/`, query, {
      validateStatus: x => x === 201 || x === 400,
    });
    logger.info('fetchSignUp', data);
    return status === 201;
  } catch (e) {
    logger.error('fetchSignUp', e);
    throw Error('Failed to sign up');
  }
};
