import { View } from "react-native";
import { Text } from "react-native-animatable";
import { useEffect, useState } from "react";
import {API_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Comment, Post, UserInfo } from "@src/Types";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import Colors from '@src/Colors';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';


type MyComment = {
  comment: Comment,
  course: {
    course_id: string;
    course_name: string;
  };
};

const MyCommentScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [comments, setComments] = useState<MyComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommentDetails = async (commentId: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(`${API_URL}/comments/${commentId}/`,
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      );
      // console.log('detail:',response.data)
      return response.data; 
    } catch (e) {
      console.error(`Failed to fetch comment ${commentId}`, e);
      return null; 
    }
  }


  const fetchMyComment = async () => {
    const token = await AsyncStorage.getItem('userToken')
    try{
      const response = await axios.get(`${API_URL}/comments/my/`, {
        headers: {
          authorization: `token ${token}`,
        }
      });
      const fetchedComments = response.data.commented;
      console.log(fetchedComments)
      const detailedComments = await Promise.all(
        fetchedComments.map(async (comment: any) => {
          const details = await fetchCommentDetails(comment.id);
          return details ? {...comment, ...details} : comment
        })
      )
      detailedComments.map((item)=>{
        console.log(item)
      })
      const formattedComments: MyComment[] = detailedComments.map((item:any)=>({
        comment: {
          commentId: item.id,
          author: item.author.nickname,
          authorId: item.author.id,
          content: item.content,
          date: item.created_at,
          updatedDate: item.updated_at,
          isChosen: item.is_chosen,
          postId: item.parent_post.id,
          postTitle: item.parent_post.title,
        },
        course: item.course
      }));
      setComments(formattedComments)
      setLoading(false)
    } catch(e){
      console.error(e)
    }
  }

  const handleNavigate = async (comment: MyComment) => {
    console.log('\n\n',comment)
    try{
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(`${API_URL}/posts/${comment.comment.postId}/`, {
        headers: {
          authorization: `token ${token}`,
        }
      });
      const fetchedPost:Post = {
        postId: response.data.id,
        title: response.data.title,
        author: new UserInfo(
          response.data.author.id,
          response.data.author.nickname,
          response.data.author.profileImage
        ),
        postDate: response.data.created_at,
        views: response.data.views,
        likes: response.data.likes,
        reports: response.data.reports,
        content: response.data.content,
        attachments: response.data.attachment,
        tags: response.data.tags,
        liked: response.data.liked
      }
      console.log(fetchedPost)
      navigation.navigate('PostScreen', {post: fetchedPost, lecture: comment.course.course_name})
    } catch(e){
      console.error(e)
    }
  }

  useEffect(()=>{
    fetchMyComment()
  },[])

  return (
    <ScrollView style={{backgroundColor:Colors.ui.background}}> 
      { !(loading) && comments && comments.map((comment: MyComment)=>(
        <TouchableOpacity
          style={{
            backgroundColor:Colors.ui.background,
            marginTop:10,
            marginHorizontal:10,
            padding:12,
            borderRadius: 5,
            ...GlobalStyles.shadow
          }}
          onPress={()=>handleNavigate(comment)}
        >
          <View style={{marginBottom:10}}>
            <Text
              style={{fontSize:FontSizes.large}}
            >{comment.comment.content}</Text>
          </View>
          <View>
            
          </View>
          <View style={{...GlobalStyles.row,justifyContent:'space-between'}}>
            <Text
              style={{...GlobalStyles.text, fontSize:FontSizes.regular, color:Colors.text.lightgray}}
            >{comment.comment.date.split('T')[0]}</Text>
            <Text
              style={{...GlobalStyles.text, fontSize:FontSizes.regular, color:Colors.text.lightgray}}
            >{comment.comment.postTitle} </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default MyCommentScreen;
