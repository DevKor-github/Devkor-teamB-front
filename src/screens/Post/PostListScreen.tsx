import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Lecture, Post, UserInfo} from '@src/Types';
import DailyBriefingWidget from '@screens/Community/DailyBriefingWidget';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import Colors from '@src/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import FloatingButton from '@src/components/FloatingButton';
import Icon from 'react-native-vector-icons/Octicons';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import {fetchPostInfo} from './PostAPI';

interface CommunityScreenProps {
  route: any;
  navigation: any;
}

export const PostItem = ({
  post,
  lectureName,
}: {
  post: any;
  lectureName: string;
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [fetchedPost, setFetchedPost] = useState<Post>();
  const [commentNum, setCommentNum] = useState(Number);

  useEffect(() => {
    const getPostInfo = async () => {
      const postData = await fetchPostInfo(post.id);
      if (postData) {
        setFetchedPost(postData);
      }
    };

    getPostInfo();
    getCommentNum(post.id);
  }, [post.id]);

  const getCommentNum = async (postId: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/comments/`, {
        params: {
          post_id: postId,
        },
        headers: {
          authorization: `token ${token}`,
        },
      });
      const commentIds = response.data.map((comment: any) => comment.id);
      setCommentNum(commentIds.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleNavigate = () => {
    navigation.navigate('PostScreen', {
      post: fetchedPost,
      lecture: lectureName,
    });
  };

  return (
    <TouchableOpacity style={postStyles.postItem} onPress={handleNavigate}>
      <View style={{...GlobalStyles.row, justifyContent: 'space-between'}}>
        <View>
          <Text style={postStyles.postText}>{post.title}</Text>
          <View
            style={{
              ...GlobalStyles.row,
              gap: 5,
              flexWrap: 'wrap',
              maxWidth: 280,
            }}>
            {fetchedPost &&
              fetchedPost.tags.map(tag => (
                <View
                  key={tag.id}
                  style={{
                    backgroundColor: '#E8E8E8',
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}>
                  <Text style={{...GlobalStyles.text, fontSize: 12}}>
                    {tag.name}
                  </Text>
                </View>
              ))}
          </View>
          <Text style={{color: Colors.text.lightgray, marginTop: 7}}>
            {fetchedPost && fetchedPost.postDate.substring(0, 10)} | 조회{' '}
            {fetchedPost && fetchedPost.views} 댓글 {commentNum} 좋아요{' '}
            {fetchedPost?.likes}
          </Text>
        </View>
        {/* 이미지 preview */}
        {fetchedPost &&
          fetchedPost.attachments &&
          fetchedPost.attachments.length > 0 && (
            <Image
              key={fetchedPost.id}
              source={{uri: `${API_URL}/${fetchedPost.attachments[0].uri}`}}
              style={{
                width: 65,
                height: 65,
                borderRadius: 5,
                alignSelf: 'center',
              }}
            />
          )}
      </View>
    </TouchableOpacity>
  );
};

const PostView = ({
  items,
  lectureName,
}: {
  items: Post[];
  lectureName: string;
}) => {
  const [query, setQuery] = useState('');

  return (
    <View>
      <StatusBar backgroundColor={Colors.ui.background} />
      <View style={styles.searchContainer}>
        <Icon name="search" size={15} color="#BAABB2"></Icon>
        <TextInput
          style={styles.textInput}
          onChangeText={setQuery}
          value={query}
          placeholder="키워드 및 검색어를 입력해주세요"
        />
      </View>
      <View style={postStyles.container}>
        {items === undefined ? (
          <View style={postStyles.postEmpty}>
            <Text style={postStyles.postEmptyText}>아직 게시물이 없습니다</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={({item}: {item: Post}) => (
              <PostItem key={item.id} post={item} lectureName={lectureName} />
            )}
          />
        )}
      </View>
    </View>
  );
};

const PostListScreen: React.FC<CommunityScreenProps> = ({
  route,
  navigation,
}) => {
  const postId = route.params.id;
  const posts = route.params.items;
  const lectureName = route.params.lectureName;

  useEffect(() => {
    navigation.setOptions({title: `${route.params.lectureName}`});
  }, [lectureName, navigation]);

  useEffect(() => {
    console.log('PostListScreen');
  }, [route.params.lectureName]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PostView items={posts} lectureName={lectureName} />
      <FloatingButton
        onPress={() => {
          navigation.navigate('PostCreationScreen', {lectureId: postId});
        }}>
        <Icon name="plus" size={24} color={Colors.ui.background} />
      </FloatingButton>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F5F7',
    padding: 12,
    ...GlobalStyles.expand,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBE4E7',
    paddingHorizontal: 12,
    width: '100%',
    height: 36,
    borderRadius: 16,
  },
  textInput: {
    // flex: 1,
    height: 40,
    margin: 5,
  },
});

export const postStyles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingBottom: 60,
    borderRadius: 10,
    minHeight: 680,
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
    // marginHorizontal: 12,
    marginVertical: 4,
    padding: 12,
    borderRadius: 5,
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.shadow,
  },
  postText: {
    color: Colors.text.black,
    fontSize: FontSizes.large,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default PostListScreen;
