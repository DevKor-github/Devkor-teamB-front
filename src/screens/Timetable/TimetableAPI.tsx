import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TimetableModel} from '@src/Types';
import axios from 'axios';

const fetchUserInfo: any = async (token: string | null) => {
  try {
    if (token === null) {
      throw Error('Missing Token');
    }
    const response = await axios.get(`${API_URL}/student/user-info/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const fetchTimetableData = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const {user_id} = await fetchUserInfo(token);
    const response = await axios.get(`${API_URL}/timetables/${user_id}/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    return TimetableModel.fromJson(response.data);
  } catch (e) {
    console.log(e);
  }
};

export {fetchUserInfo, fetchTimetableData};
