import { Text, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import {API_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostView } from "../Community/CommunityScreen";
import { PostItem } from "../Post/PostListScreen";
import { Post, UserInfo } from "@src/Types";
import { TouchableOpacity } from "react-native-gesture-handler";
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import { postStyles } from "../Post/PostListScreen";

type MyPost = {
  post: Post,
  course: {
    course_id: string;
    course_name: string;
    id: number;
  };
};

const MyPostScreen = () => {
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoding] = useState(true);
  const [groupedPosts, setGroupedPosts] = useState<Record<string, MyPost[]>>({});


  const fetchPostDetails = async (postId: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(`${API_URL}/posts/${postId}/`,
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      );
      // console.log('detail:',response.data)
      return response.data; 
    } catch (e) {
      console.error(`Failed to fetch post ${postId}`, e);
      return null; 
    }
  };

  const fetchMyPost = async () => {
    const token = await AsyncStorage.getItem('userToken')
    try{
      const response = await axios.get(`${API_URL}/posts/my/`, {
        headers: {
          authorization: `token ${token}`,
        }
      });

      const fetchedPosts = response.data;
      const detailedPosts = await Promise.all(
        fetchedPosts.map(async (post: any) => {
          const details = await fetchPostDetails(post.id);
          return details
            ? { ...post, ...details } // ✅ 상세 정보를 합쳐서 새로운 객체 생성
            : post; // ✅ 실패하면 기존 데이터 유지
        })
      );

      const formattedPosts: MyPost[] = detailedPosts.map((item:any)=>({
        post: {
          postId: item.id,
          title: item.title,
          author: new UserInfo(
            item.author.id,
            item.author.nickname,
            item.author.profileImage,
          ),
          postDate: item.created_at,
          views: item.views,
          likes: item.likes,
          reports: item.reports,
          content : item.content,
          attachments: item.attachment,
          tags: item.tags
        },
        course: item.course
      }));

      setPosts(formattedPosts);
      setLoding(false)

    } catch(e){
      console.error(e)
    }
  }
  
  useEffect(()=>{
    fetchMyPost()
  },[])
  
  useEffect(() => {
    const newGroupedPosts = posts.reduce((acc, post) => {
      const courseName = post.course.course_name;
  
      if (!acc[courseName]) {
        acc[courseName] = [];
      }
  
      acc[courseName].push(post);
      return acc;
    }, {} as Record<string, MyPost[]>);
  
    setGroupedPosts(newGroupedPosts);
  }, [posts]);

  return (
    <ScrollView
      style={{backgroundColor:'white',minHeight:800}}
    >
      { loading && (
        <View>
          <Text>Loading..</Text>
        </View>
      )}
      { !(loading) && Object.entries(groupedPosts).map(([courseName, posts],index) => (
          <View 
            key={index}
          >
            <Text 
              style={postStyles.title}
            >
              {courseName}
            </Text>
            
            {posts.map((post, postIndex) => (
              <View
                style={{
                  marginVertical: 4,
                  paddingHorizontal:12,
                }}
              >
                <PostItem 
                  key={postIndex}
                  post={post.post}
                  lectureName={courseName}
                />
              </View>
            ))}
          </View>
        ))}
    </ScrollView>
  );
}

export default MyPostScreen;