import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Colors from '@src/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';

const RegistrationInfoScreen = ({navigation}: {navigation: any}) => {
  useEffect(() => {
    setTimeout(() => navigation.navigate('Register'), 2000);
  });
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.topContainer}>
        <Image
          style={styles.appIcon}
          source={require('@assets/icons/app_logo.png')}
        />
        <Text style={styles.appLogo}>KU&A</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.titleRow}>
          <Image
            style={styles.titleIcon}
            source={require('@assets/icons/app_logo.png')}
          />
          <Text style={styles.title}>반갑습니다!</Text>
        </View>
        <Text style={styles.subTitle}>당신의 시간표를 등록해주세요</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    overflow: 'hidden',
    backgroundColor: Colors.ui.primary,
    ...GlobalStyles.expand,
  },
  topContainer: {flex: 3},
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 40,
  },
  appIcon: {
    position: 'absolute',
    resizeMode: 'contain',
    tintColor: 'rgba(250, 96, 170, 1)',
    width: 500,
    bottom: 0,
    left: -100,
  },
  appLogo: {
    position: 'absolute',
    top: 120,
    right: -100,
    fontSize: 120,
    color: Colors.primary[100],
    transform: [{rotate: '-90deg'}],
    ...GlobalStyles.logo,
  },
  titleRow: {
    alignItems: 'flex-end',
    ...GlobalStyles.row,
  },
  titleIcon: {
    height: 64,
    width: 64,
    tintColor: Colors.ui.background,
    resizeMode: 'contain',
  },
  title: {
    fontSize: FontSizes.xxxLarge,
    color: Colors.text.white,
    paddingVertical: 4,
    paddingHorizontal: 12,
    ...GlobalStyles.boldText,
  },
  subTitle: {
    fontSize: FontSizes.xLarge,
    color: Colors.text.white,
    paddingVertical: 12,
    paddingHorizontal: 4,
    ...GlobalStyles.text,
  },
});

export default RegistrationInfoScreen;
