import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@src/logger';

export const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const setToken = async (token: string) => {
  await AsyncStorage.setItem('userToken', token);
};

export const getUserId = async () => {
  return await AsyncStorage.getItem('userId');
};

export const setUserId = async (userId: string) => {
  await AsyncStorage.setItem('userId', userId);
};

export const getUserNickname = async () => {
  return await AsyncStorage.getItem('userNickname');
};

export const setUserNickname = async (userNickname: string) => {
  await AsyncStorage.setItem('userNickname', userNickname);
};

export const getLoginId = async () => {
  return await AsyncStorage.getItem('loginId');
};

export const setLoginId = async (loginId: string) => {
  await AsyncStorage.setItem('loginId', loginId);
};

const removeToken = async () => {
  await AsyncStorage.removeItem('userToken');
};

const removeUserId = async () => {
  await AsyncStorage.removeItem('userId');
};

const removeUserNickname = async () => {
  await AsyncStorage.removeItem('userNickname');
};

const removeLoginId = async () => {
  await AsyncStorage.removeItem('loginId');
};

export const removeAccess = async () => {
  try {
    await Promise.all([
      removeToken(),
      removeUserId(),
      removeUserNickname(),
      removeLoginId(),
    ]);
  } catch(e) {
    logger.error('removeAccess', e);
  }
};
