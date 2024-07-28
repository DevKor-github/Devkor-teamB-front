import {View, Animated, Easing, StyleSheet, Text, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Color} from './Color';

const defaultHighlightColor = Color.ui.primary;
const defaultBackgroundColor = Color.ui.disabled;
const size = 20;

function Knob({progress}: {progress: number}) {
  const [textOpacity] = useState(new Animated.Value(0));
  const styles = StyleSheet.create({
    knob: {
      position: 'absolute',
      top: -1,
      right: -1,
      width: 30,
      height: 30,
      borderWidth: 1,
      borderColor: '#F6F2F4',
      borderRadius: 15,
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

function ProgressBar({progress,text}: {progress: number, text: string}) {
  const [percentage] = useState(new Animated.Value(0));
  const styles = StyleSheet.create({
    outerBar: {
      width: '100%',
      backgroundColor: "white",
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#F6F2F4',
      height: 30,
    },
    innerBar: {
      position: 'absolute',
      backgroundColor: "#FFE0EF",
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#F6F2F4',
      height: 30,
      alignItems: 'flex-end',
      alignSelf: 'stretch'
    },
    innerText: {
      alignSelf: 'flex-start',
      color: '#1A1A1A',
      fontSize: 16,
      fontFamily: 'Pretendard',
      fontWeight: '400',
    }
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
        {/* <Knob progress={progress} /> */}
      </Animated.View>
      <View style={{position:'absolute',display:'flex',flexDirection:'row',alignSelf:'flex-start',padding:5}}>
          <Image
            source={require('../assets/icons/smile.png')}
            style={{width:20,height:20,marginLeft:10,marginRight:5}}
          />
          <Text style={styles.innerText}>{text}</Text>
        </View>
    </View>
  );
}

export default ProgressBar;
