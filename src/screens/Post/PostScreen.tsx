import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
} from 'react-native';
import {Comment, Post, Attachment, Tag} from '@src/Types';
import Colors from '@src/Colors';
import Icon from 'react-native-vector-icons/Feather.js';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons.js';
import Icon3 from 'react-native-vector-icons/AntDesign.js';
import {GlobalStyles} from '@src/GlobalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {CommentTextField, CommentContainer} from './Comment';
import ImageView from 'react-native-image-viewing';

// import APIs
import {API_URL} from '@env';
import {fetchComments, fetchPostInfo} from './PostAPI';
import {fetchCheckPermission, fetchGetPointHistory} from '@src/data/storeApi';
import {fetchUserInfo} from '@src/data/studentApi';
import {givePoints} from '../Store/StoreHandler';

interface PostScreenProps {
  route: any;
  navigation: any;
}

const PostScreen: React.FC<PostScreenProps> = ({route, navigation}) => {
  const post: any = route.params.post;
  const lectureName: string = route.params.lecture;
  // const author: UserInfo = new UserInfo(
  //   post.author.id,
  //   post.author.name,
  //   post.author.profile,
  // );
  const [postInfo, setPostInfo] = useState<Post | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLikeModalVisible, setIsLikeModalVisible] = useState(false);
  const [userId, setUserId] = useState(Number);
  const [ismypost, setismypost] = useState(Boolean);
  const [notChosen, setNotChosen] = useState(true);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentAvailable, setCommentAvailable] = useState<boolean>(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [point, setPoint] = useState(Number);
  const [liked, setLiked] = useState(false);
  const [scrapped, setScrapped] = useState(false);

  // 이미지 관련
  const [images, setImages] = useState<Attachment[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getPostInfo = async () => {
      const fetchedPostInfo = await fetchPostInfo(route.params.post.id);
      setPostInfo(fetchedPostInfo);
      if (fetchedPostInfo?.liked) setLiked(true);
      if (fetchedPostInfo?.scraped) setScrapped(true);
    };
    getPostInfo();
  }, []);

  useEffect(() => {
    async function checkUser() {
      try {
        const {data, status} = await fetchUserInfo();
        if (status == 200) {
          setUserId(data.user_id);
          if (data.user_id == Number(postInfo?.author.id)) {
            setismypost(true);
          }
        } else {
          console.error('user not found');
        }
      } catch (e) {
        console.error('Error fetching user info:', e);
      }
    }
    checkUser();

    if (postInfo) {
      setTags(postInfo.tags);
      sortAttachments(postInfo?.attachments);
    }
    // if(postInfo?.attachments){
    //   sortAttachments(postInfo?.attachments)
    // }
    fetchCurrPoint();
    // isCommentAvailable();
  }, [postInfo]);

  useEffect(() => {}, [userId, ismypost, notChosen]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const fetchedComments = await fetchComments(post.id);
        if (fetchedComments.some(comment => comment.isChosen)) {
          setNotChosen(false);
        }
        setComments(fetchedComments);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [post.id]);

  const sortAttachments = (attachments: Attachment[]) => {
    const images: Attachment[] = [];
    const files: Attachment[] = [];
    attachments.forEach(attachment => {
      if (attachment.type.startsWith('image')) {
        images.push(attachment);
      } else {
        files.push(attachment);
      }
    });
    setImages(images);
    setFiles(files);
  };

  const addComment = (newComment: Comment) => {
    setComments([newComment, ...comments]);
  };

  const toggleMenu = () => {
    if (!isModalVisible) {
      setIsModalVisible(!isModalVisible);
    }
    if (isLikeModalVisible) {
      setIsLikeModalVisible(!isLikeModalVisible);
    }
  };
  const onPressModalClose = () => {
    if (isModalVisible) {
      setIsModalVisible(false);
    }
    if (isLikeModalVisible) {
      setIsLikeModalVisible(false);
    }
  };

  const handleDeletePost = () => {
    deletePost();
    setIsModalVisible(false);
  };

  const handlePostEdit = () => {
    setIsModalVisible(false);
    navigation.navigate('PostEditScreen', {
      post: postInfo,
      lectureName: lectureName,
    });
  };

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
          const token = await AsyncStorage.getItem('userToken');
          try {
            await axios.delete(`${API_URL}/posts/${post.id}/`, {
              headers: {
                authorization: `token ${token}`,
              },
            });
            navigation.goBack({refresh: true});
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);

  const handlePressLike = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_URL}/posts/${post.id}/like/`,
        {id: post.id},
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      );
      if (response.data.Detail == '이 게시글에 좋아요를 눌렀어요.') {
        post.likes += 1;
        setLiked(true);
        if (postInfo) setPostInfo({...postInfo, likes: post.likes});
      } else {
        post.likes -= 1;
        setLiked(false);
        if (postInfo) setPostInfo({...postInfo, likes: post.likes});
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePressScrap = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_URL}/posts/${post.id}/scrap/`,
        {id: post.id},
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      );
      if (response.data.Detail == '이 게시글을 스크랩하셨어요.') {
        // post.likes += 1;
        setScrapped(true);
        // if(postInfo) setPostInfo({ ...postInfo, likes: post.likes });
      } else {
        // post.likes -= 1;
        setScrapped(false);
        // if(postInfo) setPostInfo({ ...postInfo, likes: post.likes });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCurrPoint = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/student/get-now-points/`, {
        headers: {
          authorization: `token ${token}`,
        },
      });
      const value = response.data as number;
      setPoint(value);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      const permission = await fetchCheckPermission();
      setCommentAvailable(permission);
    };
    checkPermission();
  }, []);

  const handleChoose = async (commentId: number, isChosen: boolean) => {
    if (isChosen) return;
    Alert.alert('해당 댓글을 채택하시겠습니까?', '채택은 취소할 수 없습니다', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        style: 'default',
        onPress: async () => {
          const token = await AsyncStorage.getItem('userToken');
          try {
            const formData = new FormData();
            formData.append('is_chosen', !isChosen);
            await axios.patch(`${API_URL}/comments/${commentId}/`, formData, {
              headers: {
                authorization: `token ${token}`,
              },
            });
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    navigation.setOptions({title: lectureName});
  }, [lectureName, navigation]);

  if (loading) return <Text>Loading comments...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <>
        <ScrollView
          style={{
            paddingHorizontal: 16,
            marginBottom: 50,
            backgroundColor: 'white',
          }}>
          <View style={style.userArea}>
            <Image
              source={{uri: `${postInfo?.author.profile}`}}
              style={{
                width: 51,
                height: 51,
                flexShrink: 0,
                borderRadius: 25,
                alignSelf: 'flex-start',
              }}
            />

            <View style={style.userArea2}>
              <Text style={{color: '#3D3D3D', fontSize: 16, fontWeight: '500'}}>
                {postInfo?.author.name}
              </Text>
              <View style={style.userArea3}>
                <View style={{...GlobalStyles.row, gap: 5, flexWrap: 'wrap'}}>
                  {tags.map((tag, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: '#E8E8E8',
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      }}>
                      <Text style={{...GlobalStyles.text, fontSize: 12}}>
                        #{tag.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {ismypost && (
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  right: 0,
                  position: 'absolute',
                }}
                onPress={toggleMenu}>
                <Icon name="more-vertical" size={24} color="#3D3D3D" />
              </TouchableOpacity>
            )}
          </View>

          <View style={style.postArea}>
            <Text style={style.postTitle}>{postInfo?.title}</Text>

            <View style={style.postContentArea}>
              <Text style={style.postContent}>{postInfo?.content}</Text>
            </View>

            {images.length > 0 && (
              <View
                style={[
                  style.postPhotoArea,
                  {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  },
                ]}>
                {images.map((image: Attachment, index: number) => (
                  // <Image
                  //   key={index}
                  //   source={{ uri: `${API_URL}/${image.uri}` }}
                  //   style={{
                  //     width: 94,
                  //     height: 94,
                  //     borderRadius: 9,
                  //     marginLeft: 4,
                  //     marginBottom: 2, // 줄 간격
                  //   }}
                  // />
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCurrentIndex(index);
                      setVisible(true);
                    }}>
                    <Image
                      source={{uri: `${API_URL}/${image.uri}`}}
                      style={{
                        width: 94,
                        height: 94,
                        borderRadius: 9,
                        marginLeft: 4,
                        marginBottom: 2, // 줄 간격
                      }}
                    />
                  </TouchableOpacity>
                ))}
                <ImageView
                  images={images.map(img => ({uri: `${API_URL}/${img.uri}`}))}
                  imageIndex={currentIndex}
                  visible={visible}
                  onRequestClose={() => setVisible(false)}
                />
              </View>
            )}

            {files.length > 0 && (
              <View style={style.postPhotoArea}>
                {files.map((file: Attachment, index: number) => (
                  <Text key={index} style={{fontStyle: 'italic'}}>
                    {index + 1}: {file.name.substring(12)}
                  </Text>
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
                style={style.overlay}>
                <View style={style.menu}>
                  <TouchableOpacity
                    onPress={handlePostEdit}
                    style={[
                      style.menuItem,
                      {
                        borderBottomColor: Colors.text.lightgray,
                        borderBottomWidth: 1,
                        paddingBottom: 10,
                      },
                    ]}>
                    <Text>수정하기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDeletePost}
                    style={style.menuItem}>
                    <Text style={{color: Colors.primary[500]}}>삭제하기</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          <View style={style.buttonArea}>
            {/* 왼쪽 정렬된 버튼 */}
            <View style={{flexDirection: 'row', flex: 1}}>
              <TouchableOpacity
                style={[
                  style.button,
                  {flexDirection: 'row', alignItems: 'center', marginRight: 10},
                ]}
                onPress={handlePressLike}>
                <Icon2 name="thumb-up" size={14} color="#ff1485" />
                {liked && (
                  <Text
                    style={{
                      color: '#ff1485',
                      fontSize: 12,
                      fontWeight: '900',
                      marginLeft: 5,
                    }}>
                    공감
                  </Text>
                )}
                {!liked && (
                  <Text
                    style={{
                      color: '#4D4D4D',
                      fontSize: 12,
                      fontWeight: '500',
                      marginLeft: 5,
                    }}>
                    공감
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  style.button,
                  {flexDirection: 'row', alignItems: 'center'},
                ]}
                onPress={handlePressScrap}>
                <Icon3 name="star" size={14} color="#ff1485" />
                {scrapped && (
                  <Text
                    style={{
                      color: '#ff1485',
                      fontSize: 12,
                      fontWeight: '900',
                      marginLeft: 5,
                    }}>
                    스크랩
                  </Text>
                )}
                {!scrapped && (
                  <Text
                    style={{
                      color: '#4D4D4D',
                      fontSize: 12,
                      fontWeight: '500',
                      marginLeft: 5,
                    }}>
                    스크랩
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                flex: 1,
                alignItems: 'center',
              }}>
              <Text style={{marginLeft: 10, color: '#4D4D4D', fontSize: 12}}>
                조회 {postInfo?.views}
              </Text>
              <Text style={{marginLeft: 10, color: '#4D4D4D', fontSize: 12}}>
                댓글 {comments.length}
              </Text>
              <Text style={{marginLeft: 10, color: '#4D4D4D', fontSize: 12}}>
                공감 {postInfo?.likes}
              </Text>
            </View>
          </View>

          {comments.map((comment, index) => (
            <View key={`comment-${index}`} style={{marginTop: 10}}>
              <CommentContainer
                key={index}
                comment={comment}
                currPoint={point}
                commentAvailable={commentAvailable}
                userId={userId}
                isMyPost={ismypost}
                notChosen={notChosen}
                onChoose={handleChoose}
              />
            </View>
          ))}
          <View style={{height: 90}}></View>
        </ScrollView>
        <CommentTextField
          addComment={addComment}
          postId={post.id}
          studentId={userId}
        />
      </>
    </SafeAreaView>
  );
};
export default PostScreen;

export const styles = StyleSheet.create({
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
});

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
    ...GlobalStyles.shadow,
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
    borderColor: '#FF1485',
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
    width: '100%',
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
    borderColor: '#FF1485',
    borderWidth: 0.5,
    backgroundColor: '#FFF',
  },
  commentArea_Blur: {
    position: 'absolute',
    top: 16,
    left: 16,
    bottom: 16,
    right: 16,
    backgroundColor: '#FFF',
    gap: 10,
  },
  text_Blur: {
    textAlign: 'center',
    marginTop: 'auto',
    fontWeight: '500',
    fontSize: 14,
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
    margin: 'auto',
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
      width: 1,
      height: 0,
    },
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
      width: 1,
      height: 0,
    },
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
      width: 1,
      height: 0,
    },
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
