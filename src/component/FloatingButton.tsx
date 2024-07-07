import React, {ReactElement} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Color} from './Color';

const buttonSize = 48;
const margin = 12;

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
    alignItems: 'center',
    backgroundColor: Color.ui.primary,
  },
});

interface FloatingButtonProps {
  onPress: Function;
  children: ReactElement;
}
const FloatingButton: React.FC<FloatingButtonProps> = ({onPress, children}) => {
  return (
    <View style={style.container}>
      <TouchableOpacity style={style.button} onPress={() => onPress()}>
        {children}
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButton;
