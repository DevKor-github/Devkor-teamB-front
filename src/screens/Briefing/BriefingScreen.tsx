import {View, Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import { useEffect } from 'react';
import React from 'react';
import ProgressBar from '@components/ProgessBar';
import {Lecture} from '@src/Types';
import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';

const BriefingHeader = ({text,lectureName}:{text: any,lectureName:any}) => {
  return (
    <View style={headerStyle.container}>
      <Text style={headerStyle.title}>{text}</Text>
    </View>
  );
};

const BriefingProgressBar = ({imgsource, progress, lectureName, text}: {imgsource: any, progress: number, lectureName:any, text:any}) => {
  return (
    <View style={[styles.item,{...GlobalStyles.row}]}>
      <Image
        source={imgsource}
        style={styles.icon}
      />
      <View style={styles.progresscontainer}>
        <View style={styles.textcontainer}>
          <Text style={styles.text}>오늘 {lectureName}을 들은 </Text>
          <Text style={{...GlobalStyles.boldText,color:Colors.primary[500]}}>{progress}</Text>
          <Text style={styles.text}>%의 학생이</Text>
        </View>
        <ProgressBar progress={progress}>
          <View style={GlobalStyles.row}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </ProgressBar>
      </View>
    </View>
  );
};



interface BriefingScreenProps {
  route: any;
  navigation: any;
}

const BriefingScreen: React.FC<BriefingScreenProps> = ({route,navigation,}) => {
  const lectureName=route.params.lectureName;

  const handleBriefingAnswer = () => {
    Alert.alert('브리핑 답변하기');
    // 설문 추가 필요
  };

  useEffect(() => {
    navigation.setOptions({title: `${lectureName}`});
  }, [navigation]);

  return (
    <View style={{margin:10}}>
      <View style={styles.container}>
        <BriefingHeader text='오늘의 브리핑' lectureName={lectureName}/>
        <BriefingProgressBar 
          imgsource={require('@assets/icons/briefing_calendar.png')} 
          progress={Math.floor(route.params.attendance)} 
          lectureName={lectureName}
          text='출석체크를 진행했다고 답변했어요'
        />
        <BriefingProgressBar 
          imgsource={require('@assets/icons/briefing_book.png')} 
          progress={Math.floor(route.params.assignment)} 
          lectureName={lectureName}
          text='과제가 있었다고 답변했어요'
        />
        <BriefingProgressBar 
          imgsource={require('@assets/icons/briefing_bell.png')} 
          progress={Math.floor(route.params.notification)} 
          lectureName={lectureName}
          text='공지가 있었다고 답변했어요'
        />
      </View>
      <View style={[styles.container,{marginTop:15}]}>
        <BriefingHeader text='내가 답변한 브리핑' lectureName={lectureName}/>
        <View style={[styles.item,{alignItems:'center',paddingVertical:12,backgroundColor:Colors.primary[50]}]}>
          <Text style={{color: Colors.primary[500],marginBottom:5,fontSize:11}}>아직 {lectureName}의 브리핑을 답변하지 않았어요</Text>
          <TouchableOpacity style={styles.button_Blur} onPress={handleBriefingAnswer}>
            <Text style={styles.buttonText_Blur}>답변하고 포인트 받기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const headerStyle = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    ...GlobalStyles.row,
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
    width: '100%',
    alignSelf: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    ...GlobalStyles.shadow,
    gap:12
  },
  progresscontainer: {
    width: 260,
  },
  textcontainer: {
    marginLeft: 12,
    marginBottom: 4,
    ...GlobalStyles.row
  },
  item: {
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#CDCDCD66',
    borderRadius: 5,
  },
  text: {
    fontSize: FontSizes.medium,
    ...GlobalStyles.text
  },
  icon: {
    width: 41, 
    height: 41, 
    marginLeft: 12,
    marginRight: 6,
    borderRadius:20,
    marginVertical: 'auto'
  },
  button_Blur: {
    backgroundColor: '#FF1485',
    margin: 'auto',
    borderRadius: 10,
    width: 130,
    height: 20,
  },
  buttonText_Blur: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
    margin: 'auto'
  },
});

export default BriefingScreen;
