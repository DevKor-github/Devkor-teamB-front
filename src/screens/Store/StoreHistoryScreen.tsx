import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

const API_URL = 'http://15.165.198.75:8000';

interface PointUsage {
  point: number;
  method: string;
  timestamp: string;
}

const fetchHistory = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    await axios.get(`${API_URL}/student/get-point-history/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const PointItem: React.FC<PointUsage> = ({point, method, timestamp}) => {
  return (
    <View style={itemStyles.container}>
      <Text style={itemStyles.methodText}>{method}</Text>
      <Text style={{flex: 1}}>{point}</Text>
      <Text style={{flex: 2}}>{timestamp}</Text>
    </View>
  );
};

const PointHistoryList = ({history}: {history: any[]}) => {
  return (
    <View style={styles.container}>
      {history.length === 0 && (
        <View style={styles.empty}>
          <Text>포인트 사용 기록이 없습니다</Text>
        </View>
      )}
      {history.length > 0 && (
        <FlatList
          renderItem={({item}: {item: [number, string, string]}) => {
            const [point, method, timestamp] = item;
            return (
              <PointItem point={point} method={method} timestamp={timestamp} />
            );
          }}
          data={history}
        />
      )}
    </View>
  );
};

const StoreHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>적립 및 사용내역</Text>
      <View>
        <Image
          style={styles.icon}
          source={require('@assets/icons/calendar_3d.png')}
        />
      </View>
    </View>
  );
};
const StoreHistoryScreen = () => {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    fetchHistory();
  }, [setHistory]);

  return (
    <SafeAreaView style={styles.background}>
      <StoreHeader />
      <PointHistoryList history={history} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.expand,
  },
  header: {
    padding: 16,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: FontSizes.xxLarge,
  },
  icon: {
    marginVertical: 24,
    width: 108,
    height: 108,
    alignSelf: 'flex-start',
    alignContent: 'center',
  },
  empty: {
    justifyContent: 'center',
    alignSelf: 'center',
    ...GlobalStyles.expand,
  },
  container: {
    ...GlobalStyles.expand,
  },
});

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

export default StoreHistoryScreen;
