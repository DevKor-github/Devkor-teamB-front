import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Alert } from 'react-native';
import { Post, UserInfo } from '@src/Types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { mockPosts, mockTags } from '@src/MockData';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker'
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Attachment, Tag } from '@src/Types';

import { GlobalStyles } from '@src/GlobalStyles';
import Colors from '@src/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/FontAwesome5'
import FloatingButton2 from '@src/components/FloatingButton2';

const API_URL = "http://15.165.198.75:8000"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  inputTitle: {
    marginBottom: 16,
    width: 358,
    backgroundColor: 'white',
    ...GlobalStyles.shadow,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    lineHeight: 20,
  },
  inputText: {
    minHeight: 200,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...GlobalStyles.shadow,
    backgroundColor: 'white',
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
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    marginTop: 16,
  },
  attachmentItem: {
    width: 80,
    height: 80,
    marginHorizontal: 4,
    alignItems:'center',
    position: 'relative',
    ...GlobalStyles.shadow,
    backgroundColor: 'white'
  },
  attachmentPreview: {
    // margin: 5,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
    resizeMode: 'cover',
  },
  documentAttachment: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    ...GlobalStyles.shadow,
  },
  documentName: {
    fontSize: 14,
    color: Colors.primary[700],
  },
  removeButton: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 2,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

// type Attachment = {
//   uri: string;
//   name: string;
//   type: string;
// };


function PostCreationScreen({ route }: { route: any }) {
  const { lectureId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<Attachment[]>([]);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleAttachPhoto = async () => {
    console.log(images)
    if (images.length >= 10) {
      Alert.alert('이미지는 최대 10장까지 업로드할 수 있습니다.');
      return;
    }
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo', 
        selectionLimit: 10 - images.length,
      });

      if (result.assets) {
        const photoAttachment: Attachment[] = result.assets.map((asset) => ({
          uri: asset.uri ?? '',
          name: asset.fileName ?? '',
          type: asset.type ?? '',
        }));
        setImages([...attachments, ...photoAttachment]);
      }
    } catch (error) {
      console.log('Error picking photo:', error);
    }
  };

  const handleRemoveImage = (uri: string) => {
    console.log('pressed')
    setImages(images.filter(image => image.uri !== uri));
  };

  const handleRemoveFile = (uri: string) => {
    console.log('pressed')
    setFiles(files.filter(file => file.uri !== uri));
  };

  const handleRemoveAttachment = (uri: string) => {
    console.log('pressed')
    setAttachments(attachments.filter(attachment => attachment.uri !== uri));
  };

  const handleAttachFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const fileAttachment: Attachment[] = result.map((file) => ({
        uri: file.uri ?? '',
        name: file.name ?? '',
        type: file.type ?? '',
      }));
      setFiles([...files, ...fileAttachment]);
      console.log(files)
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
      images,
      files,
      // attachments, 
      tags: [],
    };
    const communities = mockPosts;

    console.log(newPost)
    if (communities.has(lectureId)) {
      const posts = communities.get(lectureId) as Post[];
      posts.push(newPost);
    } else {
      communities.set(lectureId, [newPost]);
    }
    navigation.goBack();
  };


  const sample = async ()=>{
    const API_URL = "http://15.165.198.75:8000"
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(`${API_URL}/tags/`, 
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      );
      console.log(response)
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  return (
    <ScrollView style={styles.container}>

      <TextInput
        style={styles.inputTitle}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />
      <Text>키워드 선택하기</Text>

      <TextInput
        style={styles.inputText}
        placeholder="내용을 입력하세요."
        value={content}
        onChangeText={setContent}
        multiline
      />


      <View style={{alignSelf: 'flex-start'}}>
        <TouchableOpacity onPress={sample}>
          <Text>#태그입력하기</Text>
        </TouchableOpacity>
      </View>
      <View style={{...GlobalStyles.row,gap:10,alignSelf:'flex-end'}}>
        <TouchableOpacity onPress={handleAttachPhoto}>
          <Icon name="image" size={25} color={Colors.primary[500]}></Icon>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAttachFile}>
          <Icon2 name="paperclip" size={25} color={Colors.primary[500]}></Icon2>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={handleAttachFile}
        style={{backgroundColor: '#F2F2F2',paddingHorizontal: 130,paddingVertical:12,borderRadius:5,display:'flex',flexDirection:'row'}}  
      >
        <Icon name="plus" size={15} color={Colors.primary[500]}></Icon>
        <Text style={{color: Colors.primary[500]}}> 문서 첨부하기</Text>    
      </TouchableOpacity>

      <View>
        {files.map((attachment, index) => (
          <View key={index}>
            {attachment.uri ? (
              <View>
                <Text>{attachment.name}</Text>
                <TouchableOpacity onPress={()=>handleRemoveFile(attachment.uri)}><Text>x</Text></TouchableOpacity>
              </View>
            ): <Text>none</Text>}
          </View>
        ))}
      </View>

      <View style={styles.photoContainer}>
        <TouchableOpacity onPress={handleAttachPhoto} style={[styles.attachmentItem,{backgroundColor: '#F2F2F2',borderRadius: 5,alignItems: 'center',justifyContent:'center'}]}>
          <Icon3 name="camera" size={25} color={Colors.primary[500]}></Icon3>
          <Text style={{fontSize: 10, fontWeight: 400}}>{images.length}/10</Text>
        </TouchableOpacity>
        {images.map((attachment, index) => (
          <View key={index} >
            {attachment.uri ? (
              <View style={styles.attachmentItem}>
                <Image
                  source={{ uri: attachment.uri }}
                  style={styles.attachmentPreview}
                  width={80}
                  height={80}
                />
                <View style={{width:10,height:10,}}>
                  <FloatingButton2 onPress={() => handleRemoveImage(attachment.uri)}>
                    <Icon name="x" size={15} color="white" />
                  </FloatingButton2>
                </View>

              </View>
            ) : (
              <View>
                <Text>{attachment.name}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={[styles.buttonText, { ...GlobalStyles.boldText }]}>
          게시물 생성
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default PostCreationScreen;
