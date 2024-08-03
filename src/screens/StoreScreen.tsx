// StoreScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {BottomTabNavigatorParamList} from '../navigator/BottomTabNavigator';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '@src/Colors';
import ProgressBar from '@src/components/ProgessBar';
import RichText, {RichTextOption, RichTextType} from '@src/components/RichText';

// type StoreScreenProps = NativeStackScreenProps<
//   BottomTabNavigatorParamList,
//   'Store'
// >;

const NotificationBanner = () => {
  return <View style={{marginVertical: 24}} />;
};

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

const tipStyles = StyleSheet.create({
  label: {
    fontSize: FontSizes.medium,
    color: Colors.text.black,
    ...GlobalStyles.text,
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

const PointTips = () => {
  const tips: Array<RichTextType> = [
    [
      ['신입 회원 ', RichTextOption.default],
      ['100 ', RichTextOption.bold],
      ['포인트 적립', RichTextOption.default],
    ],
    [
      ['게시글 답변 작성 시 ', RichTextOption.default],
      ['5 ', RichTextOption.bold],
      ['포인트 적립', RichTextOption.default],
    ],
    [
      ['오늘의 질문 답변 시 ', RichTextOption.default],
      ['10 ', RichTextOption.bold],
      ['포인트 적립', RichTextOption.default],
    ],
    [
      ['게시글 답변 채택 시 ', RichTextOption.default],
      ['20 ', RichTextOption.bold],
      ['포인트 적립', RichTextOption.default],
    ],
  ];

  return (
    <View style={styles.card}>
      <Text style={tipStyles.label}>포인트 Tip</Text>
      <View style={GlobalStyles.row}>
        <View style={GlobalStyles.expand}>
          <RichText text={tips[0]} />
        </View>
        <View style={GlobalStyles.expand}>
          <RichText text={tips[1]} />
        </View>
      </View>
      <View style={GlobalStyles.row}>
        <View style={GlobalStyles.expand}>
          <RichText text={tips[2]} />
        </View>
        <View style={GlobalStyles.expand}>
          <RichText text={tips[3]} />
        </View>
      </View>
    </View>
  );
};

const PointInfoButton = () => {
  return (
    <TouchableOpacity style={{alignSelf: 'flex-end'}}>
      <Text>nn 포인트 {'>'}</Text>
    </TouchableOpacity>
  );
};

const PointInfoSection = () => {
  const point = 180;
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

/** 프로모션 배너 컴포넌트 */
const PromotionBanner = () => {
  return (
    <View style={promotionStyles.container}>
      <Image
        style={promotionStyles.banner}
        resizeMode="contain"
        source={require('@assets/images/promotion-banner.png')}
      />
    </View>
  );
};

/** 상점 관련 컴포넌트 */
const StoreItemCard = ({title, point}: {title: string; point: number}) => {
  const onStoreItemPress = () => {
    Alert.alert(`${point}P를 사용합니다`);
  };

  return (
    <TouchableOpacity
      style={[styles.card, GlobalStyles.row]}
      onPress={onStoreItemPress}>
      <View style={storeStyles.iconContainer}>
        <Image
          source={require('@assets/icons/box-open.png')}
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

/** 아이템을 하드코딩해도 괜찮을까..? */
const StoreItemSection = () => {
  return (
    <View>
      <Text style={styles.label}>상점</Text>
      <View style={GlobalStyles.row}>
        <StoreItemCard title="1일 열람권" point={80} />
        <View style={storeStyles.divider} />
        <StoreItemCard title="7일 열람권" point={160} />
      </View>
      <View style={storeStyles.divider} />
      <View style={GlobalStyles.row}>
        <StoreItemCard title="14일 열람권" point={240} />
        <View style={storeStyles.divider} />
        <StoreItemCard title="30일 열람권" point={300} />
      </View>
    </View>
  );
};

const StoreScreen = () => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <NotificationBanner />
          <PointInfoSection />
          <PromotionBanner />
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

const promotionStyles = StyleSheet.create({
  container: {marginVertical: 18},
  banner: {width: 'auto'},
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

export default StoreScreen;
