import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import {Comment, Post} from './CommunityTypes.tsx';
import {Color} from '../../Color.tsx';
import Icon from 'react-native-vector-icons/Fontisto.js';

const style = StyleSheet.create({
  textfield: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '95%',
    alignSelf: 'center',
    margin: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {width: 0, height: 1},
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

function CommentTextField() {
  const [text, setText] = useState('');
  const placeholder = '첫 댓글 작성 시 포인트 3배 적립';

  return (
    <View style={style.textfield}>
      <TextInput
        style={{flex: 1}}
        onChangeText={e => setText(e)}
        value={text}
        placeholder={placeholder}
      />
      <TouchableOpacity>
        <Icon name="bell" size={18} color={Color.ui.primary} />
      </TouchableOpacity>
    </View>
  );
}
function CommentContainer({comment}: {comment: Comment}) {
  return (
    <View>
      <Text>{comment.userId}</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: Color.ui.primary,
          borderRadius: 12,
          padding: 8,
        }}>
        <Text>{comment.content}</Text>
      </View>
    </View>
  );
}

function PostScreen({route, navigation}: {route: any; navigation: any}) {
  const post: Post = route.params.post;

  return (
    <SafeAreaView style={{flex: 1}}>
      <>
        <ScrollView
          style={{
            padding: 8,
            marginHorizontal: 8,
          }}>
          <View>
            <Text>{post.author.name}</Text>
          </View>
          <View
            style={{
              borderColor: Color.ui.primary,
              backgroundColor: Color.ui.background,
              borderWidth: 2,
              padding: 8,
              borderRadius: 8,
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{post.title}</Text>
            <Text>{post.content}</Text>
          </View>
          {post.comments.map(comment => (
            <View style={{marginTop: 12}}>
              <CommentContainer comment={comment} />
            </View>
          ))}
        </ScrollView>
        <CommentTextField />
      </>
    </SafeAreaView>
  );
}

export default PostScreen;
