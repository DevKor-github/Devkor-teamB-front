import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Color} from '../../component/Color';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomSheet from '../../component/BottomSheet';
import FloatingButton from '../../component/FloatingButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import {mockRegisterLectures} from '../../MockUserData';
import {RadioButton, RadioGroup} from '../../component/RadioButton';
import SearchBar from '../../component/SearchBar';
import {Lecture} from '../timetable/TimetableTypes';
import Timetable from '../../component/Timetable';

const LectureAddButton = ({onPress}: {onPress: Function}) => {
  return (
    <TouchableOpacity style={buttonStyle.container} onPress={() => onPress()}>
      <View style={buttonStyle.button}>
        <Text style={buttonStyle.text}>추가</Text>
      </View>
    </TouchableOpacity>
  );
};

const LectureItemContainer = ({
  item,
  onItemAdd,
}: {
  item: Lecture;
  onItemAdd: Function;
}) => {
  return (
    <View style={itemStyle.container}>
      <View style={itemStyle.row}>
        <Text style={itemStyle.courseNameText}>{item.name}</Text>
        <Text style={itemStyle.courseMateText}>함께 듣는 사람 {item.mate}</Text>
      </View>
      <View style={itemStyle.courseInfoRow}>
        <View style={itemStyle.flex}>
          <Text style={itemStyle.lecturerText}>{item.professor}</Text>
          <View style={itemStyle.row}>
            <Text style={itemStyle.courseInfoText}>{item.timeInfo}</Text>
            <Text style={itemStyle.courseInfoText}>{item.room}</Text>
          </View>
          <View style={itemStyle.row}>
            <Text style={itemStyle.courseInfoText}>{item.type}</Text>
            <Text style={itemStyle.courseInfoText}>{item.credit}</Text>
            <Text style={itemStyle.courseInfoText}>{item.id}</Text>
          </View>
        </View>
        <LectureAddButton onPress={() => onItemAdd(item)} />
      </View>
    </View>
  );
};

function LectureItemList({
  lectures,
  onItemAdd,
}: {
  lectures: any;
  onItemAdd: Function;
}) {
  return (
    <FlatList
      data={lectures}
      renderItem={e => (
        <LectureItemContainer item={e.item} onItemAdd={onItemAdd} />
      )}
      keyExtractor={(item, idx) => `${idx}${item.id}`}
    />
  );
}

function RegistrationBody() {
  const modalPadding = 16;
  const [contentHeight, setContentHeight] = useState(0);
  const [filterOption, setFilterOption] = useState(0);
  const [query, setQuery] = useState('');
  const [lectures, setLecures] = useState([] as Lecture[]);

  return (
    <View>
      <View onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
        <Timetable
          lectures={lectures}
          onPress={(id: string) => {
            // 삭제 여부를 물어보는 팝업 추가
            const updatedLectures = lectures.filter(e => e.id !== id);
            setLecures(updatedLectures);
          }}
        />
        <FloatingButton onPress={() => {}}>
          <Icon name="plus" size={24} color={Color.ui.onPrimary} />
        </FloatingButton>
      </View>
      <BottomSheet minHeight={contentHeight + modalPadding}>
        <SearchBar
          placeholder={'강의 찾기'}
          text={query}
          onChangeText={setQuery}
          onSubmit={() => {}}
        />
        <RadioGroup option={filterOption} onPress={setFilterOption}>
          <RadioButton label="과목명" />
          <RadioButton label="교수명" />
          <RadioButton label="과목코드" />
        </RadioGroup>
        <LectureItemList
          lectures={mockRegisterLectures}
          onItemAdd={(item: Lecture) => {
            if (!lectures.find(e => e.id === item.id)) {
              setLecures([...lectures, item]);
            }
          }}
        />
      </BottomSheet>
    </View>
  );
}

function RegistrationHeader({subTitle}: {subTitle: string}) {
  return (
    <View style={style.headerRow}>
      <Text style={style.headerTitle}>KU&A</Text>
      <Text style={style.headerSubTitle}>{subTitle}</Text>
    </View>
  );
}

function RegistrationScreen() {
  return (
    <>
      <SafeAreaView edges={['top']} style={style.topSafeArea} />
      <SafeAreaView edges={['bottom']} style={style.bottomSafeArea}>
        <View style={style.topContainer} />
        <View style={style.bottomContainer} />
        <View style={style.contentContainer}>
          <RegistrationHeader subTitle={'2024학년도 1학기'} />
          <RegistrationBody />
        </View>
      </SafeAreaView>
    </>
  );
}

const itemStyle = StyleSheet.create({
  row: {flexDirection: 'row'},
  flex: {flex: 1},
  container: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    borderColor: Color.ui.disabled,
    justifyContent: 'flex-end',
  },
  courseNameText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.text.default,
  },
  courseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  lecturerText: {
    fontSize: 12,
    marginVertical: 4,
    color: Color.text.default,
  },
  courseInfoText: {
    fontSize: 12,
    color: Color.text.placeholder,
    marginTop: 4,
    marginRight: 8,
    textAlignVertical: 'center',
  },
  courseMateText: {
    fontSize: 12,
    color: Color.text.placeholder,
  },
});

const buttonStyle = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: Color.ui.primary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  text: {
    color: Color.text.onPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

const style = StyleSheet.create({
  row: {flexDirection: 'row'},
  topSafeArea: {
    flex: 0,
    backgroundColor: Color.ui.primary,
  },
  bottomSafeArea: {
    flex: 1,
    backgroundColor: Color.ui.background,
  },
  topContainer: {
    flex: 2,
    backgroundColor: Color.ui.primary,
  },
  bottomContainer: {
    flex: 5,
    backgroundColor: Color.ui.background,
  },
  contentContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 32,
    color: Color.ui.onPrimary,
  },
  headerSubTitle: {
    fontSize: 20,
    color: Color.text.onPrimary,
  },
});

export default RegistrationScreen;
