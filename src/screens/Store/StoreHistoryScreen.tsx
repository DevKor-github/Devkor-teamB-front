import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  fetchGetNowPoints,
  fetchGetPointHistory,
  PointHistory,
} from '@src/data/storeApi';
import {
  getPermissionRemainder,
  getPermissionType,
  PermissionType,
} from './StoreHandler';

enum PointViewMode {
  usage,
  earning,
}

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

const TimeStamp = ({timestamp}: {timestamp: string}) => {
  const now = new Date();
  const pointTime = new Date(timestamp);
  const diffMs = now.getTime() - pointTime.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const month = (pointTime.getMonth() + 1).toString().padStart(2, '0');
  const date = pointTime.getDate().toString().padStart(2, '0');
  if (diffMins < 1) {
    return <Text style={itemStyles.timestampTextAccent}>방금</Text>;
  } else if (diffMins < 60) {
    return (
      <Text style={itemStyles.timestampTextAccent}>{`${diffMins}분 전`}</Text>
    );
  } else if (diffMins < 60 * 24) {
    const hours = Math.floor(diffMins / 60);
    return (
      <Text style={itemStyles.timestampTextAccent}>{`${hours}시간 전`}</Text>
    );
  } else if (diffMins < 60 * 24 * 7) {
    const days = Math.floor(diffMins / (60 * 24));
    return <Text style={itemStyles.timestampText}>{`${days}일 전`}</Text>;
  } else if (pointTime.getFullYear() === now.getFullYear()) {
    const timestampText = `${month}/${date}`;
    return <Text style={itemStyles.timestampText}>{timestampText}</Text>;
  } else {
    const yearDiff = now.getFullYear() - pointTime.getFullYear();
    return <Text style={itemStyles.timestampText}>{`${yearDiff}년 전`}</Text>;
  }
};

const Separator = () => <View style={itemStyles.seperator} />;

const PointHistoryList = ({
  mode,
  history,
}: {
  mode: PointViewMode;
  history: PointHistory[];
}) => {
  const getPointDetailText = (item: PointHistory) => {
    const {point, purpose} = item;
    const absPoint = Math.abs(point);

    if (purpose === 'U') {
      switch (absPoint) {
        case 80:
          return `KU&A 1일 열람권 ${absPoint}포인트 사용`;
        case 160:
          return `KU&A 7일 열람권 ${absPoint}포인트 사용`;
        case 240:
          return `KU&A 14일 열람권 ${absPoint}포인트 사용`;
        case 300:
          return `KU&A 30일 열람권 ${absPoint}포인트 사용`;
        default:
          return `${absPoint}포인트 사용`;
      }
    } else {
      switch (absPoint) {
        case 5:
          return `게시글 답변 작성 ${absPoint}포인트 적립`;
        case 10:
          return `오늘의 브리핑 답변 ${absPoint}포인트 적립`;
        case 20:
          return `게시글 답변 채택 ${absPoint}포인트 적립`;
        case 100:
          return `신규 회원 ${absPoint}포인트`;
        default:
          return `${absPoint}포인트 적립`;
      }
    }
  };

  if (history.length === 0) {
    return (
      <View style={historyStyles.emptyContainer}>
        <Text>
          {mode === PointViewMode.usage
            ? '포인트 사용 기록이 없습니다'
            : '포인트 적립 기록이 없습니다'}
        </Text>
      </View>
    );
  } else {
    return (
      <View style={historyStyles.listConatiner}>
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          ItemSeparatorComponent={Separator}
          data={history.reverse()}
          renderItem={({item}: {item: PointHistory}) => {
            return (
              <View style={itemStyles.container}>
                <View style={GlobalStyles.expand}>
                  <Text style={itemStyles.detailText}>
                    {getPointDetailText(item)}
                  </Text>
                </View>
                <TimeStamp timestamp={item.point_time} />
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
  const [permissionType, setPermissionType] = useState(PermissionType.NONE);
  const [remainder, setRemainder] = useState(0);
  const getDdayText = () => {
    if (remainder === 0) {
      return 'D-DAY';
    } else {
      return `D-${remainder}`;
    }
  };

  useEffect(() => {
    fetchGetNowPoints().then(setPoints);
    getPermissionType().then(setPermissionType);
    getPermissionRemainder().then(setRemainder);
  }, []);

  return (
    <View style={summaryStyles.container}>
      <View style={GlobalStyles.row}>
        <Image
          style={summaryStyles.icon}
          source={require('@assets/icons/calendar_3d.png')}
        />
        <View style={summaryStyles.summaryContainer}>
          <Text style={summaryStyles.remainderText}>현재 잔여</Text>
          <View style={summaryStyles.infoContainer}>
            <Text style={GlobalStyles.expand}>
              <Text style={summaryStyles.pointText}>{points}</Text>
              <Text style={summaryStyles.pointLabelText}>P</Text>
            </Text>
            {permissionType === PermissionType.NONE ? (
              <Text style={summaryStyles.expireText}>열람권이 없습니다</Text>
            ) : (
              <>
                <Text style={summaryStyles.expireText}>
                  {permissionType.days}일 열람권 만료기한
                </Text>
                <Text>&nbsp;</Text>
                <Text style={summaryStyles.ddayText}>{getDdayText()}</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const StoreHistoryScreen = () => {
  const [history, setHistory] = useState<PointHistory[]>([]);
  const [mode, setMode] = useState(PointViewMode.usage);
  const usageHistory = history.filter(value => value.purpose === 'U');
  const earningHistory = history.filter(value => value.purpose === 'G');

  useEffect(() => {
    fetchGetPointHistory().then(setHistory);
    return () => setHistory([]);
  }, [setHistory]);

  return (
    <View style={styles.background}>
      <PointSummary />
      <View style={historyStyles.container}>
        <PointHistoryButton mode={mode} onPress={setMode} />
        <PointHistoryList
          mode={mode}
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
  },
  summaryContainer: {
    justifyContent: 'center',
    ...GlobalStyles.expand,
  },
  icon: {
    marginRight: 16,
    width: 64,
    height: 64,
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
    margin: 16,
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
  timestampTextAccent: {
    fontSize: FontSizes.medium,
    color: Colors.text.accent,
    ...GlobalStyles.text,
  },
});

export default StoreHistoryScreen;
