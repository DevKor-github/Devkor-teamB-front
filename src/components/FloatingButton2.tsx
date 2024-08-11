import React, {ReactElement} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '@src/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const INSET = 18;
const BUTTON_SIZE = 20;

interface FloatingButtonProps {
  onPress: Function;
  children: ReactElement;
  useSafeArea?: boolean;
}

const FloatingButton2: React.FC<FloatingButtonProps> = ({
  onPress,
  children,
  useSafeArea = false,
}) => {
  const inset = useSafeAreaInsets();
  const insetStyle = {marginBottom: useSafeArea ? inset.bottom : INSET};
  return (
    <View style={{...insetStyle, ...style.container}}>
      <TouchableOpacity style={style.button} onPress={() => onPress()}>
        {children}
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: INSET,
    backgroundColor: Colors.ui.background,
    borderRadius:48,
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
    backgroundColor: 'gray',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -75,
    right: -55
  },
});

export default FloatingButton2;