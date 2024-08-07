import React, {useState,useEffect} from 'react';
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
import {Comment, Post, Attachment} from '@src/Types';
import Colors from '@src/Colors';
import Icon from 'react-native-vector-icons/Feather.js';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons.js';
import Icon3 from 'react-native-vector-icons/AntDesign.js';
import { GlobalStyles } from '@src/GlobalStyles';
import { tagColors } from '@src/MockData';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker'


function CommentTextField({ addComment }: { addComment: (comment: Comment) => void }) {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(20);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const placeholder = '첫 댓글 작성 시 포인트 3배 적립';

  const handlePressButton = () => {
    console.log('pressed')
    if(text.trim().length>0){
      const newComment : Comment = {
        commentId: 2, // 하드코딩됨
        userId: 'sampleUserId',
        content: text,
        date: new Date().toString(),
        attachments,
      }
      addComment(newComment);
      setText('');
      setInputHeight(20);
      setAttachments([]);
    }
  }

  const handleSelectAttachment = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 3 }, (response) => {
      if (response.assets) {
        const newAttachments = response.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
        } as Attachment));
        setAttachments([...attachments, ...newAttachments]);
      }
    });
  };

  const handleRemoveAttachment = (uri: string) => {
    setAttachments(attachments.filter(attachment => attachment.uri !== uri));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
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
              <TouchableOpacity onPress={handlePressButton}>
                <Icon name="send" size={18} color={Colors.ui.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSelectAttachment}>
                <Icon name="image" size={18} color={Colors.ui.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.attachmentPreviewContainer}>
            {attachments.map(attachment => (
              <View key={attachment.uri} style={[styles.attachmentWrapper,{paddingBottom: inputHeight}]}>
                {attachment.type.startsWith('image/') ? (
                  <Image source={{ uri: attachment.uri }} style={styles.previewImage} />
                ) : (
                  <Text style={styles.fileName}>{attachment.name}</Text>
                )}
                <TouchableOpacity onPress={() => handleRemoveAttachment(attachment.uri)} style={styles.removeButton}>
                  <Icon name="x" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // paddingBottom: 700,
  },
  textfield: {
    flexDirection: 'row',
    position: 'absolute',
    // bottom: 0,
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

function CommentContainer({comment}: {comment: Comment}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBlurVisible, setIsBluerVisible] = useState(true);
  

  const onPressModalClose = () => {
    setIsModalVisible(false);
  };

  const toggleMenu = () => {
    setIsModalVisible(!isModalVisible);
    console.log(comment);
  };

  const toggleBlur = () => {
    Alert.alert('포인트를 사용하시겠습니까?','현재 보유 포인트: 40',[
      {
        text: '취소',
        style: 'cancel'
      },
      {
        text: '사용하기',
        style: 'default',
        onPress: () => {
          setIsBluerVisible(false);
          // 포인트 사용 로직
        }
      }
    ])
  };

  return (
    <View>
      <View style={style.userArea}>
        <Image
          // source={{uri:post.author.profile}}
          source={require('@assets/images/hamster.png')} // 여기 수정 필요 (지금 하드코딩..)
          style={{width: 38, height: 36, borderRadius: 25}}
        />

        <View style={style.userArea2_comment}>
          <Text style={{color: '#3D3D3D', fontSize: 14, fontWeight: '500'}}>{comment.userId}</Text>
          <View style={style.userArea3}>
            <Text style={{color: '#3D3D3D', fontSize: 12, fontWeight: '300'}}>{comment.date}</Text>
          </View>
        </View>

        <TouchableOpacity style={{marginLeft: 210}} onPress={toggleMenu}>
          <Icon name="more-vertical" size={24} color="#3D3D3D" />
        </TouchableOpacity>
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
            <View style={style.menu}>
              <TouchableOpacity style={style.menuItem}>
                <Text style={{color:Colors.primary[500]}}>신고하기</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <View style={style.commentArea}>
        <Text style={style.comment}>
          {comment.content}
        </Text>
        {comment.attachments.map((attachment: Attachment, index: number) => (
          <Image
            key={index}
            source={{ uri: attachment.uri }}
            style={{ width: 82, height: 82, borderRadius: 9 }}
          />
        ))}

        {isBlurVisible && (
          <View style={style.commentArea_Blur}>
            <Text style={style.text_Blur}>포인트 사용하고 댓글 보기</Text>
            <TouchableOpacity onPress={toggleBlur} style={style.button_Blur}>
              <Text style={style.buttonText_Blur}>사용하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={style.buttonArea}>
        <TouchableOpacity style={style.button}>
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
        </TouchableOpacity>
        <TouchableOpacity style={style.button}>
          <Icon name="smile" size={14} color="#8012F1" />
          <Text style={{color: '#8012F1', fontSize: 12, fontWeight: '500'}}>
            채택
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface PostScreenProps {
  route: any;
  navigation: any;
}
const PostScreen: React.FC<PostScreenProps> = ({route,navigation,}) => {
// function PostScreen({route,navigation}: {route: any,navigation: any}) {
  const post: Post = route.params.post;
  const lectureName: string = route.params.lectureName;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comments, setComments] = useState(post.comments);

  const addComment = (newComment: Comment) => {
    setComments([newComment, ...comments]);
    console.log(newComment)
  };

  const toggleMenu = () => {
    setIsModalVisible(!isModalVisible);
  };
  const onPressModalClose = () => {
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    createTwoButtonAlert();
    setIsModalVisible(false);
  };

  const createTwoButtonAlert = () =>
    Alert.alert('게시글을 삭제하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제하기',
        style: 'default',
        onPress: () => {
          // 삭제 로직
        },
      },
    ]);

    useEffect(()=>{
      console.log(comments)
    },[comments])

    useEffect(() => {
      navigation.setOptions({title: lectureName});
    }, [lectureName,navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <>
        <ScrollView
          style={{
            paddingHorizontal: 16,
            // marginHorizontal: 8,
            backgroundColor: 'white',
          }}>
          <View style={style.userArea}>
            <Image
              // source={{uri:post.author.profile}}
              source={require('@assets/images/hamster.png')} // 여기 수정 필요 (지금 하드코딩..)
              style={{
                width: 52,
                height: 51,
                flexShrink: 0,
                borderRadius: 25,
              }}
            />

            <View style={style.userArea2}>
              <Text style={{color: '#3D3D3D', fontSize: 16, fontWeight: '500'}}>
                {post.author.name}
              </Text>
              <View style={style.userArea3}>
                <View style={{...GlobalStyles.row,gap:10}}>
                  {post.tags.map(tag => (
                      <View style={{backgroundColor:tagColors[tag.id],borderRadius:12,paddingHorizontal:8,paddingVertical:3}}>
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

            {post.attachments.length>0 && (
              <View style={style.postPhotoArea}>
                {post.attachments.map((attachment: Attachment, index: number) => (
                  <Image
                    key={index}
                    source={{ uri: attachment.uri }}
                    style={{ width: 82, height: 82, borderRadius: 9 }}
                  />
                ))}
              </View>
            )}
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
                <View style={style.menu}>
                  <TouchableOpacity
                    onPress={onPressModalClose}
                    style={[style.menuItem,{borderBottomColor:Colors.text.lightgray,borderBottomWidth:1,paddingBottom: 10}]}>
                    <Text>수정하기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete} style={style.menuItem}>
                    <Text style={{color:Colors.primary[500]}}>삭제하기</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          <View style={style.buttonArea}>
            <TouchableOpacity style={style.button}>
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
            </TouchableOpacity>
            <TouchableOpacity style={style.button}>
              <Icon3 name="star" size={14} color="#ff1485" />
              <Text
                style={{
                  color: '#4D4D4D',
                  fontSize: 12,
                  fontWeight: '500',
                  marginLeft: 5,
                }}>
                스크랩
              </Text>
            </TouchableOpacity>
          </View>

          {comments.map(comment => (
            <View key={comment.commentId} style={{marginTop: 10}}>
              <CommentContainer comment={comment} />
            </View>
          ))}
          <View style={{height:70}}></View>
        </ScrollView>
        <CommentTextField addComment={addComment}/>
      </>
    </SafeAreaView>
  );
}
export default PostScreen;


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
  userArea: {
    display: 'flex',
    width: 358,
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
    gap: 3,
  },
  userArea2_comment: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
  },
  postArea: {
    borderColor: Colors.ui.primary,
    backgroundColor: '#EF478E',
    display: 'flex',
    borderWidth: 2,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 10,
  },
  postTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: -0.36,
    alignSelf: 'stretch',
  },
  postContentArea: {
    backgroundColor: '#FFF7F7',
    borderRadius: 9,
    display: 'flex',
    flexDirection: 'column',
    width: 342,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    gap: 10,
  },
  postPhotoArea: {
    backgroundColor: '#FFF',
    borderRadius: 9,
    display: 'flex',
    width: 342,
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
    backgroundColor: "#FFF8FC",
  },
  commentArea_Blur: {
    position: 'absolute',
    top: 16,
    left: 16,
    bottom: 16,
    right: 16,
    backgroundColor: "#FFF8FCF0",
  },
  text_Blur:{ 
    textAlign: 'center',
    marginTop: 'auto',
    // marginVertical: 'auto',
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
    height: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
