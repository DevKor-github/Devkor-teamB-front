import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Alert } from 'react-native';
import { Post, UserInfo } from '@src/Types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { mockPosts } from '@src/MockData';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker'

import { GlobalStyles } from '@src/GlobalStyles';
import Colors from '@src/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  inputTitle: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    padding: 8,
    lineHeight: 20,
  },
  inputText: {
    minHeight: 200,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.primary[50],
    borderRadius: 5,
  },
  button: {
    width: 320,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 25,
    backgroundColor: Colors.ui.primary,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  attachmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
  },
  attachmentItem: {
    width: 100,
    height: 100,
    margin: 4,
  },
  attachmentPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

type FileAttachment = {
  uri: string;
  name: string;
  type: string;
};

type Attachment = Asset | FileAttachment;

function PostCreationScreen({ route }: { route: any }) {
  const { lectureId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleAttachPhoto = async () => {
    console.log(attachments)
    if (attachments.length >= 3) {
      Alert.alert('이미지는 최대 3장까지 업로드할 수 있습니다.');
      return;
    }
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo', 
        selectionLimit: 3 - attachments.length,
      });

      if (result.assets) {
        const photoAttachments: Attachment[] = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.fileName || '',
          type: asset.type || '',
        }));
        setAttachments([...attachments, ...photoAttachments]);
      }
    } catch (error) {
      console.log('Error picking photo:', error);
    }
  };

  const handleAttachFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const fileAttachments: Attachment[] = result.map((file) => ({
        uri: file.uri,
        name: file.name,
        type: file.type || '',
      }));
      setAttachments([...attachments, ...fileAttachments]);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled file picker');
      } else {
        console.log('Error picking file:', error);
      }
    }
  };

  const handleSubmit = () => {
    const newPost: Post = {
      title,
      content,
      postId: Date.now(),
      postDate: new Date().toISOString(),
      author: new UserInfo('user1111', '게시물 작성자', 'no-image'),
      comments: [],
      view: 0,
      attachments, // Add attachments to the post
    };

    const communities = mockPosts;
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
        style={styles.inputTitle}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.inputText}
        placeholder="내용"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <View style={styles.attachmentContainer}>
        {attachments.map((attachment, index) => (
          <View key={index} style={styles.attachmentItem}>
            {'uri' in attachment ? (
              <Image
                source={{ uri: attachment.uri }}
                style={styles.attachmentPreview}
              />
            ) : (
              <Text>{attachment.fileName}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={{...GlobalStyles.row,gap:10,alignSelf:'flex-end'}}>
        <TouchableOpacity onPress={handleAttachPhoto}>
          <Icon name="image" size={25} color={Colors.primary[500]}></Icon>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAttachFile}>
          <Icon2 name="paperclip" size={25} color={Colors.primary[500]}></Icon2>
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={[styles.buttonText, { ...GlobalStyles.boldText }]}>
          게시물 생성
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default PostCreationScreen;
