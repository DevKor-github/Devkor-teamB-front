import {API_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Comment } from '@src/Types';
import { Alert } from 'react-native';


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
          isChosen: commentResponse.data.is_chosen,
          postId: commentResponse.data.parent_post.id,
          authorId: commentResponse.data.author.id
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
  const token = await AsyncStorage.getItem('userToken')
  try{
    const response = await axios.delete(`${API_URL}/comments/${commentId}/`,
      {
        headers: {
          authorization: `token ${token}`,
        },
      },
    );
    console.log(response.data)
    if(response.status==204){
      Alert.alert('삭제되었습니다','',[
        {
          text: '확인',
          style: 'cancel'
        }
      ])
    }
    console.log('comment deleted') 
  }
  catch(e){
    console.error(e)
  }
}
