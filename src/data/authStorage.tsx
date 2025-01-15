import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const setToken = async (token: string) => {
  await AsyncStorage.setItem('userToken', token);
};

export const getUserId = async () => {
  return await AsyncStorage.getItem('userId');
};

export const getUserNickname = async () => {
  return await AsyncStorage.getItem('userNickname');
};

export const setUserId = async (userId: string) => {
  await AsyncStorage.setItem('userId', userId);
};

export const setUserNickname = async (userNickname: string) => {
  await AsyncStorage.setItem('userNickname', userNickname);
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

export const removeAccess = async () => {
  await Promise.all([removeToken(), removeUserId(), removeUserNickname()]);
};
