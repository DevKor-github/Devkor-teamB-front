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

const API_URL = "http://3.37.163.236:8000/"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  tagContainer: {
    ...GlobalStyles.row,
    flexWrap : 'wrap',
    marginBottom: 10,
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
  tag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    // ...GlobalStyles.shadow,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'lightgray',
    // backgroundColor: 'white',
    margin: 2
  },
  tagPressed: {
    // paddingVertical: 3,
    // paddingHorizontal: 8,
    // ...GlobalStyles.shadow,
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderRadius: 12,
    backgroundColor: 'pink',
    margin: 2
  },
  tagText: {
    color: "#A0A0A0",
    fontWeight: 300,
    fontSize: 12,
    ...GlobalStyles.text
  },
  tagTextPressed: {
    color: "black",
    fontWeight: 300,
    fontSize: 12,
    ...GlobalStyles.text
  }
});


function PostEditScreen({ route }: { route: any }) {
    const { post } = route.params; // 넘어온 post 데이터
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<Attachment[]>([]);
    const [deletedImages, setDeletedImages] = useState<number[]>([]);
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
  
    useEffect(() => {
      // console.log(post)
      fetchTags();
      setTitle(post.title); 
      setContent(post.content); 
      setImages(post.attachments); 
      setSelectedTags(post.tags.map((tag:Tag) => tag.id)); 
    }, []);
  
    // Fetch tags
    const fetchTags = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/tags/`, {
          headers: {
            authorization: `token ${token}`,
          },
        });
        if (response.status === 200) {
          const fetchedTags: Tag[] = response.data
            .filter((data: any) => data.id > 2)
            .map((data: any) => ({
              id: data.id,
              name: data.name,
            }));
          setTags(fetchedTags);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
  
    // Handle image removal
    const handleRemoveImage = (attachment: Attachment) => {
      console.log('removing : ',attachment)

      setImages((prevImages) => {
        const updatedImages = prevImages.filter((image) => image.uri !== attachment.uri);
        return updatedImages;
      });

      setDeletedImages((prevDeletedImages) => {
        const indexToRemove = images.findIndex((image) => image.uri === attachment.uri);
        if (indexToRemove !== -1) {
          const updatedDeletedImages = [...prevDeletedImages, indexToRemove];
          console.log(updatedDeletedImages)
          return updatedDeletedImages;
        }
        return prevDeletedImages; 
      });
    };
  
    // Handle form submission
    const handleSubmit = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const userid = await AsyncStorage.getItem('userId');
  
      if (!userid) {
        console.error('Error: userid is null');
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('course_fk', post.postId); 
        formData.append('student', post.postId);
        formData.append('tags', selectedTags);
        // formData.append('id', post.postId);
        formData.append('delete_image_ids',deletedImages);
        console.log(formData._parts)
        const response = await axios.patch(`${API_URL}/posts/${post.postId}/`, formData,
          { 
            headers: { 
              authorization: `token ${token}`,
            }
          },
        );
        console.log(response.data)
      } catch (error) {
        console.error(error);
      }
      navigation.goBack();
    };
  
    // Toggle tag selection
    const toggleTagSelection = (tagId: number) => {
      if (selectedTags.includes(tagId)) {
        setSelectedTags(selectedTags.filter((id) => id !== tagId));
      } else {
        setSelectedTags([...selectedTags, tagId]);
      }
    };
  
    return (
      <ScrollView style={styles.container}>
        <Text style={{ color: Colors.text.black, ...GlobalStyles.text, fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
          키워드 선택하기
        </Text>
        <View style={styles.tagContainer}>
          {tags.map((data) => (
            <TouchableOpacity
              key={data.id}
              style={[styles.tag, selectedTags.includes(data.id) && styles.tagPressed]}
              onPress={() => toggleTagSelection(data.id)}
            >
              <Text style={[styles.tagText, selectedTags.includes(data.id) && styles.tagTextPressed]}>{data.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
  
  
        <Text style={{ color: Colors.text.black, ...GlobalStyles.text, fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
          게시글 작성하기
        </Text>
        <TextInput
          style={styles.inputTitle}
          placeholder="제목"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.inputText}
          placeholder="내용을 입력하세요."
          value={content}
          onChangeText={setContent}
          multiline
        />
  
        {/* 문서 첨부 관련인데 일단은 주석처리.. */}
        {/* <TouchableOpacity onPress={handleAttachFile} style={{ backgroundColor: '#F2F2F2', marginTop: 10, paddingHorizontal: 130, paddingVertical: 12, borderRadius: 5, display: 'flex', flexDirection: 'row' }}>
          <Icon name="plus" size={15} color={Colors.primary[500]} />
          <Text style={{ color: Colors.primary[500] }}> 문서 첨부하기</Text>
        </TouchableOpacity> */}


        <View style={styles.photoContainer}>
          {images.map((attachment, index) => (
            <View key={index}>
              {attachment.uri ? (
                <View style={styles.attachmentItem}>
                  {attachment.uri.startsWith('/media') ? (
                    <Image
                      source={{ uri: `${API_URL}/${attachment.uri}` }}
                      style={styles.attachmentPreview}
                      width={80}
                      height={80}
                    /> 
                  ) : (
                    <Image
                    source={{ uri: attachment.uri }}
                    style={styles.attachmentPreview}
                    width={80}
                    height={80}
                  />
                  )
                  }
                  <View style={{ width: 10, height: 10 }}>
                    <FloatingButton2 onPress={() => handleRemoveImage(attachment)}>
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
            게시물 수정
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  
  export default PostEditScreen;
  