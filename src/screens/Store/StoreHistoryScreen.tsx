import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

const API_URL = 'http://15.165.198.75:8000';

interface PointUsage {
  point: number;
  method: string;
  timestamp: string;
}

const itemStyles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    backgroundColor: Colors.ui.onPrimary,
  },
  divider: {
    width: 12,
  },
  methodText: {
    flex: 2,
    fontSize: FontSizes.large,
    color: Colors.text.black,
    ...GlobalStyles.boldText,
  },
});

const PointItem: React.FC<PointUsage> = ({point, method, timestamp}) => {
  return (
    <View style={itemStyles.container}>
      <Text style={itemStyles.methodText}>{method}</Text>
      <Text style={{flex: 1}}>{point}</Text>
      <Text style={{flex: 2}}>{timestamp}</Text>
    </View>
  );
};

const StoreHistoryScreen = ({navigation}: {navigation: any}) => {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(
          `${API_URL}/student/get-point-history/`,
          {
            headers: {
              authorization: `token ${token}`,
            },
          },
        );
        console.log(response.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchHistory();
  }, [setHistory]);

  return (
    <FlatList
      renderItem={({item}: {item: [number, string, string]}) => {
        const [point, method, timestamp] = item;
        return (
          <PointItem point={point} method={method} timestamp={timestamp} />
        );
      }}
      data={history}
    />
  );
};
export default StoreHistoryScreen;
