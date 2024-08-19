import Colors from '@src/Colors';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ImageURISource,
  StyleSheet,
} from 'react-native';
import {View} from 'react-native-animatable';

interface BannerProps {
  items: (ImageSourcePropType | ImageURISource)[];
}

const FlatListIndicator = ({isCurrent}: {isCurrent: boolean}) => {
  return <View style={isCurrent ? styles.active : styles.inactive} />;
};

const Banner: React.FC<BannerProps> = ({items}) => {
  const [width, setWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList | null>(null);
  const ads = items.map((x, idx) => {
    return {id: idx, uri: x};
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % ads.length;
        flatListRef.current?.scrollToIndex({index: nextIndex});
        return nextIndex;
      });
    }, 10000);

    return () => clearInterval(interval);
  });

  return (
    <View
      style={styles.container}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      <FlatList
        data={ads}
        ref={flatListRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Image
            resizeMode="cover"
            source={item.uri}
            style={[styles.banner, {width}]}
          />
        )}
        keyExtractor={item => item.id}
      />
      <View style={styles.indicator}>
        {ads.map(({id}) => (
          <FlatListIndicator key={id} isCurrent={id === currentIndex} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    right: 0,
    margin: 12,
    flexDirection: 'row',
  },
  inactive: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginLeft: 6,
    backgroundColor: Colors.ui.onPrimary,
  },
  active: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginLeft: 6,
    backgroundColor: Colors.ui.primary,
  },
  container: {
    height: 92,
    backgroundColor: Colors.ui.disabled,
    borderRadius: 10,
    marginVertical: 28,
  },
  banner: {
    height: 92,
    borderRadius: 10,
  },
});

export default Banner;
