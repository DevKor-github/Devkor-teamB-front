import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {mockCommunities, mockLectures} from '../../MockUserData.tsx';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import FloatingButton from '../../component/FloatingButton.tsx';
import Icon from 'react-native-vector-icons/Octicons';
import { Lecture } from '../Timetable/TimetableTypes.tsx';
import { Post } from './CommunityTypes.tsx';
import TodayBriefingWidget from './TodayBriefingWidget.tsx';
import BottomSheet, {BottomSheetState} from '../../component/BottomSheet.tsx';
import SearchBar from '../../component/SearchBar.tsx';
import { Color } from '../../component/Color.tsx';
import {SafeAreaView} from 'react-native-safe-area-context';

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

const PostBottomSheet = ({height, items}: {height: number; items: Post[]}) => {
  const [query, setQuery] = useState('');

  useEffect(()=>{
    console.log(height)
  },[BottomSheet])

  return (
    <BottomSheet
      minHeight={height}>
      <Text style={bottomSheetStyles.title}> 게시글 </Text>
      <View style={bottomSheetStyles.searchBar}>
        <SearchBar
          text={query}
          placeholder="검색어를 입력해주세요"
          onChangeText={(e: string) => setQuery(e)}
          onSubmit={() => {}}
        />
      </View>
      {items.length===0 && (
        <Text style={{margin:12}}>게시글 없음</Text>
      )}
      <FlatList
        data={items}
        renderItem={({item}: {item: Post}) => <PostItem post={item} />}
        ListFooterComponent={<View style={bottomSheetStyles.footer} />}
      />
    </BottomSheet>
  );
};

const CommunityScreen = ({route,navigation,}: {route: any; navigation: any;}) => {
  const [height, setHeight] = useState(0);

  const {id} = route.params;
  const communities = mockCommunities;
  const lecture = mockLectures.find((e: Lecture) => e.id === id) as Lecture;

  useEffect(() => {
    navigation.setOptions({title: `${lecture.name}`});
    console.log(route)
    console.log(navigation)
  }, [lecture, communities, navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View
        style={styles.breifing}
        onLayout={e => setHeight(e.nativeEvent.layout.height)}>
        <TodayBriefingWidget lecture={lecture} />
      </View>

      <PostBottomSheet
          height={height}
          // items={communities.get(id) as Post[]}
          items={communities.get(id) ? (communities.get(id) as Post[]) : []}
      />
      <View style={{position:'absolute',bottom:-400,right:10}}>
        <FloatingButton 
          onPress={() => {navigation.navigate('PostCreationScreen',{lectureId:lecture.id})}} 
        >
          <Icon name="plus" size={28} color={Color.ui.background} />
        </FloatingButton>
      </View>
    </SafeAreaView>
  );
};

const bottomSheetStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Pretendard',
    color: '#1A1A1A',
    marginHorizontal: 12,
  },
  footer: {
    height: 34,
  },
  searchBar: {
    // marginVertical: 12,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.ui.background,
    
  },
  breifing: {
    padding: 16,
  },
});

const postStyles = StyleSheet.create({
  postItem: {
    marginHorizontal: 12,
    marginVertical: 4,
    padding: 12,
    marginBottom: 4,
    backgroundColor: 'white',
    borderRadius: 5, 
    shadowOpacity: 0.2,
    shadowOffset: {
      width:1, height:0
    },

  },
  postText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CommunityScreen;
