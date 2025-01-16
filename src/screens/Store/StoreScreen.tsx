import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import Colors from '@src/Colors';
import {PointEventHandler} from '@src/Events';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {consumePoints, PermissionType} from './StoreHandler';
import {
  fetchCheckPermission,
  fetchGetNowPoints,
  fetchGetPointHistory,
  PointHistory,
} from '@src/data/storeApi';
import Banner from '@src/components/Banner';

const PointHistoryView = () => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0, 0]);
  const today = new Date().getDay();

  const filterPointHistory = (history: PointHistory[]) => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekPoints = new Array(7).fill(0);
    history.forEach(item => {
      const itemDate = new Date(item.point_time);
      if (itemDate >= weekStart && item.purpose === 'G') {
        const dayIndex = itemDate.getDay();
        weekPoints[dayIndex] += item.point;
      }
    });
    return weekPoints;
  };

  useEffect(() => {
    const getPointHistory = async () => {
      const history = await fetchGetPointHistory();
      const weekPoints = filterPointHistory(history);
      setPoints(weekPoints);
    };
    getPointHistory();
  }, []);

  return (
    <View style={pointHistoryStyles.container}>
      {points.map((value, idx) => {
        const color = idx === today ? Colors.primary[100] : 'transparent';
        const pointColor =
          idx === today ? Colors.text.accent : Colors.text.black;
        return (
          <View key={idx} style={GlobalStyles.expand}>
            <Text style={pointHistoryStyles.dayText}>{days[idx]}</Text>
            <View
              style={[
                pointHistoryStyles.pointContainer,
                {backgroundColor: color},
              ]}>
              <Text style={[pointHistoryStyles.pointText, {color: pointColor}]}>
                {value}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const PointTips = () => {
  const items = [
    [
      [require('@assets/icons/tip_new.png'), '신입 회원', 100],
      [require('@assets/icons/tip_response.png'), '게시글 답변 시', 5],
    ],
    [
      [require('@assets/icons/tip_question.png'), '오늘의 질문 답변 시', 10],
      // [require('@assets/icons/tip_accept.png'), '게시글 답변 채택 시', 20],
    ],
  ];

  return (
    <View style={styles.card}>
      <Text style={tipStyles.label}>포인트 Tip</Text>
      {items.map((row, rowIdx) => {
        return (
          <View key={rowIdx} style={tipStyles.textRow}>
            {row.map(([icon, info, tip], colIdx) => (
              <View key={colIdx} style={tipStyles.item}>
                <Image style={tipStyles.icon} source={icon} />
                <Text style={{fontSize: FontSizes.regular}}>
                  {info}
                  <Text style={tipStyles.accent}> {tip} </Text>
                  포인트
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};

const PointInfoButton = () => {
  const navigation = useNavigation<any>();
  const style = {marginLeft: 4};
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('StoreHistory')}
      style={pointStyles.button}>
      <Image
        style={pointStyles.buttonIcon}
        source={require('@assets/icons/coin.png')}
      />
      <Text style={style}>포인트 내역</Text>
      <Image
        style={pointStyles.buttonIcon}
        source={require('@assets/icons/arrow_right.png')}
      />
    </TouchableOpacity>
  );
};

const PointInfoSection = () => {
  const [point, setPoints] = useState(0);

  useEffect(() => {
    fetchGetNowPoints().then((points: number) => setPoints(points));
  }, []);

  useEffect(() => {
    PointEventHandler.addListener('POINTS_UPDATED', (value: number) => {
      setPoints(point + value);
    });
    return () => PointEventHandler.removeListener('POINTS_UPDATED');
  }, [point, setPoints]);

  return (
    <View>
      <Text style={styles.label}>적립 및 사용 내역</Text>
      <View style={styles.card}>
        <View style={pointStyles.pointInfoContainer}>
          <Text>
            <Text style={pointStyles.pointText}>{point}</Text>
            <Text style={pointStyles.pointLabelText}>P</Text>
          </Text>
          <PointInfoButton />
        </View>
        <PointHistoryView />
      </View>
      <View style={pointStyles.divider} />
      <PointTips />
    </View>
  );
};

const StoreItemCard = ({
  title,
  point,
  pass_type,
}: {
  title: string;
  point: number;
  pass_type: PermissionType;
}) => {
  const onStoreItemPress = () => {
    Alert.alert(`${title}을 구매합니다`, '', [
      {text: '취소', style: 'destructive'},
      {
        text: '확인',
        onPress: async () => {
          if (await fetchCheckPermission()) {
            Alert.alert(
              '이미 열람권을 보유 중입니다',
              '그래도 구매하겠습니까?\n기존 열람권은 더이상 사용할 수 없습니다',
              [
                {text: '취소', style: 'destructive'},
                {
                  text: '확인',
                  onPress: async () => {
                    const success = await consumePoints(pass_type);
                    Alert.alert(success ? '구매 완료' : '포인트가 부족합니다');
                  },
                },
              ],
            );
          } else {
            const success = await consumePoints(pass_type);
            Alert.alert(success ? '구매 완료' : '포인트가 부족합니다');
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.card, GlobalStyles.row]}
      onPress={onStoreItemPress}>
      <View style={storeStyles.iconContainer}>
        <Image
          source={require('@assets/icons/giftbox.png')}
          style={storeStyles.icon}
        />
      </View>
      <View style={storeStyles.textContainer}>
        <Text style={storeStyles.titleText}>{title}</Text>
        <Text style={storeStyles.pointText}>{`${point}P`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const StoreItemSection = () => {
  const storeItems = [
    [PermissionType.DAY, PermissionType.WEEK],
    [PermissionType.FORTNIGHT, PermissionType.MONTH],
  ];

  return (
    <View>
      <Text style={styles.label}>상점</Text>
      {storeItems.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <View style={GlobalStyles.row}>
            {row.map((passType, colIndex) => (
              <React.Fragment key={colIndex}>
                <StoreItemCard
                  title={`${passType.days}일 열람권`}
                  point={passType.cost}
                  pass_type={passType}
                />
                {colIndex < row.length - 1 && (
                  <View style={storeStyles.divider} />
                )}
              </React.Fragment>
            ))}
          </View>
          {rowIndex < storeItems.length - 1 && (
            <View style={storeStyles.divider} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const StoreHeader = () => {
  return (
    <SafeAreaView edges={['top']} style={headerStyles.safeArea}>
      <View style={headerStyles.container}>
        <View style={headerStyles.logoContainer}>
          <Image
            source={require('@assets/icons/app_logo.png')}
            style={headerStyles.logo}
          />
          <Text style={headerStyles.logoText}>KU&A</Text>
        </View>
        <View style={headerStyles.buttonContainer}>
          {/* <TouchableOpacity>
            <Image
              style={headerStyles.icon}
              source={require('@assets/icons/bell.png')}
            />
          </TouchableOpacity> */}
          {/* <TouchableOpacity>
            <Image
              style={headerStyles.icon}
              source={require('@assets/icons/setting.png')}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const StoreScreen = () => {
  const promotions = [require('@assets/images/promotion_banner.png')];
  return (
    <View style={styles.safeArea}>
      <StoreHeader />
      <ScrollView>
        <View style={styles.container}>
          <PointInfoSection />
          <StoreItemSection />
          <Banner items={promotions} />
        </View>
      </ScrollView>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.ui.primary,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  container: {
    height: 64,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...GlobalStyles.row,
  },
  logoContainer: {
    alignItems: 'baseline',
    ...GlobalStyles.expand,
    ...GlobalStyles.row,
  },
  buttonContainer: {
    ...GlobalStyles.row,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    fontSize: FontSizes.xxxLarge,
    color: Colors.text.white,
    ...GlobalStyles.logo,
  },
  icon: {
    tintColor: Colors.ui.background,
    width: 28,
    height: 28,
    marginHorizontal: 7,
  },
});

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.expand,
  },
  container: {
    paddingHorizontal: 16,
    backgroundColor: Colors.ui.background,
  },
  label: {
    paddingTop: 24,
    paddingBottom: 12,
    fontSize: FontSizes.xxLarge,
    ...GlobalStyles.boldText,
  },
  card: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.shadow,
  },
});

const storeStyles = StyleSheet.create({
  divider: {
    margin: 4,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.shadow,
  },
  textContainer: {
    marginLeft: 14,
    justifyContent: 'space-around',
  },
  titleText: {
    fontSize: FontSizes.regular,
    color: Colors.text.black,
    ...GlobalStyles.text,
  },
  pointText: {
    fontSize: FontSizes.large,
    color: Colors.text.accent,
    ...GlobalStyles.boldText,
  },
  icon: {
    width: 32,
    height: 32,
  },
  iconContainer: {
    borderRadius: 100,
    backgroundColor: Colors.ui.background,
    padding: 6,
    ...GlobalStyles.shadow,
  },
});

const pointStyles = StyleSheet.create({
  label: {
    fontSize: FontSizes.xxLarge,
    ...GlobalStyles.boldText,
  },
  divider: {
    height: 18,
  },
  pointText: {
    fontSize: FontSizes.xxxLarge,
    ...GlobalStyles.boldText,
  },
  pointLabelText: {
    fontSize: FontSizes.xLarge,
    ...GlobalStyles.boldText,
  },
  pointInfoContainer: {
    // marginBottom: 8,
    justifyContent: 'space-between',
    ...GlobalStyles.row,
  },
  button: {
    alignSelf: 'flex-end',
    ...GlobalStyles.row,
  },
  buttonIcon: {
    tintColor: Colors.text.gray,
    width: 16,
    height: 16,
  },
});

const pointHistoryStyles = StyleSheet.create({
  container: {
    marginTop: 18,
    ...GlobalStyles.row,
  },
  dayText: {
    textAlign: 'center',
    fontSize: FontSizes.regular,
    ...GlobalStyles.text,
  },
  pointText: {
    textAlign: 'center',
    fontSize: FontSizes.medium,
    ...GlobalStyles.text,
  },
  pointContainer: {
    marginTop: 12,
    borderRadius: 14,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 28,
    height: 28,
  },
});

const tipStyles = StyleSheet.create({
  label: {
    marginBottom: 4,
    fontSize: FontSizes.large,
    color: Colors.text.black,
    ...GlobalStyles.boldText,
  },
  item: {
    alignItems: 'center',
    ...GlobalStyles.expand,
    ...GlobalStyles.row,
  },
  icon: {
    width: 10,
    height: 10,
    marginRight: 4,
  },
  textRow: {
    marginTop: 4,
    ...GlobalStyles.row,
  },
  accent: {
    fontSize: FontSizes.regular,
    color: Colors.text.accent,
    ...GlobalStyles.boldText,
  },
});

export default StoreScreen;
