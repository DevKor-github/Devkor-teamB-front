import {API_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Comment, Post, UserInfo} from '@src/Types';
import {Alert} from 'react-native';

export const fetchComments = async (postId: number): Promise<Comment[]> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('User token not found');
    }

    const response = await axios.get(`${API_URL}/comments/`, {
      params: {post_id: postId},
      headers: {
        authorization: `token ${token}`,
      },
    });

    const commentIds = response.data.map((comment: any) => comment.id);

    const contentPromises = commentIds.map(async (commentId: number) => {
      const commentResponse = await axios.get(
        `${API_URL}/comments/${commentId}/`,
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      );

      const fetchedComment: Comment = {
        commentId: commentResponse.data.id,
        author: commentResponse.data.author.nickname,
        content: commentResponse.data.content,
        date: commentResponse.data.created_at,
        updatedDate: commentResponse.data.updated_at,
        isChosen: commentResponse.data.is_chosen,
        postId: commentResponse.data.parent_post.id,
        authorId: commentResponse.data.author.id,
        postTitle: commentResponse.data.postTitle,
      };
      return fetchedComment;
    });

    const comments = await Promise.all(contentPromises);
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: number) => {
  const token = await AsyncStorage.getItem('userToken');
  try {
    const response = await axios.delete(`${API_URL}/comments/${commentId}/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    // console.log(response.data)
    if (response.status == 204) {
      Alert.alert('삭제되었습니다', '', [
        {
          text: '확인',
          style: 'cancel',
        },
      ]);
    }
    // console.log('comment deleted')
  } catch (e) {
    console.error(e);
  }
};

export const fetchPost = async (courseId: number) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_URL}/posts/`, {
      params: {
        course_id: courseId,
      },
      headers: {
        authorization: `token ${token}`,
      },
    });

    const fetchedPosts: any[] = response.data || [];
    return fetchedPosts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return null;
  }
};

export const fetchPostInfo = async (postId: number) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_URL}/posts/${postId}/`, {
      headers: {
        authorization: `token ${token}`,
      },
    });
    const data = response.data;
    const newPost: Post = {
      id: data.id,
      title: data.title,
      author: new UserInfo(
        data.author.id,
        data.author.nickname,
        data.author.profileImage,
      ),
      postDate: data.created_at,
      views: data.views,
      likes: data.likes,
      reports: data.reports,
      content: data.content,
      attachments: data.attachment,
      tags: data.tags,
      liked: data.liked,
      scraped: data.scraped,
    };
    return newPost;
  } catch (error) {
    console.error('Error fetching post info:', error);
    return null;
  }
};
