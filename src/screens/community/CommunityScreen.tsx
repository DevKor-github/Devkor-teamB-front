import React, {useEffect,useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import {mockCommunities, mockLectures} from '../../MockUserData.tsx';
import {Comment, Community, Post} from './CommunityTypes.tsx';
import {getDateString} from './CommunityUtils.tsx';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import UserInfo from '../../UserTypes.tsx';
import TodayBriefingWidget from './TodayBriefingWidget.tsx';
import FloatingButton from '../../component/FloatingButton.tsx';
import Icon from 'react-native-vector-icons/FontAwesome.js';
import {Color} from '../../component/Color.tsx';
import {Lecture} from '../timetable/TimetableTypes.tsx';
import BottomSheet from '../../component/BottomSheet.tsx'; 


const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    color: '#1A1A1A',
    // textAlign: 'center',
    paddingLeft: 16,
    paddingVertical: 16,
    fontSize: 16,
    lineHeight: 16
  },
  postItem: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F6F2F4',
  },
  postTitle: {
    color: '#1A1A1A',
    fontSize: 17,
    fontWeight: '500',
    padding: 12
  }
})

function PostItem({post}: {post: Post}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 16,
        paddingVertical: 3,
        borderRadius: 8,
        backgroundColor: 'white',
      }}
      onPress={() => navigation.navigate('PostScreen', {post: post})}>
      <View style={styles.postItem}>
        <Text style={styles.postTitle}>Q. {post.title}</Text>
        {/* <View style={{paddingBottom: 4}}>
          <Text numberOfLines={2}>{post.content}</Text>
        </View> */}
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Text style={{fontSize: 12, color: 'gray',paddingHorizontal:12,paddingBottom:11.5}}>
            {getDateString(post.postDate)} | {post.author.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function PostContainer({posts}: {posts: Post[]}) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.postId.toString()} 
      renderItem={({item}: {item: Post}) => <PostItem post={item} />}
    />
  );
}

function PostIsEmpty() {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Text style={{textAlign: 'center'}}>아직 게시물이 없습니다.</Text>
    </View>
  );
}

function CommunityScreen({route, navigation}: {route: any; navigation: any}) {
  const {id} = route.params;
  const communities: Community = mockCommunities;
  const lecture = mockLectures.find(e => e.id === id) as Lecture;

  const modalPadding = 16;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    navigation.setOptions({title: `${lecture.name}`});
  }, [lecture, communities, navigation]);

  return (
    <View style={{backgroundColor:'white'}} onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
      <TodayBriefingWidget lecture={lecture} />
      <BottomSheet minHeight={contentHeight}>
        <Text style={styles.title}>게시글</Text>
        {communities.has(lecture.id) ? (
          <PostContainer posts={communities.get(lecture.id) as Post[]} />
        ) : (
          <PostIsEmpty />
        )}
        <FloatingButton
          onPress={() => {
            // const content = {
            //   title: '게시물 테스트',
            //   view: 0,
            //   author: new UserInfo('user1111', '게시물 작성자', 'no-image'),
            //   comments: [] as Comment[],
            //   postId: 111,
            //   postDate: '2024-05-26 00:05:00',
            //   content: '게시물 생성 테스트',
            // } as Post;

            // if (communities.has(lecture.id)) {
            //   const posts = communities.get(lecture.id) as Post[];
            //   posts.push(content);
            // } else {
            //   communities.set(lecture.id, [content]);
            // }
            navigation.navigate('CreatePostScreen', {lectureId: lecture.id})
          }}>
          <Icon name="plus" size={24} color={Color.ui.onPrimary} />
        </FloatingButton>
      </BottomSheet>
    </View>
  );
}

export default CommunityScreen;
