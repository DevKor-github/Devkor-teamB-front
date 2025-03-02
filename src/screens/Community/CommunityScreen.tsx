import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Post, CourseBlock } from '@src/Types';
import DailyBriefingWidget from '@screens/Community/DailyBriefingWidget';
import { FontSizes, GlobalStyles } from '@src/GlobalStyles';
import Colors from '@src/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingButton from '@src/components/FloatingButton';
import * as Animatable from 'react-native-animatable';
import { setNavigationHeader } from '@src/navigator/TimetableNavigator';
import { fetchPost } from '../Post/PostAPI';

interface CommunityScreenProps {
  route: any;
  navigation: any;
}

const PostItem = ({ post, lectureName }: { post: any; lectureName: string }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleNavigate = () => {
    navigation.navigate('PostScreen', {
      post: post,
      lecture: lectureName,
    });
  };

  return (
    <TouchableOpacity style={postStyles.postItem} onPress={handleNavigate}>
      <View
        style={{
          ...GlobalStyles.row,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={postStyles.postText}>{post.title}</Text>
        <Text
          style={{
            color: '#666',
            fontSize: 12,
            marginTop: 3,
            justifyContent: 'center',
          }}>
          {post.created_at.substring(0, 10)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const PostView = ({
  items,
  lectureId,
  lectureName,
  course,
}: {
  items: Post[];
  lectureId: number;
  lectureName: string;
  course: CourseBlock;
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isFabOpen, setFabOpen] = useState(false);

  const handlePressMore = () => {
    navigation.navigate('PostListScreen', {
      lectureName: lectureName,
      id: lectureId,
      items: items,
    });
  };

  const handlePressPlus = () => {
    setFabOpen(!isFabOpen);
  };

  const handleNavigate = (screen: string) => {
    setFabOpen(false);
    if (screen == 'BriefingScreen') {
      navigation.navigate(screen, { course: course });
    }
    navigation.navigate(screen, {
      lectureId: lectureId,
      lectureName: lectureName,
    });
  };

  return (
    <View style={postStyles.container}>
      <View style={headerStyle.container}>
        <Text style={headerStyle.title}>{lectureName} 게시글 미리보기</Text>
        <TouchableOpacity
          style={{ marginVertical: 'auto' }}
          onPress={handlePressMore}>
          <View style={GlobalStyles.row}>
            <Text style={headerStyle.more}>자세히 보기</Text>
            <Image
              style={headerStyle.arrow}
              source={require('@assets/icons/arrow_right.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
      {items.length === 0 ? (
        <View style={postStyles.postEmpty}>
          <Text style={postStyles.postEmptyText}>아직 게시물이 없습니다</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={({ item }: { item: any }) => (
            <PostItem post={item} lectureName={lectureName} />
          )}
        />
      )}
      <FloatingButton onPress={handlePressPlus}>
        <Icon name="plus" size={24} color={Colors.ui.background} />
      </FloatingButton>

      <Modal
        visible={isFabOpen}
        transparent={true}
        onRequestClose={handlePressPlus}>
        <TouchableOpacity
          onPressOut={() => setFabOpen(false)}
          activeOpacity={1}
          style={styles.overlay}>
          <Animatable.View duration={500} style={{ width: 70 }}>
            <TouchableOpacity
              onPress={() => handleNavigate('PostCreationScreen')}>
              <Image
                source={require('@assets/icons/create_file.png')}
                style={styles.fabIcon}
              />
              <Text style={styles.fabText}>게시글 작성</Text>
            </TouchableOpacity>
          </Animatable.View>
          {/* <Animatable.View duration={500} style={{width: 70}}>
            <TouchableOpacity onPress={() => handleNavigate('BriefingScreen')}>
              <Image
                source={require('@assets/icons/faq.png')}
                style={styles.fabIcon}
              />
              <Text style={styles.fabText}>브리핑 답변</Text>
            </TouchableOpacity>
          </Animatable.View> */}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const CommunityScreen: React.FC<CommunityScreenProps> = ({
  route,
  navigation,
}) => {
  const { course, day }: { course: CourseBlock; day: string } = route.params;
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPosts = await fetchPost(course.id);
      if (fetchedPosts) setPosts(fetchedPosts);
    };

    fetchData();
  }, [course.id]);

  useLayoutEffect(
    () =>
      setNavigationHeader(navigation, [course.course_name, course.instructor]),
    [course, navigation],
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <StatusBar backgroundColor={Colors.ui.background} />
      <DailyBriefingWidget course={course} day={day} />
      <PostView
        items={posts}
        lectureId={course.id}
        lectureName={course.course_name}
        course={course}
      />
    </SafeAreaView>
  );
};

const headerStyle = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    ...GlobalStyles.row,
    margin: 10,
  },
  title: {
    textAlign: 'center',
    color: Colors.text.black,
    fontSize: FontSizes.large,
    padding: 4,
    ...GlobalStyles.boldText,
  },
  more: {
    color: Colors.text.lightgray,
    textAlign: 'center',
    fontSize: FontSizes.medium,
    ...GlobalStyles.text,
  },
  arrow: { width: 16, height: 16, tintColor: Colors.text.lightgray },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F5F7',
    padding: 12,
    ...GlobalStyles.expand,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    ...GlobalStyles.row,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    paddingTop: 600,
    gap: 80,
  },
  fabOption: {
    position: 'absolute',
    backgroundColor: 'pink',
    right: 20,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    ...GlobalStyles.shadow,
    backgroundColor: 'gray',
  },
  fabText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
    color: Colors.text.white,
    alignSelf: 'center',
    ...GlobalStyles.text,
  },
});

const postStyles = StyleSheet.create({
  container: {
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.expand,
    ...GlobalStyles.shadow,
  },
  title: {
    margin: 12,
    fontSize: FontSizes.xLarge,
    ...GlobalStyles.boldText,
  },
  postEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    ...GlobalStyles.expand,
  },
  postEmptyText: {
    fontSize: FontSizes.medium,
    ...GlobalStyles.text,
  },
  postItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F6F2F4',
  },
  postText: {
    color: Colors.text.black,
    fontSize: FontSizes.medium,
    fontWeight: '400',
  },
});

export default CommunityScreen;
