import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Color} from './Color';

const buttonSize = 48;
const margin = 12;
const textSize = 32;
const centerText = '+';

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: margin,
    right: margin,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {width: 0, height: 1},
      },
      android: {
        elevation: 3,
      },
    }),
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize,
    justifyContent: 'center',
    backgroundColor: Color.ui.primary,
  },
  text: {
    fontSize: textSize,
    lineHeight: textSize,
    color: 'white',
    textAlign: 'center',
  },
});

function FloatingButton({onPress}: {onPress: Function}) {
  return (
    <View style={style.container}>
      <TouchableOpacity style={style.button} onPress={() => onPress()}>
        <Text style={style.text}>{centerText}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default FloatingButton;
