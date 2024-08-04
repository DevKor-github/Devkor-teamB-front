import Colors from '@src/Colors';
import {PointInstance} from '@src/MockData';
import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';

const pointInstance = PointInstance;

const StoreHistoryScreen = ({navigation}: {navigation: any}) => {
  const [history, setHistory] = useState(pointInstance.getHistory());

  useEffect(() => {
    navigation.setOptions({title: '적립 및 사용내역'});
    const handlePointsChanged = setHistory;
    pointInstance.addListener(handlePointsChanged);

    return () => {
      pointInstance.removeListener(handlePointsChanged);
    };
  }, [navigation]);

  return (
    <ScrollView>
      {history.map(([pt, info, time], idx) => {
        return (
          <View
            key={idx}
            style={{
              borderRadius: 12,
              margin: 4,
              padding: 4,
              flexDirection: 'row',
              backgroundColor: Colors.ui.onPrimary,
            }}>
            <Text>{pt}</Text>
            <View style={{width: 12}} />
            <Text>{info}</Text>
            <View style={{width: 12}} />
            <Text>{time}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};
export default StoreHistoryScreen;
