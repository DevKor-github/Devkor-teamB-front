import Colors from '@src/Colors';
import {Platform, StyleSheet} from 'react-native';

export const GlobalStyles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {width: 0, height: 1},
      },
      android: {
        elevation: 3,
      },
    }),
  },
  expand: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  logo: {
    fontFamily: 'Omnes',
    fontWeight: '900',
    color: Colors.text.white,
  },
  text: {
    fontFamily: 'Pretendard',
  },
  boldText: {
    fontWeight: 'bold',
    fontFamily: 'Pretendard',
  },
});

export const FontSizes = {
  small: 10,
  regular: 12,
  medium: 14,
  large: 16,
  xLarge: 18,
  xxLarge: 24,
  xxxLarge: 32,
  huge: 40,
};
