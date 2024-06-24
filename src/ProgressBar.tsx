import {View, Animated, Easing, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';

// const defaultHighlightColor = '#f91482';
const defaultBackgroundColor = 'lightgray';

function Knob({progress}: {progress: number}) {
  const [textOpacity] = useState(new Animated.Value(0));
  const styles = StyleSheet.create({
    knob: {
      width: 24,
      height: 24,
      borderRadius: 24,
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    text: {
      fontSize: 8,
      textAlign: 'center',
      color: 'black',
      fontWeight: 'bold',
    },
  });

  useEffect(() => {
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 750,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [textOpacity]);

  return (
    <View style={styles.knob}>
      <Animated.Text style={[styles.text, {opacity: textOpacity}]}>
        {progress}%
      </Animated.Text>
    </View>
  );
}

function ProgressBar({
  progress,
  highlightColor,
}: {
  progress: number;
  highlightColor: string;
}) {
  const [percentage] = useState(new Animated.Value(0));
  const styles = StyleSheet.create({
    outerBar: {
      width: '100%',
      backgroundColor: defaultBackgroundColor,
      borderRadius: 24,
      height: 24,
    },
    innerBar: {
      position: 'absolute',
      backgroundColor: highlightColor,
      borderRadius: 24,
      height: 24,
      alignItems: 'flex-end',
    },
  });

  useEffect(() => {
    Animated.timing(percentage, {
      toValue: progress,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [percentage, progress]);

  const barWidth = percentage.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.outerBar}>
      <Animated.View style={[styles.innerBar, {width: barWidth}]}>
        <Knob progress={progress} />
      </Animated.View>
    </View>
  );
}

export default ProgressBar;
