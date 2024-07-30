import React, {useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {mockPosts, mockLectures} from '@src/MockData';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Lecture, Post} from '@src/Types';
import DailyBriefingWidget from '@screens/Community/DailyBriefingWidget';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import Colors from '@src/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import FloatingButton from '@src/components/FloatingButton';
import Icon from 'react-native-vector-icons/Octicons';

interface CommunityScreenProps {
  route: any;
  navigation: any;
}

const PostItem = ({post}: {post: Post}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <TouchableOpacity
      style={postStyles.postItem}
      onPress={() => navigation.navigate('PostScreen', {post: post})}>
      <View>
        <Text style={postStyles.postText}>Q. {post.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const PostView = ({items, id}: {items: Post[]; id: string}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <View style={postStyles.container}>
      <Text style={postStyles.title}> 오늘의 수업 게시글 </Text>
      {items === undefined ? (
        <View style={postStyles.postEmpty}>
          <Text style={postStyles.postEmptyText}>아직 게시물이 없습니다</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={({item}: {item: Post}) => <PostItem post={item} />}
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

const CommunityScreen: React.FC<CommunityScreenProps> = ({
  route,
  navigation,
}) => {
  const {id} = route.params;
  const communities = mockPosts;
  const lecture = mockLectures.find((e: Lecture) => e.id === id) as Lecture;

  useEffect(() => {
    navigation.setOptions({title: `${lecture.name}`});
  }, [lecture, communities, navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <DailyBriefingWidget lecture={lecture} />
      <PostView items={communities.get(id) as Post[]} id={lecture.id} />
    </SafeAreaView>
  );
};

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

export default CommunityScreen;
