import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import {PointInstance} from '@src/MockData';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

const pointInstance = PointInstance;

interface PointUsage {
  point: number;
  method: string;
  timestamp: string;
}

const itemStyles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    backgroundColor: Colors.ui.onPrimary,
  },
  divider: {
    width: 12,
  },
  methodText: {
    flex: 2,
    fontSize: FontSizes.large,
    color: Colors.text.black,
    ...GlobalStyles.boldText,
  },
});

const PointItem: React.FC<PointUsage> = ({point, method, timestamp}) => {
  return (
    <View style={itemStyles.container}>
      <Text style={itemStyles.methodText}>{method}</Text>
      <Text style={{flex: 1}}>{point}</Text>
      <Text style={{flex: 2}}>{timestamp}</Text>
    </View>
  );
};

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
    <FlatList
      renderItem={({item}: {item: [number, string, string]}) => {
        const [point, method, timestamp] = item;
        return (
          <PointItem point={point} method={method} timestamp={timestamp} />
        );
      }}
      data={history}
    />
  );
};
export default StoreHistoryScreen;
