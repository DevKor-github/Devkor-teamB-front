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
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    // ...GlobalStyles.shadow,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'lightgray',
    // backgroundColor: 'white',
    marginVertical:2,
    marginHorizontal:2
  },
  tagPressed: {
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

function PostCreationScreen({ route }: { route: any }) {
  const { lectureId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<Attachment[]>([]);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(()=>{
    console.log('course_fk:',lectureId)
    fetchTags();
  },[])

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
        setImages([...images, ...photoAttachment]);
        console.log(images)
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

  const handleRemoveImage = (uri: string) => {
    console.log('pressed')
    setImages(images.filter(image => image.uri !== uri));
  };

  const handleRemoveFile = (uri: string) => {
    console.log('pressed')
    setFiles(files.filter(file => file.uri !== uri));
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('userToken')
    const userid = await AsyncStorage.getItem('userId')
    const nickname = await AsyncStorage.getItem('userNickname')

    if (!nickname) {
      console.error('Error: nickname is null');
      return;
    }

    try{
      // console.log("pressed !!")
      // console.log(selectedTags)
      // console.log('images:',images)
      // console.log('files:',files)
      const attachments = [...images,...files]
      console.log('attachments:',attachments)

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('course_fk', lectureId); // course_fk 앞에서 받아와야됨 [완료]
      formData.append('student', userid);
      formData.append('tags', selectedTags);
      if (attachments.length > 0) { // 여기 수정 필요
        attachments.forEach((attachment) => {
          formData.append('image_uploads', {
            uri: attachment.uri,
            type: attachment.type, 
            name: attachment.name,  
          });
        });
      }
      // console.log('formdata:',formData._parts)
      
      const response = await axios.post(`${API_URL}/posts/`,formData,
        {
          headers: {
            authorization: `token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('after post:',response.data)
      if(response.status===201){
        navigation.goBack();
      }

    } catch(error) {
      console.error(error)
    }
    
  };


  const fetchTags = async ()=> {
    const API_URL = "http://3.37.163.236:8000/"
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(`${API_URL}/tags/`, 
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      );
      if(response.status===200){
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
  }

  const toggleTagSelection = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.inputTitle}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={{color: Colors.text.black,...GlobalStyles.text,fontSize: 18,fontWeight: 400,marginLeft: 2,marginBottom:10,}}>키워드 선택하기</Text>
      <View style={styles.tagContainer}>
        {tags.map((data)=>(
          <TouchableOpacity
            key={data.id} 
            style={[styles.tag, selectedTags.includes(data.id) && styles.tagPressed]}
            onPress={() => toggleTagSelection(data.id)}
          >
            <Text style={[styles.tagText, selectedTags.includes(data.id) && styles.tagTextPressed]}>{data.name}</Text>
          </TouchableOpacity>
        ))}
      </View>


      <TextInput
        style={styles.inputText}
        placeholder="내용을 입력하세요."
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* 문서 첨부 */}
      <View>
        {files.map((attachment, index) => (
          <View key={index}>
            {attachment.uri ? (
              <View style={{...GlobalStyles.row,marginTop:7,justifyContent: 'space-between',borderBottomColor: '#F2F2F2',borderBottomWidth: 1}}>
                <Text 
                  style={{justifyContent: 'center',alignSelf:'center',color: '#737373',marginVertical: 7}}
                >
                  {attachment.name}
                </Text>
                <TouchableOpacity 
                  onPress={()=>handleRemoveFile(attachment.uri)}
                  style={{width:25,height:20,borderRadius: 10,alignItems:'center',justifyContent: 'center'}}
                >
                  <Text style={{color:'#737373',fontSize:15}}>x</Text>
                </TouchableOpacity>
              </View>
            ): <Text>none</Text>}
          </View>
        ))}
      </View>
      <TouchableOpacity 
        onPress={handleAttachFile}
        style={{backgroundColor: '#F2F2F2',marginTop:10,paddingHorizontal: 130,paddingVertical:12,borderRadius:5,display:'flex',flexDirection:'row'}}  
      >
        <Icon name="plus" size={15} color={Colors.primary[500]}></Icon>
        <Text style={{color: Colors.primary[500]}}> 문서 첨부하기</Text>    
      </TouchableOpacity>
      
      {/* 이미지 첨부 */}
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
          게시물 등록
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default PostCreationScreen;
