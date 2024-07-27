import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import {Post} from './CommunityTypes.tsx';
import UserInfo from '../../UserTypes.tsx';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {mockCommunities, mockLectures} from '../../MockUserData.tsx';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    padding: 8,
  },
  button: {
    marginTop: 16,
  },
});

function PostCreationScreen({route}: {route: any}) {
  const {lectureId} = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleSubmit = () => {
    const newPost: Post = {
      title,
      content,
      postId: Date.now(), // Generate a unique ID based on timestamp
      postDate: new Date().toISOString(),
      author: new UserInfo('user1111', '게시물 작성자', 'no-image'),
      comments: [],
      view: 0,
    };

    const communities = mockCommunities;
    if (communities.has(lectureId)) {
      const posts = communities.get(lectureId) as Post[];
      posts.push(newPost);
    } else {
      communities.set(lectureId, [newPost]);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="내용"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="게시물 생성" onPress={handleSubmit} />
    </View>
  );
}

export default PostCreationScreen;