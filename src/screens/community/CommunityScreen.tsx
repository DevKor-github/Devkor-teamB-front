import React, {useEffect} from 'react';
import {View, Text, FlatList, Modal, TouchableOpacity} from 'react-native';
import {mockCommunities, mockLectures} from '../../MockUserData.tsx';
import {Comment, Community, Post} from './CommunityTypes.tsx';
import {getDateString} from './CommunityUtils.tsx';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Lecture} from '../timetable/TimetableTypes.tsx';
import UserInfo from '../../UserTypes.tsx';

function PostItem({post}: {post: Post}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <TouchableOpacity
      style={{
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: 'white',
      }}
      onPress={() => navigation.navigate('PostScreen', {post: post})}>
      <View>
        <Text style={{fontWeight: 'bold'}}>{post.title}</Text>
        <View style={{paddingBottom: 4}}>
          <Text numberOfLines={2}>{post.content}</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Text style={{fontSize: 12, color: 'gray'}}>
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
      style={{padding: 8}}
      data={posts}
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

function FloatingButton({onPress}: {onPress: Function}) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
      }}>
      <TouchableOpacity
        style={{
          width: 48,
          height: 48,
          margin: 12,
          borderRadius: 24,
          justifyContent: 'center',
          backgroundColor: 'lightgray',
        }}
        onPress={() => onPress()}>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
          }}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function CommunityScreen({route, navigation}: {route: any; navigation: any}) {
  const {lecture} = route.params;
  const communities: Community = mockCommunities;

  useEffect(() => {
    navigation.setOptions({title: `${lecture.name} 게시판`});
  }, [lecture, communities, navigation]);

  return (
    <View style={{flex: 1}}>
      {communities.has(lecture.id) ? (
        <PostContainer posts={communities.get(lecture.id) as Post[]} />
      ) : (
        <PostIsEmpty />
      )}
      <FloatingButton
        onPress={() => {
          (communities.get(lecture.id) as Post[]).push({
            title: '게시물 테스트',
            view: 0,
            author: new UserInfo('user1111', '게시물 작성자', 'no-image'),
            comments: [] as Comment[],
            postId: 111,
            postDate: '2024-05-26 00:05:00',
            content: '게시물을 생성해 보았습니다.',
          } as Post);
        }}
      />
    </View>
  );
}

export default CommunityScreen;
