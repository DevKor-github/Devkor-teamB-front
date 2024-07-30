import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '@src/Colors';
import BottomSheet, {BottomSheetState} from '@components/BottomSheet';
import FloatingButton from '@components/FloatingButton';
import Icon from 'react-native-vector-icons/Octicons';
import {mockLectures} from '@src/MockData';
import {RadioButton, RadioGroup} from '@components/RadioButton';
import SearchBar from '@components/SearchBar';
import {Lecture} from '@src/Types';
import Timetable from '@components/Timetable/Timetable';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {doesOverlap} from '@components/Timetable/TimetableUtils';
import {SafeAreaView} from 'react-native-safe-area-context';

type NavigationProps = StackNavigationProp<any>;

const LectureAddButton = ({onPress}: {onPress: Function}) => {
  return (
    <TouchableOpacity
      style={buttonStyles.addButtonContainer}
      onPress={() => onPress()}>
      <View style={buttonStyles.addButton}>
        <Text style={buttonStyles.addButtonText}>추가</Text>
      </View>
    </TouchableOpacity>
  );
};

const LectureItem = ({
  item,
  onItemAdd,
  selected,
}: {
  item: Lecture;
  onItemAdd: Function;
  selected: boolean;
}) => {
  return (
    <View
      style={selected ? itemStyles.selectedContainer : itemStyles.container}>
      <View>
        <View style={GlobalStyles.row}>
          <Text style={itemStyles.courseName}>{item.name}</Text>
          <Text style={itemStyles.courseMate}>함께 듣는 사람 {item.mate}</Text>
        </View>
        <Text style={itemStyles.lecturer}>{item.professor}</Text>
      </View>
      <View style={GlobalStyles.row}>
        <View style={GlobalStyles.expand}>
          <View style={GlobalStyles.row}>
            <Text style={itemStyles.courseInfo}>{item.timeInfo}</Text>
            <Text style={itemStyles.courseInfo}>{item.room}</Text>
          </View>
          <View style={GlobalStyles.row}>
            <Text style={itemStyles.courseInfo}>{item.type}</Text>
            <Text style={itemStyles.courseInfo}>{item.credit}</Text>
            <Text style={itemStyles.courseInfo}>{item.id}</Text>
          </View>
        </View>
        {selected && <LectureAddButton onPress={() => onItemAdd(item)} />}
      </View>
    </View>
  );
};

const LectureList = ({
  items,
  onItemAdd,
  onTap,
}: {
  items: Lecture[];
  onItemAdd: Function;
  onTap: Function;
}) => {
  const [index, setIndex] = useState(-1);
  const onPress = (e: any) => {
    setIndex(e.index === index ? -1 : e.index);
    onTap(e.index === index ? undefined : e.item);
  };

  return (
    <FlatList
      data={items}
      showsVerticalScrollIndicator={false}
      renderItem={e => (
        <TouchableOpacity onPress={() => onPress(e)}>
          <LectureItem
            item={e.item}
            selected={e.index === index}
            onItemAdd={(item: Lecture) => {
              setIndex(-1);
              onTap(undefined);
              onItemAdd(item);
            }}
          />
        </TouchableOpacity>
      )}
      ListFooterComponent={<View style={itemStyles.listFooter} />}
      keyExtractor={(item, idx) => `${idx}${item.id}`}
    />
  );
};

const CompleteButton = ({disabled}: {disabled: boolean}) => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => navigation.reset({routes: [{name: 'Home'}]})}
      style={buttonStyles.completeButtonContainer}>
      <View
        style={[
          disabled ? buttonStyles.deactivated : buttonStyles.activated,
          buttonStyles.completeButton,
        ]}>
        <Text style={buttonStyles.completeButtonText}>완료</Text>
      </View>
    </TouchableOpacity>
  );
};

const RegistrationBottomSheet = ({
  state,
  onStateChange,
  onItemAdd,
  onItemSelect,
  height,
}: {
  state: BottomSheetState;
  onStateChange: Function;
  onItemAdd: Function;
  onItemSelect: Function;
  height: number;
}) => {
  const [filterOption, setFilterOption] = useState(0);
  const [query, setQuery] = useState('');

  return (
    <BottomSheet height={height} state={state} onStateChange={onStateChange}>
      <SearchBar
        icon={
          <Image
            style={styles.icon}
            source={require('@assets/icons/class.png')}
          />
        }
        text={query}
        placeholder={'강의 찾기'}
        onChangeText={setQuery}
        onSubmit={() => {}}
      />
      <RadioGroup option={filterOption} onPress={setFilterOption}>
        <RadioButton label="과목명" />
        <RadioButton label="교수명" />
        <RadioButton label="과목코드" />
      </RadioGroup>
      <LectureList
        items={mockLectures}
        onTap={onItemSelect}
        onItemAdd={onItemAdd}
      />
    </BottomSheet>
  );
};

const RegistrationBody = () => {
  const [state, setState] = useState(BottomSheetState.HIDDEN);
  const [items, setItems] = useState([] as Lecture[]);
  const [candidate, setCandidate] = useState<Lecture | undefined>(undefined);
  const [contentHeight, setContentHeight] = useState(0);

  return (
    <View style={GlobalStyles.expand}>
      <View onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
        <Timetable
          lectures={items}
          scrollable={true}
          candidate={candidate}
          onPress={(id: string) =>
            Alert.alert('수업을 삭제하겠습니까?', '', [
              {text: '취소'},
              {
                text: '삭제',
                style: 'destructive',
                onPress: () => setItems(items.filter(e => e.id !== id)),
              },
            ])
          }
        />
        <FloatingButton onPress={() => setState(BottomSheetState.HALF)}>
          <Icon name="plus" size={24} color={Colors.ui.background} />
        </FloatingButton>
      </View>
      <CompleteButton disabled={items.length === 0} />
      <RegistrationBottomSheet
        height={contentHeight + 16}
        state={state}
        onStateChange={setState}
        onItemSelect={(e: Lecture) => setCandidate(e)}
        onItemAdd={(item: Lecture) => {
          setState(BottomSheetState.HALF);
          if (items.find(e => e.id === item.id)) {
            Alert.alert('이미 등록된 수업입니다');
          } else if (doesOverlap(item, items)) {
            Alert.alert('다른 수업과 시간이 겹칩니다');
          } else {
            setItems([...items, item]);
          }
        }}
      />
    </View>
  );
};

const RegistrationHeader = ({subTitle}: {subTitle: string}) => {
  return (
    <View style={headerStyles.container}>
      <Text style={headerStyles.title}>KU&A</Text>
      <Text style={headerStyles.subTitle}>{subTitle}</Text>
    </View>
  );
};

const RegistrationScreen = () => {
  return (
    <View style={styles.background}>
      <SafeAreaView edges={['top']} style={styles.safeArea} />
      <View style={GlobalStyles.expand}>
        <View style={styles.top} />
        <View style={styles.bottom} />
        <View style={styles.content}>
          <RegistrationHeader subTitle={'2024학년도 1학기'} />
          <RegistrationBody />
        </View>
      </View>
    </View>
  );
};

const itemStyles = StyleSheet.create({
  selectedContainer: {
    height: 100,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: Colors.ui.onPrimary,
    justifyContent: 'space-between',
  },
  container: {
    height: 100,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderColor: Colors.ui.disabled,
    justifyContent: 'space-between',
  },
  courseName: {
    flex: 1,
    fontSize: 16,
    ...GlobalStyles.boldText,
  },
  lecturer: {
    fontSize: 12,
    color: Colors.text.gray,
    ...GlobalStyles.text,
  },
  courseInfo: {
    fontSize: 12,
    color: Colors.text.gray,
    marginTop: 4,
    marginRight: 8,
    textAlignVertical: 'center',
    ...GlobalStyles.text,
  },
  courseMate: {
    fontSize: 12,
    color: Colors.text.gray,
    ...GlobalStyles.text,
  },
  listFooter: {
    height: 16,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  title: {
    fontSize: FontSizes.huge,
    ...GlobalStyles.logo,
  },
  subTitle: {
    fontSize: FontSizes.large,
    color: Colors.text.white,
    ...GlobalStyles.text,
  },
});

const buttonStyles = StyleSheet.create({
  completeButtonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  completeButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 64,
    borderRadius: 10,
  },
  activated: {
    backgroundColor: Colors.primary[500],
  },
  deactivated: {
    backgroundColor: Colors.ui.disabled,
  },
  completeButtonText: {
    color: Colors.text.white,
    fontSize: 18,
    ...GlobalStyles.boldText,
  },
  addButtonContainer: {
    justifyContent: 'flex-end',
  },
  addButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: 100,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  addButtonText: {
    color: Colors.text.white,
    fontSize: FontSizes.regular,
    ...GlobalStyles.boldText,
  },
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.ui.background,
    ...GlobalStyles.expand,
  },
  safeArea: {backgroundColor: Colors.primary[500]},
  bottom: {flex: 7},
  top: {
    flex: 3,
    backgroundColor: Colors.primary[500],
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  icon: {width: 24, height: 24},
});

export default RegistrationScreen;
