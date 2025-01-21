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
import {Comment, Post, Attachment, Tag, UserInfo} from '@src/Types';
import Colors from '@src/Colors';
import Icon from 'react-native-vector-icons/Feather.js';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons.js';
import Icon3 from 'react-native-vector-icons/AntDesign.js';
import { GlobalStyles } from '@src/GlobalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {setNavigationHeader} from '@src/navigator/TimetableNavigator';
import { CommentTextField, CommentContainer } from './Comment';

// import APIs
import {API_URL} from '@env';
import { fetchComments } from './PostAPI';
import { fetchGetPointHistory } from '@src/data/storeApi';
import { fetchUserInfo } from '@src/data/studentApi';



interface PostScreenProps {
  route: any;
  navigation: any;
}

const PostScreen: React.FC<PostScreenProps> = ({route,navigation,}) => {
  const post: Post = route.params.post;
  const lectureName: string = route.params.lecture;
  const author: UserInfo = new UserInfo(
    post.author.id,
    post.author.name,
    post.author.profile,
  );
  const [postState, setPostState] = useState(post);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLikeModalVisible, setIsLikeModalVisible] = useState(false);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentAvailable, setCommentAvailable] = useState<boolean>(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const [images, setImages] = useState<Attachment[]>([]);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [point, setPoint] = useState(Number);

  useEffect(()=>{
    console.log("\n\nPostScreen입니다")
    // console.log("넘어온 post : ",post)
    // console.log("넘어온 lectureName : ",lectureName)
    console.log("author:",author)

    
    const data = fetchUserInfo();
    console.log('user:',data)
    
    
    setTags(post.tags)
    sortAttachments(post.attachments)
    fetchCurrPoint()
    isCommentAvailable()
  },[]) 

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const fetchedComments = await fetchComments(post.postId);
        setComments(fetchedComments);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [post.postId]);



  const sortAttachments = (attachments: Attachment[]) => {
    const images: Attachment[] = [];
    const files: Attachment[] = [];
    attachments.forEach(attachment => {
      if(attachment.type.startsWith('image')){
        images.push(attachment)
      }
      else{
        files.push(attachment)
      }
    });
    setImages(images);
    setFiles(files); 
  }

  const addComment = (newComment: Comment) => {
    setComments([newComment, ...comments]);
    console.log(newComment)
  };

  const toggleMenu = () => {
    if(!isModalVisible){
      setIsModalVisible(!isModalVisible);
    }
    if(isLikeModalVisible){
      setIsLikeModalVisible(!isLikeModalVisible);
    }
  };
  const onPressModalClose = () => {
    if(isModalVisible){
      setIsModalVisible(false);
    }
    if(isLikeModalVisible){
      setIsLikeModalVisible(false);
    }
  };

  const handleDeletePost = () => {
    deletePost();
    setIsModalVisible(false);
  };

  const handleDeleteComment = () => {
    console.log('delete comment')
    fetchComments(post.postId)
  }

  const handlePostEdit = () => {
    setIsModalVisible(false)
    navigation.navigate('PostEditScreen', {post: post, lectureName: lectureName});
  }

  const deletePost = () =>
    Alert.alert('게시글을 삭제하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제하기',
        style: 'default',
        onPress: async () => {
          const token = await AsyncStorage.getItem('userToken')
          try{
            const response = await axios.delete(`${API_URL}/posts/${post.postId}/`,
              {
                headers: {
                  authorization: `token ${token}`,
                },
              },
            );
            console.log("게시글 삭제: ",response.data)
            navigation.goBack()
          } catch(error) {
            console.error(error)
          }
        }
      },
    ]);

    const handlePressLike = async () => {
      try{
        setIsLikeModalVisible(true);
        post.likes += 1;
        setPostState({ ...postState, likes: post.likes });
        console.log('poststate:',postState)
        setIsLikeModalVisible(false);
  
        // 서버에 동기화 요청
        const token = await AsyncStorage.getItem('userToken')

        const formData = new FormData();
        formData.append('course_fk', post.postId);
        formData.append('student', post.postId);
        formData.append('id', post.postId);
        formData.append('likes', post.likes);

        const response = await axios.patch(`${API_URL}/posts/${post.postId}/`, formData,
          { 
            headers: { 
              authorization: `token ${token}`,
            }
          },
        );
      } catch(error){
        console.error(error)
      }
    }

    const fetchCurrPoint = async() => {
      try{
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/student/get-now-points/`, {
          headers: {
            authorization: `token ${token}`,
          },
        });
        const value = response.data as number;
        console.log('fetch curr point:',response.data)

        setPoint(value);
      } catch(e){
        console.error(e);
      }
    }


    const isCommentAvailable = async () => {
      let history = await fetchGetPointHistory();
      history = history.filter(item => item.purpose === "U");
      const lastUsedHistory = history[history.length-1];
    
      let point: number;
      point = lastUsedHistory.point;

      let hoursLeft=0;
      if(point==80)  hoursLeft = 1 * 24;
      if(point==160) hoursLeft = 7 * 24;
      if(point==240) hoursLeft = 14 * 24;
      if(point==300) hoursLeft = 30 * 24;

      const calculateHoursAgo = (pointTime: string) => {
        const pointDate = new Date(pointTime); // `point_time`을 Date 객체로 변환
        const now = new Date(); // 현재 시간
        const diffInMs = now.getTime() - pointDate.getTime(); // 밀리초 단위 차이 계산
        const diffInHours = diffInMs / (1000 * 60 * 60); // 시간을 계산
        return Math.floor(diffInHours); // 소수점 버림
      };
      
      let hoursAgo: number;
      hoursAgo = calculateHoursAgo(lastUsedHistory.point_time);
      
      if(hoursLeft>=hoursAgo) setCommentAvailable(true);
    };
    

    useEffect(() => {
      navigation.setOptions({title: lectureName});
    }, [lectureName,navigation]);

  if (loading) return <Text>Loading comments...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <SafeAreaView style={{height: 850}}>
      <>
        <ScrollView
          style={{
            paddingHorizontal: 16,
            marginBottom: 50,
            backgroundColor: 'white',
          }}>
          <View style={style.userArea}>
            <Image // 수정 필요..
              source={{uri: `${author.profile}`}}
              style={{
                width: 52,
                height: 51,
                flexShrink: 0,
                borderRadius: 25,
                alignSelf: 'flex-start'
              }}
            />

            <View style={style.userArea2}>
              <Text style={{color: '#3D3D3D', fontSize: 16, fontWeight: '500'}}>
                {post.author.name}
              </Text>
              <View style={style.userArea3}>
                <View style={{...GlobalStyles.row,gap:5,flexWrap:'wrap'}}>
                  {tags.map(tag => (
                      <View style={{backgroundColor:"#E8E8E8",borderRadius:12,paddingHorizontal:8,paddingVertical:3}}>
                          <Text style={{...GlobalStyles.text,fontSize:12,}}>#{tag.name}</Text>
                      </View>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity style={{justifyContent:'center',right:0,position:'absolute'}} onPress={toggleMenu}>
              <Icon name="more-vertical" size={24} color="#3D3D3D" />
            </TouchableOpacity>
          </View>

          <View style={style.postArea}>
            <Text style={style.postTitle}>{post.title}</Text>

            <View style={style.postContentArea}>
              <Text style={style.postContent}>{post.content}</Text>
            </View>

            {images.length > 0 && (
              <View style={[style.postPhotoArea, { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}]}>
                {images.map((image: Attachment, index: number) => (
                  <Image
                    key={index}
                    source={{ uri: `${API_URL}/${image.uri}` }}
                    style={{
                      width: 94,
                      height: 94,
                      borderRadius: 9,
                      marginLeft: 4,
                      marginBottom: 2, // 줄 간격
                    }}
                  />
                ))}
              </View>
            )}


            {files.length>0 && (
              <View style={style.postPhotoArea}>
                {files.map((file:Attachment, index: number)=>(
                  <Text style={{fontStyle:'italic'}}>{index+1}: {file.name.substring(12,)}</Text>
                ))}
              </View>
            )}

          </View>

          {/* 게시글 더보기 모달 */}
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
                <View style={style.menu}>
                  <TouchableOpacity
                    onPress={handlePostEdit}
                    style={[style.menuItem,{borderBottomColor:Colors.text.lightgray,borderBottomWidth:1,paddingBottom: 10}]}>
                    <Text>수정하기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDeletePost} style={style.menuItem}>
                    <Text style={{color:Colors.primary[500]}}>삭제하기</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* 공감 모달 */}
          <View>
            <Modal
              visible={isLikeModalVisible}
              transparent={true}
              onRequestClose={toggleMenu}>
              <TouchableOpacity
                onPressOut={onPressModalClose}
                activeOpacity={1}
                style={style.overlay}
              >
                <View style={style.menu_like}>
                  <Text style={{fontSize: 16}}>해당 게시글에 공감하시겠어요?</Text>
                  <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 15}}>
                    <TouchableOpacity onPress={()=>setIsLikeModalVisible(false)} style={{marginRight: 20}}>
                      <Text>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePressLike}>
                      <Text style={{color:Colors.primary[500]}}>확인</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>


          <View style={style.buttonArea}>
            {/* 왼쪽 정렬된 버튼 */}
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <TouchableOpacity style={[style.button, { flexDirection: 'row', alignItems: 'center', marginRight: 10 }]} onPress={()=>setIsLikeModalVisible(true)}>
                <Icon2 name="thumb-up" size={14} color="#ff1485" />
                <Text style={{ color: '#4D4D4D', fontSize: 12, fontWeight: '500', marginLeft: 5 }}>
                  공감
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[style.button, { flexDirection: 'row', alignItems: 'center' }]}>
                <Icon3 name="star" size={14} color="#ff1485" />
                <Text style={{ color: '#4D4D4D', fontSize: 12, fontWeight: '500', marginLeft: 5 }}>
                  스크랩
                </Text>
              </TouchableOpacity>
            </View>

            {/* 오른쪽 정렬된 텍스트 */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1, alignItems: 'center'}}>
              <Text style={{ marginLeft: 10, color: '#4D4D4D', fontSize: 12 }}>조회 {post.views}</Text>
              <Text style={{ marginLeft: 10, color: '#4D4D4D', fontSize: 12 }}>댓글 {comments.length}</Text>
              <Text style={{ marginLeft: 10, color: '#4D4D4D', fontSize: 12 }}>공감 {post.likes}</Text>
            </View>
          </View>

          {comments.map(comment => (
            <View style={{marginTop: 10}}>
              <CommentContainer 
                key={comment.commentId} 
                comment={comment} 
                currPoint={point} 
                handleDeleteComment={handleDeleteComment}
                commentAvailable={commentAvailable}
              />
            </View>
          ))}
          <View style={{height:90}}></View>
        </ScrollView>
        <CommentTextField 
          addComment={addComment}
          postId={post.postId}
        />
      </>
    </SafeAreaView>
  );
}
export default PostScreen;


export const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // paddingBottom: 700,
    // backgroundColor: 'white'
  },
  textfield: {
    flexDirection: 'row',
    position: 'absolute',
    bottom:70,
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
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
  inner: {
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    // alignItems: 'center',
    marginBottom:10,
  },
  attachmentPreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 40,
    marginLeft: 15,
    marginRight: 45,
  },
  attachmentWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginRight: 10,
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
  },
  fileName: {
    width: 50,
    height: 50,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#f0f0f0',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 2,
  },
})

export const style = StyleSheet.create({
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
  userArea: {
    display: 'flex',
    // width: 358,
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 16,
    gap: 10,
  },
  userArea2: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  userArea3: {
    display: 'flex',
    flexDirection: 'row',
    width: 300,
    gap: 3,
  },
  userArea2_comment: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
  },
  userArea3_comment: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
  },
  postArea: {
    borderColor:"#FF1485",
    borderWidth: 1,
    // backgroundColor: '#EF478E',
    display: 'flex',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 10,
  },
  postTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: -0.36,
    alignSelf: 'stretch',
  },
  postContentArea: {
    backgroundColor: '#FFF3F9',
    borderRadius: 9,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    gap: 10,
  },
  postPhotoArea: {
    backgroundColor: '#FDE',
    borderRadius: 9,
    display: 'flex',
    width: "100%",
    padding: 8,
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  postContent: {
    color: '#3D3D3D',
  },
  postButtonPink: {
    backgroundColor: '#F9D0E4',
    borderRadius: 10,
    display: 'flex',
    paddingVertical: 3,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  postButtonBrown: {
    backgroundColor: '#2D0418',
    borderRadius: 10,
    display: 'flex',
    paddingVertical: 3,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  commentArea: {
    width: 359,
    paddingHorizontal: 16,
    paddingVertical: 25,
    marginBottom: 8,
    borderRadius: 10,
    borderColor: "#FF1485",
    borderWidth: 0.5,
    backgroundColor: "#FFF",
  },
  commentArea_Blur: {
    position: 'absolute',
    top: 16,
    left: 16,
    bottom: 16,
    right: 16,
    backgroundColor: "#FFF",
    gap: 10,
  },
  text_Blur:{ 
    textAlign: 'center',
    marginTop: 'auto',
    fontWeight: '500',
    fontSize: 14
  },
  button_Blur: {
    backgroundColor: '#FF1485',
    margin: 'auto',
    borderRadius: 5,
    width: 50,
    height: 20,
  },
  buttonText_Blur: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    margin: 'auto'
  },
  comment: {
    color: '#3D3D3D',
    fontSize: 14,
    fontWeight: '400',
  },
  /*
     화면 영역
  */
  menu: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    position: 'absolute',
    top: 160,
    right: 16,
    width: 178,
    height: 85,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    shadowOpacity: 0.25,
    shadowOffset: {
      width:1,
      height:0,
    }
  },
  menu_comment: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    position: 'absolute',
    marginTop: 10,
    width: 178,
    height: 50,
    justifyContent: 'center',
    gap: 10,
    shadowOpacity: 0.25,
    shadowOffset: {
      width:1,
      height:0,
    }
  },
  menu_like: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginTop: 10,
    width: 244,
    height: 124,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowOpacity: 0.25,
    shadowOffset: {
      width:1,
      height:0,
    }
  },
  menuItem: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonArea: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 4,
    gap: 8,
  },
  button: {
    padding: 4,
    gap: 3,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
    shadowOpacity: 0.25,
    shadowOffset: {
      height: 2, // 이거 이상하테이
      width: 0,
    },
  },
});
