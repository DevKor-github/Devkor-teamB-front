import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '@src/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import {
  consumePoints,
  earnPoints,
  PermissionType,
  RewardType,
} from './Store/StoreHandler';
import {
  fetchAllCourses,
  fetchStudentImage,
  fetchTimetables,
  fetchUserInfo,
} from '@src/data/studentApi';
import {API_URL} from '@env';
import {removeAccess} from '@src/data/authStorage';

const MY_INFO_ITEMS = {
  // '아이디 변경하기': 'changeId',
  '비밀번호 변경하기': 'changePassword',
  '시간표 수정하기': 'editTimetable',
  로그아웃: 'logout',
  // '탈퇴하기': 'withdraw',
};

const MY_POST_ITEMS = [
  '내가 쓴 게시물',
  '내가 쓴 댓글',
  // '내가 스크랩한 글',
];

const handleItemPress = ({
  key,
  navigation,
  callback,
}: {
  key: string;
  navigation: any;
  callback: (argv: boolean) => void;
}) => {
  switch (key) {
    case 'editTimetable':
      try {
        callback(true);
        const fetchData = async () => {
          const courses = await fetchAllCourses();
          const timetable = await fetchTimetables()!;
          navigation.navigate('Register', {
            courses: courses,
            timetable: timetable,
          });
        };
        fetchData();
        callback(false);
      } catch (e) {
        console.error('[RegisterInfoScreen]', e);
      }
      break;
    case 'logout':
      Alert.alert('로그아웃하겠습니까?', '', [
        {text: '취소'},
        {
          text: '확인',
          style: 'destructive',
          onPress: async () => {
            await removeAccess();
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
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
  const [isLoading, setIsLoading] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const getImage = async () => {
      const {data} = await fetchUserInfo();
      const nickname = data.nickname;
      const image = await fetchStudentImage(nickname.replace(/[0-9]/g, ''));
      setUserNickname(nickname);
      setUserImage(`${API_URL}${image}`);
    };
    getImage();
  }, [userImage, userNickname]);

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
              source={{uri: userImage}}
              defaultSource={require('@assets/images/UserImage.png')}
              style={styles.avatar}
            />
          </View>
          <View style={GlobalStyles.row}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userNickname}</Text>
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
                onPress={() =>
                  handleItemPress({
                    key,
                    navigation,
                    callback: setIsLoading,
                  })
                }>
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
          {/* 포인트 관련. 삭제할 예정 */}
          <HowToUsePoint />
          <HowToGetPoint />
        </View>
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.ui.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

// 포인트 적립 기능
const HowToUsePoint = () => {
  return (
    <TouchableOpacity
      onPress={async () => {
        await earnPoints(RewardType.CHOSEN);
      }}
      style={tempStyle.pointInfoContainer}>
      <Text>포인트 적립 방법</Text>
    </TouchableOpacity>
  );
};

// 포인트 사용 기능
const HowToGetPoint = () => {
  return (
    <TouchableOpacity
      onPress={async () => {
        await consumePoints(PermissionType.DAY);
      }}
      style={tempStyle.pointInfoContainer}>
      <Text>포인트 사용 방법</Text>
    </TouchableOpacity>
  );
};

const tempStyle = StyleSheet.create({
  pointInfoContainer: {
    backgroundColor: 'pink',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
});

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    width: 80,
    height: 80,
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
