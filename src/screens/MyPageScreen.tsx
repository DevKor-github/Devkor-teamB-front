import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Colors from '@src/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontSizes, GlobalStyles } from '@src/GlobalStyles';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const fetchUserImage = async () => {
  const token = await AsyncStorage.getItem('userToken');
  const { data } = await axios.get(`${API_URL}/student/image/`, {
    headers: { authorization: `token ${token}` },
  });
  // (임시) 존재하는 이미지로 대체
  return data[data.length - 2].image;
};

const fetchUserInfo = async () => {
  const token = await AsyncStorage.getItem('userToken');
  const { data } = await axios.get(`${API_URL}/student/user-info/`, {
    headers: { authorization: `token ${token}` },
  });
  return data.nickname;
};

const MY_INFO_ITEMS = {
  // '아이디 변경하기': 'changeId',
  '비밀번호 변경하기': 'changePassword',
  '시간표 수정하기': 'editTimetable',
  '로그아웃': 'logout',
  // '탈퇴하기': 'withdraw',
};

const MY_POST_ITEMS = [
  '내가 쓴 게시물',
  '내가 쓴 댓글',
  // '내가 스크랩한 글',
];

const handleItemPress = ({key, navigation}: {key: string, navigation: any}) => {
  switch (key) {
    case 'editTimetable':
      AsyncStorage.getItem('userId').then(id =>
        navigation.navigate('RegisterInfo', {userId: id, skip: true}),
      );
      break;
    case 'logout':
      Alert.alert('로그아웃하겠습니까?', '', [
        { text: '취소' },
        {
          text: '확인',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]);
      break;
    default:
      break;
  }
};

const MyPageScreen = () => {
  const [userImage, setUserImage] = useState('');
  const [nickname, setNickname] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserImage().then(image => setUserImage(image));
    fetchUserInfo().then(nickname => setNickname(nickname));
  }, []);
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('@assets/icons/app_logo.png')}
          style={styles.icon}
        />
        <View style={styles.content}>
          <View style={styles.headerTop} />
          <View style={styles.avatarContainer}>
            <Image
              // source={require('@assets/images/UserImage.png')}
              source={{
                uri: `${API_URL}${userImage}`,
              }}
              style={styles.avatar}
            />
          </View>
          <View style={GlobalStyles.row}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{nickname}</Text>
              {/* <View style={styles.userDetail}>
                <Text style={styles.userSchool}>고려대학교 재학</Text>
                <TouchableOpacity style={styles.schoolCertificationButton}>
                  <Text style={styles.schoolCertificationText}>
                    학교 인증 완료
                  </Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>내 정보 수정</Text>
            {Object.entries(MY_INFO_ITEMS).map(([item, key], index) => (
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={() => handleItemPress({key, navigation})}>
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>{item}</Text>
                  <Image
                    source={require('@assets/icons/arrow_right.png')}
                    style={styles.arrow}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.separator} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>내 글 관리</Text>
            {MY_POST_ITEMS.map((item, index) => (
              <TouchableOpacity key={index} style={styles.item}>
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>{item}</Text>
                  <Image
                    source={require('@assets/icons/arrow_right.png')}
                    style={styles.arrow}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: Colors.ui.primary,
  },
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: Colors.ui.background,
  },
  icon: {
    position: 'absolute',
    objectFit: 'contain',
    width: 280,
    height: 280,
    top: -40,
    right: -80,
    opacity: 0.75,
    tintColor: Colors.primary[50],
  },
  headerTop: {
    position: 'absolute',
    right: 0,
    left: 0,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    backgroundColor: Colors.ui.primary,
    height: 64,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 32,
    backgroundColor: Colors.ui.disabled,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width:52,
    height: 52,
  },
  userInfo: {
    paddingBottom: 12,
  },
  userName: {
    marginTop: 12,
    fontSize: FontSizes.xxLarge,
    ...GlobalStyles.boldText,
  },
  userSchool: {
    fontSize: FontSizes.large,
    marginVertical: 8,
    ...GlobalStyles.text,
  },
  schoolCertificationButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'center',
    marginLeft: 12,
    fontSize: FontSizes.small,
    ...GlobalStyles.text,
  },
  userDetail: {
    flexDirection: 'row',
  },
  schoolCertificationText: {
    fontSize: 12,
    color: '#fff',
    alignContent: 'center',
    marginBottom: 2,
    marginLeft: 3,
    marginRight: 3,
    fontWeight: 'bold',
  },
  separator: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.ui.disabled,
  },
  section: {
    marginVertical: 5,
    borderRadius: 8,
    paddingVertical: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: FontSizes.large,
    ...GlobalStyles.boldText,
  },
  item: {
    paddingVertical: 12,
  },
  itemText: {
    fontSize: FontSizes.medium,
    color: Colors.text.gray,
    ...GlobalStyles.text,
  },
  itemContainer: {
    justifyContent: 'space-between',
    ...GlobalStyles.row,
  },
  arrow: {
    width: 18,
    height: 18,
    tintColor: Colors.text.lightgray,
  },
});

export default MyPageScreen;
