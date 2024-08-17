import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {mockPosts, mockLectures} from '@src/MockData';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Lecture, Post, UserInfo} from '@src/Types';
import DailyBriefingWidget from '@screens/Community/DailyBriefingWidget';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import Colors from '@src/Colors';
import { tagColors } from '@src/MockData';
import {SafeAreaView} from 'react-native-safe-area-context';
import FloatingButton from '@src/components/FloatingButton';
import Icon from 'react-native-vector-icons/Octicons';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface CommunityScreenProps {
  route: any;
  navigation: any;
}



const PostItem = ({post, lectureName}: {post: Post, lectureName: string}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [fetchedPost, setFetchedPost] = useState<Post>();

  useEffect(()=>{
    // console.log('post:',post)
    // console.log('lectureName2:',lectureName)
    fetchPostInfo(post.postId)
  },[])

  const fetchPostInfo = async (postId:number) => {
    const API_URL = "http://15.165.198.75:8000"
    try{
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(`${API_URL}/posts/${postId}/`,  
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      );
      // console.log('response:',response.data)
      const data = response.data
      const newPost : Post = {
        postId: data.id,
        title: data.title,
        author: new UserInfo(
          data.author.id,
          data.author.nickname,
          'https://example.com/image3.jpg', // 이거 어카지
        ),
        postDate: data.created_at,
        view: 10, // 예시
        content: data.content,
        images : data.attached_file,
        files: data.attached_file,
        tags: data.tags,
      }
      // console.log('newpost:',newPost)
      setFetchedPost(newPost)
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  const handleNavigate = () => {
    console.log(fetchedPost)
    console.log(lectureName)
    navigation.navigate('PostScreen', {post: fetchedPost, lectureName: lectureName});
  }

  return (
    <TouchableOpacity
      style={postStyles.postItem}
      onPress={handleNavigate}>

      <View style={{...GlobalStyles.row, justifyContent: 'space-between'}}>
        <View>
          <Text style={postStyles.postText}>{post.title}</Text>
          <View style={{...GlobalStyles.row,gap:5,flexWrap : 'wrap',}}>
            {fetchedPost && fetchedPost.tags.map(tag => (
                <View style={{backgroundColor:tagColors[tag.id],borderRadius:12,paddingHorizontal:8,paddingVertical:3,}}>
                    <Text style={{...GlobalStyles.text,fontSize:12,}}>#{tag.name}</Text>
                </View>
            ))}
          </View>
          <Text style={{color:Colors.text.lightgray,marginTop: 7}}>{fetchedPost && fetchedPost.postDate.substring(0,10)} | 조회 {post.view} | 댓글 {10} | 좋아요 0</Text>
        </View>
        {fetchedPost && fetchedPost.images && fetchedPost.images.length > 0 && (
          <Image source={{uri: fetchedPost.images[0].uri}} style={{width:65,height:65,borderRadius:5,alignSelf: 'center'}}/>
        )}
      </View>

    </TouchableOpacity>
  );
};

const PostView = ({items, id, lectureName}: {items: Post[]; id: number, lectureName: string}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [query, setQuery] = useState("");

  useEffect(()=>{
    console.log('items:',items)
    console.log('id:',id)
    console.log('lectureName:',lectureName)
  })

  return (
    <View>
      <View style={styles.searchContainer}>
        <Icon name="search" size={15} color="#BAABB2"></Icon>
        <TextInput
          style={styles.textInput}
          onChangeText = {setQuery}
          value = {query}
          placeholder = "키워드 및 검색어를 입력해주세요"
        />
      </View>
      <View style={postStyles.container}>
        {items === undefined ? (
          <View style={postStyles.postEmpty}>
            <Text style={postStyles.postEmptyText}>아직 게시물이 없습니다</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={({item}: {item: Post}) => (
              <PostItem post={item} lectureName={lectureName} />
            )}
          />
        )}

      </View>

      <FloatingButton
        onPress={() => {
          navigation.navigate('PostCreationScreen', {lectureId: id});
        }}>
        <Icon name="plus" size={24} color={Colors.ui.background} />
      </FloatingButton>
    </View>

  );
};

const PostListScreen: React.FC<CommunityScreenProps> = ({route,navigation,}) => {
  const {id} = route.params;
  const communities = mockPosts;
  const lecture = mockLectures.find((e: Lecture) => e.id === id) as Lecture;
  const items = route.params.items;

  useEffect(() => {
    navigation.setOptions({title: `${route.params.lectureName}`});
  }, [lecture, communities, navigation]);
  
  useEffect(()=>{
    console.log('postlistscreen:',id)
  },[])

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PostView items={items} id={id} lectureName={route.params.lectureName}></PostView>
    </SafeAreaView>
  );
};

const headerStyle = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    ...GlobalStyles.row,
    margin: 10,
  },
  title: {
    textAlign: 'center',
    color: Colors.text.black,
    fontSize: FontSizes.large,
    padding: 4,
    ...GlobalStyles.boldText,
  },
  more: {
    color: Colors.text.lightgray,
    textAlign: 'center',
    fontSize: FontSizes.medium,
    ...GlobalStyles.text,
  },
  arrow: {width: 16, height: 16, tintColor: Colors.text.lightgray},
});


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F5F7",
    padding: 12,
    ...GlobalStyles.expand,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBE4E7',
    marginLeft: 5,
    paddingLeft: 10,
    width: 358,
    height: 34,
    borderRadius: 17,
  },
  textInput: {
    // flex: 1,
    height: 40,
    margin: 5
},
});

const postStyles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingBottom: 60,
    borderRadius: 10,
    // backgroundColor: Colors.ui.background,
    // ...GlobalStyles.expand,
    minHeight: 680,
    ...GlobalStyles.shadow,
  },
  title: {
    margin: 12,
    fontSize: FontSizes.xLarge,
    ...GlobalStyles.boldText,
  },
  postEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    ...GlobalStyles.expand,
  },
  postEmptyText: {
    fontSize: FontSizes.medium,
    ...GlobalStyles.text,
  },
  postItem: {
    // marginHorizontal: 12,
    marginVertical: 4,
    padding: 12,
    borderRadius: 5,
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.shadow,
  },
  postText: {
    color: Colors.text.black,
    fontSize: FontSizes.large,
    fontWeight: 600,
    marginBottom: 8,
  },
});

export default PostListScreen;
