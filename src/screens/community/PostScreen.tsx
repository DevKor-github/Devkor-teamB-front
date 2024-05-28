import React from 'react';
import {
  ScrollView,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Comment, Post} from './CommunityTypes.tsx';

function CommentContainer({comment}: {comment: Comment}) {
  return (
    <View
      style={{
        backgroundColor: 'darkgray',
        padding: 12,
        borderRadius: 12,
      }}>
      <Text>{comment.userId}</Text>
      <Text>{comment.content}</Text>
    </View>
  );
}

function CloseButton({onPress}: {onPress: Function}) {
  return (
    <TouchableOpacity
      style={{
        width: 28,
        height: 28,
        justifyContent: 'center',
      }}
      onPress={() => onPress()}>
      <Text style={{fontSize: 14, textAlign: 'center'}}>X</Text>
    </TouchableOpacity>
  );
}

function PostScreen({route, navigation}: {route: any; navigation: any}) {
  const post: Post = route.params.post;
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{
        padding: 12,
        marginHorizontal: 12,
        backgroundColor: 'lightgray'}}>
        <CloseButton onPress={() => navigation.goBack()} />
        <View
          style={{
            backgroundColor: 'lightgray',
            padding: 12,
            borderRadius: 12,
          }}>
          <Text>{post.title}</Text>
          <Text>{post.content}</Text>
        </View>
        {post.comments.map(comment => (
          <View style={{marginTop: 12,}}>
            <CommentContainer comment={comment} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default PostScreen;
