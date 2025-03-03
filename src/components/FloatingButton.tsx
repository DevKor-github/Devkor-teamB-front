import React, {ReactElement} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '@src/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GlobalStyles} from '@src/GlobalStyles';

const INSET = 18;
const BUTTON_SIZE = 48;

interface FloatingButtonProps {
  onPress: Function;
  children: ReactElement;
  useSafeArea?: boolean;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  children,
  useSafeArea = false,
}) => {
  const inset = useSafeAreaInsets();
  const insetStyle = {marginBottom: useSafeArea ? inset.bottom : INSET};
  return (
    <View style={{...insetStyle, ...style.container}}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={style.button}
        onPress={() => onPress()}>
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
    borderRadius: BUTTON_SIZE,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: Colors.ui.primary,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    ...GlobalStyles.shadow,
  },
});

export default FloatingButton;
