import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@src/Colors';
import ProgressBar from '@src/components/ProgessBar';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {API_URL} from '@env';

enum PointViewMode {
  usage,
  earning,
}

const fetchPoints = async (callback: Function) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_URL}/student/get-now-points/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    const value = response.data as number;
    callback(value);
  } catch (e) {
    console.error(e);
  }
};

const fetchHistory = async (callback: Function) => {
  const history = [
    ['use', 'KU&A 30일 열람권 300P 사용', '58분 전'],
    ['use', 'KU&A 14일 열람권 240P 사용', '1일 전'],
    ['use', 'KU&A 7일 열람권 160P 사용', '1주 전'],
    ['use', 'KU&A 1일 열람권 80P 사용', '1달 전'],
    ['add', '게시글 답변 채택 20P 적립', '3분 전'],
    ['add', '오늘의 질문 답변 작성 10P 적립', '11일 전'],
    ['add', '게시글 답변 작성 5P 적립', '1일 전'],
    ['add', '신입 회원 100P', '1년 전'],
  ];

  try {
    // const token = await AsyncStorage.getItem('userToken');
    // await axios.get(`${API_URL}/student/get-point-history/`, {
    //   headers: {
    //     authorization: `token ${token}`,
    //   },
    // });
    callback(history);
  } catch (e) {
    console.error(e);
  }
};

const PointHistoryButton = ({
  mode,
  onPress,
}: {
  mode: PointViewMode;
  onPress: Function;
}) => {
  const spacing = 16;
  return (
    <View style={GlobalStyles.row}>
      <TouchableOpacity onPress={() => onPress(PointViewMode.usage)}>
        <View
          style={
            mode === PointViewMode.usage
              ? historyStyles.activeButton
              : historyStyles.inactiveButton
          }>
          <Text
            style={
              mode === PointViewMode.usage
                ? historyStyles.activeText
                : historyStyles.inactiveText
            }>
            사용내역
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{width: spacing}} />
      <TouchableOpacity onPress={() => onPress(PointViewMode.earning)}>
        <View
          style={
            mode === PointViewMode.earning
              ? historyStyles.activeButton
              : historyStyles.inactiveButton
          }>
          <Text
            style={
              mode === PointViewMode.earning
                ? historyStyles.activeText
                : historyStyles.inactiveText
            }>
            적립내역
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const PointHistoryList = ({history}: {history: any[]}) => {
  const getSeperator = () => <View style={itemStyles.seperator} />;
  if (history.length === 0) {
    return (
      <View style={historyStyles.emptyContainer}>
        <Text>기록이 없습니다</Text>
      </View>
    );
  } else {
    return (
      <View style={historyStyles.listConatiner}>
        <FlatList
          ItemSeparatorComponent={getSeperator}
          data={history}
          renderItem={({item}: {item: [string, string, string]}) => {
            const [_, detail, timestamp] = item;
            return (
              <View style={itemStyles.container}>
                <View style={GlobalStyles.expand}>
                  <Text style={itemStyles.detailText}>{detail}</Text>
                </View>
                <Text style={itemStyles.timestampText}>{timestamp}</Text>
              </View>
            );
          }}
        />
      </View>
    );
  }
};

const PointSummary = () => {
  const [points, setPoints] = useState(0);
  const [ticket] = useState(30);
  const [remainder] = useState(9);

  useEffect(() => {
    fetchPoints(setPoints);
  }, [setPoints]);

  return (
    <View style={summaryStyles.container}>
      <View style={GlobalStyles.row}>
        <Image
          style={summaryStyles.icon}
          source={require('@assets/icons/calendar_3d.png')}
        />
        <View style={GlobalStyles.expand}>
          <Text style={summaryStyles.remainderText}>현재 잔여</Text>
          <View style={summaryStyles.infoContainer}>
            <Text style={GlobalStyles.expand}>
              <Text style={summaryStyles.pointText}>{points}</Text>
              <Text style={summaryStyles.pointLabelText}>P</Text>
            </Text>
            <Text>
              <Text style={summaryStyles.expireText}>
                {ticket}일 열람권 만료기한
              </Text>
              <Text> </Text>
              <Text style={summaryStyles.ddayText}>D-{remainder}</Text>
            </Text>
          </View>
          <ProgressBar progress={(1 - remainder / ticket) * 100} />
        </View>
      </View>
    </View>
  );
};

const StoreHistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState(PointViewMode.usage);
  const usageHistory = history.filter(value => value[0] === 'use');
  const earningHistory = history.filter(value => value[0] === 'add');

  useEffect(() => {
    fetchHistory(setHistory);
  }, [setHistory]);

  return (
    <View style={styles.background}>
      <PointSummary />
      <View style={historyStyles.container}>
        <PointHistoryButton mode={mode} onPress={setMode} />
        <PointHistoryList
          history={mode === PointViewMode.usage ? usageHistory : earningHistory}
        />
        <SafeAreaView edges={['bottom']} />
      </View>
    </View>
  );
};

const summaryStyles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: Colors.ui.background,
    borderRadius: 10,
    margin: 16,
    ...GlobalStyles.shadow,
  },
  infoContainer: {
    alignItems: 'baseline',
    ...GlobalStyles.row,
    ...GlobalStyles.expand,
  },
  icon: {
    marginRight: 16,
    width: 72,
    height: 72,
    alignSelf: 'flex-start',
    alignContent: 'center',
  },
  pointText: {
    fontSize: FontSizes.xxxLarge,
    fontWeight: 'bold',
  },
  pointLabelText: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
  },
  ddayText: {
    fontWeight: 'bold',
    fontSize: FontSizes.medium,
    color: Colors.text.accent,
  },
  expireText: {fontSize: FontSizes.medium},
  remainderText: {fontSize: FontSizes.regular},
});

const historyStyles = StyleSheet.create({
  container: {
    margin: 16,
    ...GlobalStyles.expand,
  },
  emptyContainer: {
    marginTop: 16,
    backgroundColor: Colors.ui.background,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    ...GlobalStyles.shadow,
    ...GlobalStyles.expand,
  },
  listConatiner: {
    marginTop: 16,
    backgroundColor: Colors.ui.background,
    borderRadius: 10,
    ...GlobalStyles.shadow,
    ...GlobalStyles.expand,
  },
  activeButton: {
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: Colors.ui.primary,
  },
  inactiveButton: {
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  inactiveText: {
    color: Colors.text.lightgray,
    fontSize: FontSizes.xLarge,
    ...GlobalStyles.boldText,
  },
  activeText: {
    color: Colors.text.black,
    fontSize: FontSizes.xLarge,
    ...GlobalStyles.boldText,
  },
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.expand,
  },
});

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 12,
  },
  seperator: {
    borderBottomColor: Colors.ui.disabled,
    borderBottomWidth: 1,
  },
  detailText: {
    fontSize: FontSizes.medium,
    color: Colors.text.gray,
    ...GlobalStyles.text,
  },
  timestampText: {
    fontSize: FontSizes.medium,
    color: Colors.text.gray,
    ...GlobalStyles.text,
  },
});

export default StoreHistoryScreen;
