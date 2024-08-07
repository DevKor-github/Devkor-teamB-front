import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal} from 'react-native';
import {mockPosts, mockLectures} from '@src/MockData';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Lecture, Post} from '@src/Types';
import DailyBriefingWidget from '@screens/Community/DailyBriefingWidget';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import Colors from '@src/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import FloatingButton from '@src/components/FloatingButton';
import * as Animatable from 'react-native-animatable'


interface CommunityScreenProps {
  route: any;
  navigation: any;
}

const PostItem = ({post, lectureName}: {post: Post, lectureName: string}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <TouchableOpacity
      style={postStyles.postItem}
      onPress={() => navigation.navigate('PostScreen', {post: post, lectureName: lectureName})}>
      <View style={{...GlobalStyles.row,gap:5}}>
        <Text style={[postStyles.postText,{color: Colors.primary[500]}]}>Q.</Text>
        <Text style={postStyles.postText}>{post.title}</Text>
      </View>
      <Text style={{color:Colors.text.lightgray,marginTop:3}}>{post.postDate}</Text>
    </TouchableOpacity>
  );
};

const PostView = ({items, id, lectureName}: {items: Post[]; id: string, lectureName: string}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isFabOpen, setFabOpen] = useState(false);

  const handlePressMore = () => {
    console.log(lectureName)
    navigation.navigate('PostListScreen', {lectureName: lectureName, id: id, items: items})
  }

  const handlePressPlus = () => {
    // navigation.navigate('PostCreationScreen', {lectureId: id});
    console.log(isFabOpen)
    setFabOpen(!isFabOpen);
  }

  const handleNavigate = (screen: string) => {
    setFabOpen(false);
    navigation.navigate(screen, { lectureId: id, lectureName: lectureName});
  };

  return (
    <View style={postStyles.container}>
      <View style={headerStyle.container}>
        <Text style={headerStyle.title}> 게시글 목록</Text>
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
          renderItem={({item}: {item: Post}) => <PostItem post={item} lectureName={lectureName}/>}
        />
      )}
      <FloatingButton
        onPress={handlePressPlus}>
        <Icon name="plus" size={24} color={Colors.ui.background} />
      </FloatingButton>

      <Modal
        visible={isFabOpen}
        transparent={true}
        onRequestClose={handlePressPlus}>
        <TouchableOpacity
          onPressOut={()=>setFabOpen(false)}
          activeOpacity={1}
          style={styles.overlay}>
          <Animatable.View
            duration={500}
            style={{width:70}}
            // style={[styles.fabOption, { bottom: 80 }]}
          >
            <TouchableOpacity 
              onPress={() => handleNavigate('PostCreationScreen')}
            >
              <Image 
                source={require('@assets/icons/create_file.png')} 
                style={styles.fabIcon}>  
              </Image>
              <Text style={styles.fabText}>게시글 작성</Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View
            duration={500}
            style={{width:70}}
            // style={[styles.fabOption, { bottom: 140 }]}
          >
            <TouchableOpacity onPress={() => handleNavigate('BriefingScreen')}>
            <Image 
                source={require('@assets/icons/faq.png')} 
                style={styles.fabIcon}>  
              </Image>
              <Text style={styles.fabText}>브리핑 답변</Text>
            </TouchableOpacity>
          </Animatable.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const CommunityScreen: React.FC<CommunityScreenProps> = ({route,navigation,}) => {
  const {id} = route.params;
  const communities = mockPosts;
  const lecture = mockLectures.find((e: Lecture) => e.id === id) as Lecture;

  useEffect(() => {
    navigation.setOptions({title: `${lecture.name} 게시판`});
  }, [lecture, communities, navigation]);
  

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <DailyBriefingWidget lecture={lecture} />
      <PostView items={communities.get(id) as Post[]} id={lecture.id} lectureName={lecture.name}/>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    ...GlobalStyles.row,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', 
    justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: 600,
    gap:80,
  },
  fabOption: {
    position: 'absolute',
    backgroundColor:'pink',
    right: 20,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabIcon: {
    width:70,
    height:70,
    borderRadius:35,
    ...GlobalStyles.shadow,
    backgroundColor: 'gray'
  },
  fabText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
    color: Colors.text.white,
    alignSelf: 'center',
    ...GlobalStyles.text,
  }
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
