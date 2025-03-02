import {Text, View, ScrollView} from 'react-native';
import {useEffect, useState} from 'react';
import {API_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PostItem} from '../Post/PostListScreen';
import {Post, UserInfo} from '@src/Types';
import {postStyles} from '../Post/PostListScreen';

type MyPost = {
  post: Post;
  course: {
    course_id: string;
    course_name: string;
    id: number;
  };
};

const MyPostScreen = () => {
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoding] = useState(true);
  const [groupedPosts, setGroupedPosts] = useState<Record<string, MyPost[]>>(
    {},
  );

  const fetchPostDetails = async (postId: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/posts/${postId}/`, {
        headers: {
          authorization: `token ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      console.error(`Failed to fetch post ${postId}`, e);
      return null;
    }
  };

  const fetchMyPost = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.get(`${API_URL}/posts/my/`, {
        headers: {
          authorization: `token ${token}`,
        },
      });
      const fetchedPosts = response.data.posted;
      const detailedPosts = await Promise.all(
        fetchedPosts.map(async (post: any) => {
          const details = await fetchPostDetails(post.id);
          return details ? {...post, ...details} : post;
        }),
      );

      const formattedPosts: MyPost[] = detailedPosts.map((item: any) => ({
        post: {
          id: item.id,
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
          content: item.content,
          attachments: item.attachment,
          tags: item.tags,
          liked: item.liked,
          scraped: item.scraped,
        },
        course: item.course,
      }));
      setPosts(formattedPosts);
      setLoding(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMyPost();
  }, []);

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
    <ScrollView style={{backgroundColor: 'white', minHeight: 800}}>
      {loading && (
        <View>
          <Text>Loading..</Text>
        </View>
      )}
      {!loading &&
        Object.entries(groupedPosts).map(([courseName, posts], index) => (
          <View key={index}>
            <Text style={postStyles.title}>{courseName}</Text>

            {posts.map((post, postIndex) => (
              <View
                key={`${index}-${post.post.id}`}
                style={{
                  marginVertical: 4,
                  paddingHorizontal: 12,
                }}>
                <PostItem post={post.post} lectureName={courseName} />
              </View>
            ))}
          </View>
        ))}
    </ScrollView>
  );
};

export default MyPostScreen;
