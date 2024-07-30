import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {mockLectures} from '@src/MockData';
import Timetable from '@components/Timetable/Timetable';

function WeeklyTimetableScreen() {
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  useEffect(
    () => setScrollEnabled(contentHeight > viewHeight),
    [contentHeight, viewHeight],
  );

  return (
    <ScrollView
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={(_, height) => setContentHeight(height)}
      onLayout={e => setViewHeight(e.nativeEvent.layout.height)}>
      <View
        style={styles.container}
        onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
        <Timetable
          lectures={mockLectures}
          onPress={(id: string) => {
            navigation.navigate('Community', {id: id});
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default WeeklyTimetableScreen;
