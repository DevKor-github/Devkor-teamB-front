import {API_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Comment } from '@src/Types';


export const fetchComments = async (postId: number): Promise<Comment[]> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('User token not found');
      }
  
      const response = await axios.get(`${API_URL}/comments/`, {
        params: { post_id: postId },
        headers: {
          authorization: `token ${token}`,
        },
      });
  
      const commentIds = response.data.map((comment: any) => comment.id);
  
      const contentPromises = commentIds.map(async (commentId: number) => {
        const commentResponse = await axios.get(`${API_URL}/comments/${commentId}/`, {
          headers: {
            authorization: `token ${token}`,
          },
        });
  
        const fetchedComment: Comment = {
          commentId: commentResponse.data.id,
          author: commentResponse.data.author.nickname,
          content: commentResponse.data.content,
          date: commentResponse.data.created_at,
          updatedDate: commentResponse.data.updated_at,
          isChosen: false,
          postId: commentResponse.data.parent_post.id,
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
