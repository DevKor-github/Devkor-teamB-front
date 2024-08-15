import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '@src/Colors';
import ProgressBar from '@src/components/ProgessBar';
import RichText, {RichTextOption} from '@src/components/RichText';
import {useNavigation} from '@react-navigation/native';
import {PointInstance} from '@src/MockData';
import Banner from '@src/components/Banner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const pointInstance = PointInstance;
const API_URL = 'http://15.165.198.75:8000';

/** 포인트 관련 컴포넌트 */
const PointHistory = () => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const points = [10, 20, 50, 0, 100, 0, 0];
  const today = new Date().getDay();

  return (
    <View style={pointHistoryStyles.container}>
      {points.map((value, idx) => {
        const color = idx === today ? Colors.primary[100] : 'transparent';
        return (
          <View key={idx} style={pointHistoryStyles.itemContainer}>
            <Text style={pointHistoryStyles.dayText}>{days[idx]}</Text>
            <View
              style={[
                pointHistoryStyles.pointContainer,
                {backgroundColor: color},
              ]}>
              <Text style={pointHistoryStyles.pointText}>{value}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const tips: {
  icon: ImageSourcePropType;
  texts: [string, RichTextOption][];
}[][] = [
  [
    {
      icon: require('@assets/icons/tip_new.png'),
      texts: [
        ['신입 회원 ', RichTextOption.default],
        ['100 ', RichTextOption.bold],
        ['포인트 적립', RichTextOption.default],
      ],
    },
    {
      icon: require('@assets/icons/tip_response.png'),
      texts: [
        ['게시글 답변 작성 시 ', RichTextOption.default],
        ['5 ', RichTextOption.bold],
        ['포인트 적립', RichTextOption.default],
      ],
    },
  ],
  [
    {
      icon: require('@assets/icons/tip_question.png'),
      texts: [
        ['오늘의 질문 답변 시 ', RichTextOption.default],
        ['10 ', RichTextOption.bold],
        ['포인트 적립', RichTextOption.default],
      ],
    },
    {
      icon: require('@assets/icons/tip_accept.png'),
      texts: [
        ['게시글 답변 채택 시 ', RichTextOption.default],
        ['20 ', RichTextOption.bold],
        ['포인트 적립', RichTextOption.default],
      ],
    },
  ],
];

const PointTips = () => {
  const renderItem = (
    key: any,
    icon: ImageSourcePropType,
    texts: [string, RichTextOption][],
  ) => {
    return (
      <View key={key} style={tipStyles.item}>
        <Image style={tipStyles.icon} source={icon} />
        <RichText
          textStyle={{fontSize: FontSizes.small}}
          boldTextStyle={{fontSize: FontSizes.small}}
          text={texts}
        />
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={tipStyles.label}>포인트 Tip</Text>
      {tips.map((row, rowIdx) => {
        return (
          <View key={rowIdx} style={tipStyles.textRow}>
            {row.map((tip, colIdx) => renderItem(colIdx, tip.icon, tip.texts))}
          </View>
        );
      })}
    </View>
  );
};

const PointInfoButton = () => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('StoreHistoryScreen')}
      style={pointStyles.button}>
      <Image
        style={pointStyles.buttonIcon}
        source={require('@assets/icons/coin.png')}
      />
      <Text style={{marginLeft: 4}}>nn 포인트</Text>
      <Image
        style={pointStyles.buttonIcon}
        source={require('@assets/icons/arrow_right.png')}
      />
    </TouchableOpacity>
  );
};

const PointInfoSection = () => {
  const [point, setPoints] = useState(pointInstance.getPoints());
  useEffect(() => {
    const handlePointsChanged = setPoints;
    pointInstance.addListener(handlePointsChanged);

    return () => {
      pointInstance.removeListener(handlePointsChanged);
    };
  }, []);

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
        <ProgressBar progress={40} />
        <PointHistory />
      </View>
      <View style={pointStyles.divider} />
      <PointTips />
    </View>
  );
};

/** 상점 관련 컴포넌트 */
const StoreItemCard = ({
  title,
  point,
  type,
}: {
  title: string;
  point: number;
  type: string;
}) => {
  const fetchPoints = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_URL}/student/use-points/`,
        {point_costs: type},
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      );
      return response.status === 200;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const onStoreItemPress = () => {
    Alert.alert(`${title}을 구매합니다`, '', [
      {text: '취소', style: 'destructive'},
      {
        text: '확인',
        onPress: async () => {
          const request = await fetchPoints();
          if (request) {
            Alert.alert('구매 완료!');
          } else {
            Alert.alert('포인트가 부족합니다');
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
          source={require('@assets/icons/box_open.png')}
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
  return (
    <View>
      <Text style={styles.label}>상점</Text>
      <View style={GlobalStyles.row}>
        <StoreItemCard title="1일 열람권" point={80} type="1" />
        <View style={storeStyles.divider} />
        <StoreItemCard title="7일 열람권" point={160} type="7" />
      </View>
      <View style={storeStyles.divider} />
      <View style={GlobalStyles.row}>
        <StoreItemCard title="14일 열람권" point={240} type="14" />
        <View style={storeStyles.divider} />
        <StoreItemCard title="30일 열람권" point={300} type="30" />
      </View>
    </View>
  );
};

const StoreScreen = () => {
  const promotions = [
    require('@assets/images/promotion_banner.png'),
    {uri: 'https://picsum.photos/1000/500'},
    {uri: 'https://picsum.photos/900/400'},
  ];
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <PointInfoSection />
          <Banner items={promotions} />
          <StoreItemSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    fontSize: FontSizes.xxLarge,
    marginBottom: 12,
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
    fontSize: FontSizes.medium,
    color: Colors.text.black,
    ...GlobalStyles.text,
  },
  pointText: {
    fontSize: FontSizes.regular,
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
  divider: {margin: 6},
  pointText: {
    fontSize: FontSizes.xxxLarge,
    ...GlobalStyles.boldText,
  },
  pointLabelText: {
    fontSize: FontSizes.xLarge,
    ...GlobalStyles.boldText,
  },
  pointInfoContainer: {
    marginBottom: 8,
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
  itemContainer: {
    justifyContent: 'center',
    ...GlobalStyles.expand,
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
    fontSize: FontSizes.medium,
    color: Colors.text.black,
    marginBottom: 4,
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
  base: {
    fontSize: FontSizes.regular,
    color: Colors.text.black,
    ...GlobalStyles.text,
  },
});

export default StoreScreen;
