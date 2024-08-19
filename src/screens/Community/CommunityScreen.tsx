import React, {useState, useLayoutEffect, useEffect} from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Post, UserInfo, CourseBlock, PostMinimal, PostMinimalData} from '@src/Types';
import DailyBriefingWidget from '@screens/Community/DailyBriefingWidget';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import Colors from '@src/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import FloatingButton from '@src/components/FloatingButton';
import * as Animatable from 'react-native-animatable'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {setNavigationHeader} from '@src/navigator/TimetableNavigator';

interface CommunityScreenProps {
  route: any;
  navigation: any;
}

const PostItem = ({post, lectureName}: {post: Post; lectureName: string}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [fetchedPost, setFetchedPost] = useState<Post>();

  useEffect(()=>{
    fetchPostInfo(post.postId)
  },[])

  const fetchPostInfo = async (postId:number) => {
    const API_URL = "http://3.37.163.236:8000/"
    try{
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(`${API_URL}/posts/${postId}/`,
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      );
      // console.log('포스트!!!')
      // console.log('response:',response.data)
      const data = response.data
      const newPost : Post = {
        postId: data.id,
        title: data.title,
        author: new UserInfo(
          data.author.id,
          data.author.nickname,
          'https://example.com/image3.jpg', //하드코딩
        ),
        postDate: data.created_at,
        views: data.views,
        likes: data.likes,
        reports: data.reports,
        content: data.content,
        attachments: data.attachment,
        tags: data.tags,
      }
      setFetchedPost(newPost)
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  const handleNavigate = () => {
    navigation.navigate('PostScreen',{
      post: fetchedPost,
      lecture: lectureName,
    })
  }

  return (
    <TouchableOpacity
      style={postStyles.postItem}
      onPress = {handleNavigate}
      >
      <View style={{...GlobalStyles.row, justifyContent: 'space-between', alignItems: 'center'}}>
        {/* <Text style={[postStyles.postText, {color: Colors.primary[500]}]}>Q.</Text> */}
        <Text style={postStyles.postText}>{post.title}</Text>
        <Text style={{color: "#666", fontSize: 12,marginTop: 3,justifyContent: 'center'}}>
          {fetchedPost?fetchedPost.postDate.substring(0,10):null}
        </Text>
      </View>
      
    </TouchableOpacity>
  );
};

const PostView = ({ items, id, lectureName, course}: { items: Post[]; id: number; lectureName: string; course: CourseBlock}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isFabOpen, setFabOpen] = useState(false);
 
  useEffect(()=>{
    console.log('postview:',items)
    console.log(lectureName)
  },[])

  const handlePressMore = () => {
    navigation.navigate('PostListScreen', {
      lectureName: lectureName,
      id: id,
      items: items,
    });
  };

  const handlePressPlus = () => {
    console.log(isFabOpen);
    setFabOpen(!isFabOpen);
  };

  const handleNavigate = (screen: string) => {
    setFabOpen(false);
    console.log(id, lectureName)
    if(screen=='BriefingScreen'){
      navigation.navigate(screen, {course:course})
    }
    navigation.navigate(screen, { lectureId: id, lectureName: lectureName});
  };

  return (
    <View style={postStyles.container}>
      <View style={headerStyle.container}>
        <Text style={headerStyle.title}>{lectureName} 게시글 미리보기</Text>
        <TouchableOpacity style={{marginVertical: 'auto'}} onPress={handlePressMore}>
          <View style={GlobalStyles.row}>
            <Text style={headerStyle.more}>자세히 보기</Text>
            <Image
              style={headerStyle.arrow}
              source={require('@assets/icons/arrow_right.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
      {items.length===0 ? (
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
      <FloatingButton onPress={handlePressPlus}>
        <Icon name="plus" size={24} color={Colors.ui.background} />
      </FloatingButton>

      <Modal
        visible={isFabOpen}
        transparent={true}
        onRequestClose={handlePressPlus}>
        <TouchableOpacity
          onPressOut={() => setFabOpen(false)}
          activeOpacity={1}
          style={styles.overlay}>
          <Animatable.View
            duration={500}
            style={{width: 70}}
            // style={[styles.fabOption, { bottom: 80 }]}
          >
            <TouchableOpacity
              onPress={() => handleNavigate('PostCreationScreen')}>
              <Image
                source={require('@assets/icons/create_file.png')}
                style={styles.fabIcon}
              />
              <Text style={styles.fabText}>게시글 작성</Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View
            duration={500}
            style={{width: 70}}
          >
            <TouchableOpacity onPress={() => handleNavigate('BriefingScreen')}>
              <Image
                source={require('@assets/icons/faq.png')}
                style={styles.fabIcon}
              />
              <Text style={styles.fabText}>브리핑 답변</Text>
            </TouchableOpacity>
          </Animatable.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};



const CommunityScreen: React.FC<CommunityScreenProps> = ({ route, navigation,}) => {
  const {course}: {course: CourseBlock} = route.params;
  const [posts, setPosts] = useState<Post[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    // console.log('course_fk:',course.id) // course_fk
    // console.log('course_name: ',course.course_name)
    fetchPost();
  },[isFocused]);

  useLayoutEffect(() =>
    setNavigationHeader(navigation, [course.course_name, course.instructor]),
    [course, navigation],
  );

  const fetchPost = async ()=>{
    const API_URL = "http://3.37.163.236:8000/"
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(`${API_URL}/posts/`, 
        {
          params: {
            course_id: course.course_id
          },
          headers: {
            authorization: `token ${token}`,
          },
        },
      );
      // console.log(response.data)
      const fetchedPosts: Post[] = response.data
        .map((data:any)=>({
          postId: data.id,
          title: data.title,
        }))
      setPosts(fetchedPosts)
      console.log('포스트:',fetchedPosts)
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <DailyBriefingWidget course={course} />
      <PostView
        items={posts}
        id={course.id}
        lectureName={course.course_name}
        course={course}
      />
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    ...GlobalStyles.row,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: 600,
    gap: 80,
  },
  fabOption: {
    position: 'absolute',
    backgroundColor: 'pink',
    right: 20,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    ...GlobalStyles.shadow,
    backgroundColor: 'gray',
  },
  fabText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
    color: Colors.text.white,
    alignSelf: 'center',
    ...GlobalStyles.text,
  },
});

const postStyles = StyleSheet.create({
  container: {
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.expand,
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F6F2F4",
  },
  postText: {
    color: Colors.text.black,
    fontSize: FontSizes.medium,
    fontWeight: 400,
  },
});

export default CommunityScreen;
