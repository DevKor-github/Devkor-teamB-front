import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  Alert,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import {Comment, Post, Attachment, Tag} from '@src/Types';
import Colors from '@src/Colors';
import Icon from 'react-native-vector-icons/Feather.js';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { style, styles } from './PostScreen';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  consumePoints,
  earnPoints,
  givePoints,
  PermissionType,
  RewardType,
} from '../Store/StoreHandler';
import { fetchStudentImage } from '@src/data/studentApi';
import { deleteComment, fetchComments } from './PostAPI';


export function CommentTextField(
  { addComment, postId , studentId} : 
  { addComment: (comment: Comment) => void, postId: number, studentId: number}) 
{
    const [text, setText] = useState('');
    const [inputHeight, setInputHeight] = useState(20);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const placeholder = '첫 댓글 작성 시 포인트 3배 적립';

    const handleAddComment = async () => {
      const commentData = {
        content: text,
        is_chosen: false,
        post: postId, 
        student: studentId,
      }
      
      if(text.trim().length>0){
        try{
          const token = await AsyncStorage.getItem('userToken')
          const nickname = await AsyncStorage.getItem('userNickname')
          
          // 예외처리
          if (!token || !nickname) {
            console.error('Error: token or userId is null');
            return;
          }
          const response = await axios.post(`${API_URL}/comments/`,commentData,
            {
              headers: {
                authorization: `token ${token}`,
              },
            },
          );
          console.log('response:', response.data)
          const newComment: Comment = {
            commentId: response.data.id,
            author: nickname,
            content: response.data.content,
            date: response.data.created_at,
            updatedDate: response.data.updated_at,
            isChosen: response.data.is_chosen,
            postId: response.data.post,
            authorId: response.data.student,
          }
          addComment(newComment);
          setText('');
          setInputHeight(20);
          setAttachments([]);
        } catch (error) {
          console.error(error)
        }
      }
      await earnPoints(RewardType.ANSWER);
    }

  
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.inner}>
            <View style={[styles.textfield,{height:inputHeight+25}]}>
              <TextInput
                style={{flex: 1,paddingHorizontal:10,color:'#000',height:inputHeight}}
                onChangeText={setText}
                onContentSizeChange={(e)=>setInputHeight(e.nativeEvent.contentSize.height)}
                value={text}
                placeholder={placeholder}
                multiline
              />
              <View>
                <TouchableOpacity onPress={handleAddComment}>
                  <Icon name="send" size={18} color={Colors.ui.primary} />
                </TouchableOpacity>
              </View>
            </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  
export function CommentContainer(
  {comment, currPoint, commentAvailable, userId, isMyPost, notChosen, onChoose}: 
  {comment: Comment, currPoint: number, commentAvailable:boolean, userId: number, isMyPost: boolean, notChosen: boolean, onChoose: (commentId: number, isChosen: boolean)=>void}) 
{
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBlurVisible, setIsBlurVisible] = useState(!commentAvailable);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const moreButtonRef = useRef<TouchableOpacity>(null);
    const [point, setPoint] = useState(currPoint); // 샘플
    const date = new Date(comment.date)
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [userImage, setUserImage] = useState('');

    const [isMyComment, setIsMyComment]= useState(Boolean);
    const [isChosen, setIsChosen] = useState(comment.isChosen);

    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const hours = String(date.getHours()).padStart(2, '0'); 
    const minutes = String(date.getMinutes()).padStart(2, '0'); 
  
    useEffect(()=>{
      const getImage = async () => {
        const image = await fetchStudentImage(comment.author);
        setUserImage(`${API_URL}${image}`);
      }
      getImage()
    },[])

    useEffect(()=>{
      if(userId==comment.authorId) setIsMyComment(true);
    },[userId])

    useEffect(()=>{
      console.log('isChosen:',isChosen)
      console.log('notChosen:',notChosen)
    },[isMyComment, isMyPost, isChosen, setIsChosen, notChosen])


    const onPressModalClose = () => {
      setIsModalVisible(false);
    };
  
    const toggleMenu = () => {
      setIsModalVisible(!isModalVisible);
    };
  
    const onPressMore = () => {
      if(moreButtonRef.current){
          moreButtonRef.current.measure((fx:any, fy:any, width:any, height:any, px:any, py:any) => {
            setMenuPosition({ top: py + height, left: px - 178 + width });
            toggleMenu();
          });
      }
  
    }

    const handleDelete =  async () => {
      Alert.alert('댓글을 삭제하시겠습니까?','',[
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '삭제하기',
          style: 'destructive',
          onPress: async () => {
            await deleteComment(comment.commentId)
            setIsModalVisible(false)
          }
        }
      ])
    }
  
    const toggleBlur = (point:number) => {
      Alert.alert('포인트를 사용하시겠습니까?',`현재 보유 포인트: ${point}`,[
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '사용하기',
          style: 'default',
          onPress: () => { // 상점 페이지로 이동
            setIsBlurVisible(false);
            navigation.navigate('StoreNavigator',
              { screen: "StoreScreen" }
            ); 
          }
        }
      ])
    };

    const handleChoose = async () => {
      if(isChosen) return;
      onChoose(comment.commentId, isChosen)
      await givePoints(RewardType.CHOSEN, comment.authorId)

      // Alert.alert('해당 댓글을 채택하시겠습니까?','채택은 취소할 수 없습니다',[
      //   {
      //     text: '취소',
      //     style: 'cancel'
      //   },
      //   {
      //     text: '확인',
      //     style: 'default',
      //     onPress: async () => {
      //       console.log('userid:', userId)
      //       console.log('comment author id:', comment.authorId)
      //       const token = await AsyncStorage.getItem('userToken');
      //       try{
      //         const formData = new FormData();
      //         formData.append('is_chosen', !(isChosen));
      //         const response = await axios.patch(`${API_URL}/comments/${comment.commentId}/`, formData,
      //           { 
      //             headers: { 
      //               authorization: `token ${token}`,
      //             }
      //           },
      //         );
      //         console.log(response.data)
      //         await givePoints(RewardType.CHOSEN, comment.authorId)
      //       } catch(e){
      //         console.error(e)
      //       }
      //     }
      //   }
      // ])
    }
  
    return (
      <View>
        <View style={style.userArea}>
          <Image
            source={
              userImage
                ? {uri: userImage}
                : require('@assets/images/UserImage.png')
            }
            style={{width: 38, height: 36, borderRadius: 25}}
          />
  
          <View style={style.userArea2_comment}>
            <Text style={{color: '#3D3D3D', fontSize: 14, fontWeight: '500'}}>{comment.author}</Text>
            <View style={style.userArea3_comment}>
              <Text style={{color: '#3D3D3D', fontSize: 12, fontWeight: '300'}}>{comment.date.substring(0,10)}</Text>
              {/* <Text style={{color: '#3D3D3D', fontSize: 12, fontWeight: '300'}}>{month}/{day}</Text> */}
              <Text style={{color: '#3D3D3D', fontSize: 12, fontWeight: '300'}}>{hours}:{minutes}</Text>
            </View>
          </View>
  
          <View style={{flex:1, alignItems:'center', flexDirection:'row', alignSelf: 'stretch', justifyContent:'flex-end'}}>
            {isMyPost && !(isMyComment) && notChosen && (
              <TouchableOpacity style={[style.button]} onPress={handleChoose}>
                <Icon name="smile" size={14} color="#8012F1" />
                <Text 
                  style={{
                    color: '#8012F1', 
                    fontSize: 12, 
                    fontWeight: '500'
                  }}>
                  채택
                </Text>
              </TouchableOpacity>
            )}
            {!(notChosen) && isChosen &&  (
              <TouchableOpacity style={[style.button]} onPress={handleChoose}>
                <Icon name="smile" size={14} color="#8012F1" />
                <Text 
                  style={{
                    color: '#8012F1', 
                    fontSize: 12, 
                    fontWeight: '900'
                  }}>
                    채택됨
                </Text>
              </TouchableOpacity>
            )}
            {isMyComment && (
              <TouchableOpacity style={{marginLeft:10}} ref={moreButtonRef} onPress={onPressMore}>
                <Icon name="more-vertical" size={24} color="#3D3D3D" />
              </TouchableOpacity>
            )}
          </View>

        </View>
  
        <View style={{marginTop: 10}}>
          <Modal
            visible={isModalVisible}
            transparent={true}
            onRequestClose={toggleMenu}>
            <TouchableOpacity
              onPressOut={onPressModalClose}
              activeOpacity={1}
              style={style.overlay}
            >
              <View style={[style.menu_comment,menuPosition]}>
                <TouchableOpacity style={style.menuItem} onPress={handleDelete}>
                  <Text style={{color:Colors.primary[500]}}>삭제하기</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
  
        <View style={style.commentArea}>
  
          <Text style={style.comment}>
            {comment.content}
          </Text>
          {/* {comment.attachments.map((attachment: Attachment, index: number) => (
            <Image
              key={index}
              source={{ uri: attachment.uri }}
              style={{ width: 82, height: 82, borderRadius: 9 }}
            />
          ))} */}
  
          {isBlurVisible && (
            <View style={style.commentArea_Blur}>
              <Text style={style.text_Blur}>포인트 사용하고 댓글 보기</Text>
              <TouchableOpacity onPress={()=>toggleBlur(point)} style={style.button_Blur}>
                <Text style={style.buttonText_Blur}>사용하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
  
        <View style={style.buttonArea}>
          {/* <TouchableOpacity style={style.button}>
            <Icon2 name="thumb-up" size={14} color="#ff1485" />
            <Text
              style={{
                color: '#4D4D4D',
                fontSize: 12,
                fontWeight: '500',
                marginLeft: 5,
              }}>
              19
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.button}>
            <Icon2 name="comment" size={14} color="#ff1485" />
            <Text
              style={{
                color: '#4D4D4D',
                fontSize: 12,
                fontWeight: '500',
                marginLeft: 5,
              }}>
              12
            </Text>
          </TouchableOpacity> */}

        </View>
      </View>
    );
  }
