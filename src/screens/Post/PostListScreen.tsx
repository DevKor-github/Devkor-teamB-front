import React, {useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {mockPosts, mockLectures} from '@src/MockData';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Lecture, Post} from '@src/Types';
import DailyBriefingWidget from '@screens/Community/DailyBriefingWidget';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import Colors from '@src/Colors';
import { tagColors } from '@src/MockData';
import {SafeAreaView} from 'react-native-safe-area-context';
import FloatingButton from '@src/components/FloatingButton';
import Icon from 'react-native-vector-icons/Octicons';

interface CommunityScreenProps {
  route: any;
  navigation: any;
}



const PostItem = ({post, lectureName}: {post: Post, lectureName: string}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(()=>{
    console.log(post.tags)
  })

  return (
    <TouchableOpacity
      style={postStyles.postItem}
      onPress={() => navigation.navigate('PostScreen', {post: post, lectureName: lectureName})}>
      <View style={{...GlobalStyles.row,gap:5}}>
        <Text style={[postStyles.postText,{color: Colors.primary[500]}]}>Q.</Text>
        <Text style={postStyles.postText}>{post.title}</Text>
      </View>
      <Text style={{color:Colors.text.lightgray,marginVertical:3}}>{post.postDate}</Text>
      <View style={{...GlobalStyles.row,gap:10}}>
        {post.tags.map(tag => (
            <View style={{backgroundColor:tagColors[tag.id],borderRadius:12,paddingHorizontal:8,paddingVertical:3}}>
                <Text style={{...GlobalStyles.text,fontSize:12,}}>#{tag.name}</Text>
            </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const PostView = ({items, id, lectureName}: {items: Post[]; id: string, lectureName: string}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <View style={postStyles.container}>
      <View style={headerStyle.container}>
        <Text style={headerStyle.title}> 게시글 목록</Text>
      </View>
      {items === undefined ? (
        <View style={postStyles.postEmpty}>
          <Text style={postStyles.postEmptyText}>아직 게시물이 없습니다</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={({item}: {item: Post}) => <PostItem post={item} lectureName={lectureName}/>}
        />
      )}

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
    backgroundColor: Colors.ui.background,
    padding: 12,
    ...GlobalStyles.expand,
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
    marginHorizontal: 12,
    marginVertical: 4,
    padding: 12,
    borderRadius: 5,
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.shadow,
  },
  postText: {
    color: Colors.text.black,
    fontSize: FontSizes.large,
    ...GlobalStyles.boldText,
  },
});

export default PostListScreen;
