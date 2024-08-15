import React, {useState, useLayoutEffect, useEffect} from 'react';
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
import {Post, UserInfo, CourseMinimal, Lecture} from '@src/Types';
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
import axios from 'axios';

interface CommunityScreenProps {
  route: any;
  navigation: any;
}

const PostItem = ({post, lectureName}: {post: Post; lectureName: string}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [fetchedPost, setFetchedPost] = useState<Post>();

  useEffect(()=>{
    // console.log(post.postId)
    fetchPostInfo(post.postId)
    // console.log(fetchedPost)
  },[])

  const fetchPostInfo = async (postId:number) => {
    const API_URL = "http://15.165.198.75:8000"
    try{
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(`${API_URL}/posts/${postId}/`,  // 5, 8, 9가 테스트게시글
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
          'user_07',
          'Carol Davis',
          'https://example.com/image3.jpg',
        ),
        postDate: data.created_at,
        view: 10,
        content: data.content,
        images : data.attached_file,
        files: data.attached_file,
        tags: data.tags,
      }
      console.log('newpost:',newPost)
      setFetchedPost(newPost)
      // console.log(newPost.title)
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  const handleNavigate = () => {
    console.log(fetchedPost)
    console.log(lectureName)
    navigation.navigate('PostScreen',{
      post: fetchedPost,
      lecture: lectureName,
    })
  }

  return (
    <TouchableOpacity
      style={postStyles.postItem}
      // onPress={() =>
      //   navigation.navigate('PostScreen', {
      //     post: fetchedPost,
      //     lectureName: lectureName,
      //   })}
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

const PostView = ({ items, id, lectureName,}: { items: Post[]; id: string; lectureName: string;}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isFabOpen, setFabOpen] = useState(false);
 
  const handlePressMore = () => {
    console.log(lectureName);
    navigation.navigate('PostListScreen', {
      lectureName: lectureName,
      id: id,
      items: items,
    });
  };

  const handlePressPlus = () => {
    // navigation.navigate('PostCreationScreen', {lectureId: id});
    console.log(isFabOpen);
    setFabOpen(!isFabOpen);
  };

  const handleNavigate = (screen: string) => {
    setFabOpen(false);
    console.log(id, lectureName)
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
            // style={[styles.fabOption, { bottom: 140 }]}
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



// 여기 조금 수정했어!
const CommunityScreen: React.FC<CommunityScreenProps> = ({
  route,
  navigation,
}) => {
  const {course}: {course: CourseMinimal} = route.params;
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const API_URL = 'http://15.165.198.75:8000';
      const USER_TOKEN = 'd9af3812b659426945446564d4529d77925cea55';
      try {
        const response = await axios.get(`${API_URL}/posts/`, {
          params: {
            course_index: course.id,
          },
          headers: {
            authorization: `token ${USER_TOKEN}`,
          },
        });
        //setPosts(response.data)
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  });
  useLayoutEffect(
    () =>
      setNavigationHeader(navigation, [course.course_name, course.instructor]),
    [course, navigation],
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <DailyBriefingWidget course={course} />
      <PostView
        items={posts}
        id={course.course_id}
        lectureName={course.course_name}
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
