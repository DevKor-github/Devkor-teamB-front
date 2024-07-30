import React, {useEffect, useState} from 'react';
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
import {Comment, Post} from './CommunityTypes.tsx';
import {Color} from '../../component/Color.tsx';
import Icon from 'react-native-vector-icons/Feather.js';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons.js'
import Icon3 from 'react-native-vector-icons/AntDesign.js'
import BottomSheet from '../../component/BottomSheet.tsx';
import { BlurView } from '@react-native-community/blur';

function CommentTextField() {
  const [text, setText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const placeholder = '첫 댓글 작성 시 포인트 3배 적립';

  const toggleModal = () => {
    // setModalVisible(!isModalVisible);
    console.log('toggled')
  };


  return (
  //   <KeyboardAvoidingView style={{backgroundColor:'white'}}>
  //   {/* <ScrollView style={style.container}> */}
  //     <View style={style.textfield}>
        // <TextInput
        //   style={{flex: 1,color:'#000'}}
        //   onChangeText={setText}
        //   value={text}
        //   placeholder={placeholder}
        // />
        // <TouchableOpacity>
        //   <Icon name="send" size={18} color={Color.ui.primary} />
        // </TouchableOpacity>
  //     </View>
  //   {/* </ScrollView> */}
  // </KeyboardAvoidingView>
    <>
      <TouchableOpacity onPress={toggleModal} style={{justifyContent: 'flex-end'}}>
        <View style={styles.textfield}>
          <TextInput
            style={{flex:1,color:'#000'}}
            onChangeText={setText}
            value={text}
            placeholder={placeholder}
          />
          <TouchableOpacity>
            <Icon name="send" size={18} color={Color.ui.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* <Modal
        visible={isModalVisible}
        style={styles.modal}
      >
        <KeyboardAvoidingView>
          <View style={styles.textfield}>
            <TextInput
              style={{ flex: 1, color: '#000' }}
              onChangeText={setText}
              value={text}
              placeholder={placeholder}
              placeholderTextColor="#999"
              autoFocus
            />
            <TouchableOpacity>
              <Icon name="send" size={18} color={Color.ui.primary} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal> */}
    </>
  );
}

const styles = StyleSheet.create({
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
  modal: {
    justifyContent: 'flex-end',
    margin:0,
    height: 200,
    backgroundColor: 'pink'
  }
})

function CommentContainer({comment}: {comment: Comment}) {
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [isBlurVisible,setIsBlurVisible] = useState(true);
  
  const toggleMenu = () => {
    setIsModalVisible(!isModalVisible);
  }

  const toggleBlur = () => {
    setIsBlurVisible(!isBlurVisible);
  }

  return (
    <View>
      <View style={style.userArea}>
          <Image 
            // source={{uri:post.author.profile}}
            source={require('../../assets/images/hamster.png')} // 여기 수정 필요 (지금 하드코딩..)
            style={{width:38,height:36,borderRadius:25}}>
          </Image>

          <View style={style.userArea2_comment}>
            <Text style={{color: "#3D3D3D",fontSize:14,fontWeight:"500"}}>{comment.userId}</Text>
            <View style={style.userArea3}>
              <Text style={{color:"#3D3D3D",fontSize:12,fontWeight:"300"}}>{comment.date}</Text>
            </View>
          </View>

          <TouchableOpacity style={{marginLeft: 150}} onPress={toggleMenu}>
            <Icon name="more-vertical" size={24} color="#3D3D3D" /> 
          </TouchableOpacity>
      </View>
      
      <View style={style.commentArea}>
        <Text style={style.comment}>
          {comment.content}
        </Text>
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
          <Icon2 name="thumb-up" size={14} color="#ff1485"></Icon2>
          <Text style={{color:"#4D4D4D",fontSize:12,fontWeight:"500",marginLeft:5}}>19</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button}>
          <Icon2 name="comment" size={14} color="#ff1485"></Icon2>
          <Text style={{color:"#4D4D4D",fontSize:12,fontWeight:"500",marginLeft:5}}>12</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button}>
          <Icon name="smile" size={14} color="#8012F1"></Icon>
          <Text style={{color:"#8012F1",fontSize:12,fontWeight:"500"}}>채택</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PostScreen({route}: {route: any}) {
  const post: Post = route.params.post;
  const [isModalVisible,setIsModalVisible] = useState(false);
  

  const toggleMenu = () => {
    setIsModalVisible(!isModalVisible);
  }
  const onPressModalClose = () => {
    setIsModalVisible(false);
  }

  const handleDelete = () => {
    createTwoButtonAlert();
    setIsModalVisible(false);
  }


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
        }
      },
    ]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <>
        <ScrollView
          style={{
            paddingHorizontal: 16,
            // marginHorizontal: 8,
            backgroundColor: "white"
          }}>
          <View style={style.userArea}>
            <Image 
              // source={{uri:post.author.profile}}
              source={require('../../assets/images/hamster.png')} // 여기 수정 필요 (지금 하드코딩..)
              style={{width:52,height:51,flexShrink:0,borderRadius:25}}>
            </Image>
            <View style={style.userArea2}>
              <Text style={{color: "#3D3D3D",fontSize:16,fontWeight:"500"}}>{post.author.name}</Text>
              <View style={style.userArea3}>
                <TouchableOpacity style={style.postButtonPink}>
                  <Text style={{fontSize:12,fontWeight:"400"}}>#기말고사</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.postButtonBrown}>
                  <Text style={{fontSize:12,fontWeight:"400",color:"#FFF"}}>#질문</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={{marginLeft: 150}} onPress={toggleMenu}>
              <Icon name="more-vertical" size={24} color="#3D3D3D" /> 
            </TouchableOpacity>
          </View>


          <View style={style.postArea}>
              <Text style={style.postTitle}>{post.title}</Text>

              <View style={style.postContentArea}>
                <Text style={style.postContent}>{post.content}</Text>
              </View>

              <View style={style.postPhotoArea}>
                <Image source={require('../../assets/images/hamster.png')} style={{width:82,height:82,borderRadius:9,}}></Image>
                <Image source={require('../../assets/images/hamster2.png')} style={{width:82,height:82,borderRadius:9,}}></Image>
                <TouchableOpacity style={{width:82,height:82,borderRadius:9,padding:15,backgroundColor:"#EDDFDF",justifyContent:"center",alignItems:"center"}}>
                  <Icon name="plus" size={35} color="#757575"></Icon>
                </TouchableOpacity>
              </View>
          </View>

          <View style={{marginTop:10}}>
            <Modal
              visible={isModalVisible}
              transparent={true}
              onRequestClose={toggleMenu}
            >
              <View style={style.menu}>
                <TouchableOpacity onPress={onPressModalClose} style={style.menuItem}>
                  <Text>수정하기</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={style.menuItem}>
                  <Text>삭제하기</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>

          <View style={style.buttonArea}>
            <TouchableOpacity style={style.button}>
              <Icon2 name="thumb-up" size={14} color="#ff1485"></Icon2>
              <Text style={{color:"#4D4D4D",fontSize:12,fontWeight:"500",marginLeft:5}}>19</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.button}>
              <Icon2 name="comment" size={14} color="#ff1485"></Icon2>
              <Text style={{color:"#4D4D4D",fontSize:12,fontWeight:"500",marginLeft:5}}>12</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.button}>
              <Icon3 name="star" size={14} color="#ff1485"></Icon3>
              <Text style={{color:"#4D4D4D",fontSize:12,fontWeight:"500",marginLeft:5}}>스크랩</Text>
            </TouchableOpacity>
          </View>



          {post.comments.map(comment => (
            <View key={comment.commentId} style={{marginTop: 10}}>
              <CommentContainer comment={comment} />
            </View>
          ))}
          <View style={{margin:40}}></View>
        </ScrollView>
        <CommentTextField />
      </>
    </SafeAreaView>
  );
}

export default PostScreen;



// style영역
const style = StyleSheet.create({
  userArea: {
    display: "flex",
    width: 358,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 16,
    gap: 10,
  },
  userArea2: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8
  },
  userArea3: {
    display: "flex",
    flexDirection: "row",
    gap: 3
  },
  userArea2_comment: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5,
  },
  postArea: {
    borderColor: Color.ui.primary,
    backgroundColor: "#EF478E",
    display: "flex",
    borderWidth: 2,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 10
  },
  postTitle: {
    color: "#FFF",
    fontSize: 18, 
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: -0.36,
    alignSelf: "stretch"
  },
  postContentArea: {
    backgroundColor: "#FFF7F7",
    borderRadius: 9,
    display: "flex",
    flexDirection: "column",
    width: 342,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal:12,
    alignItems: "flex-start",
    gap: 10
  },
  postPhotoArea: {
    backgroundColor: "#FFF",
    borderRadius: 9,
    display: "flex",
    width: 342,
    padding: 8,
    alignItems:'flex-start',
    flexDirection:'row',
    gap: 10
  },
  postContent: {
    color: "#3D3D3D"
  },
  postButtonPink: {
    backgroundColor: "#F9D0E4",
    borderRadius: 10,
    display: "flex",
    paddingVertical: 3,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  },
  postButtonBrown: {
    backgroundColor: "#2D0418",
    borderRadius: 10,
    display: "flex",
    paddingVertical: 3,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 10
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
    color: "#3D3D3D",
    fontSize: 14,
    fontWeight: "400",
  },
  /*
     모달 화면 영역
  */
  menu: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    position: "absolute",
    top:160,
    right: 16,
    width: 178,
    height: 70, 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  menuItem: {
    alignSelf: "flex-start",
    marginLeft: 22,
    width: "auto",
  },
  buttonArea: {
    display:"flex",
    flexDirection:"row",
    alignSelf: "flex-end",
    marginTop: 4,
    gap: 8
  },
  button: {
    padding: 4,
    gap: 3,
    borderRadius: 5,
    display:"flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    shadowOpacity: 0.25,
    shadowOffset: {
      height: 2, // 이거 이상하테이
      width: 0,
    },
  }
});