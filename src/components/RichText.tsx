import Colors from '@src/Colors';
import {FontSizes, GlobalStyles} from '@src/GlobalStyles';
import React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';

/*
    예시)
    const foo = () => {
        const texts: RichtextType = [
            ['신입 회원 ', RichTextOption.default],
            ['100 ', RichTextOption.bold],
            ['포인트 적립', RichTextOption.default],
        ];

        return <RichText text={texts} />;
    }
*/

enum RichTextOption {
  default,
  bold,
  lineThrough,
  underline,
}

interface RichTextProps {
  text: RichTextType;
  textStyle?: StyleProp<TextStyle>;
  boldTextStyle?: StyleProp<TextStyle>;
  lineThroughTextStyle?: StyleProp<TextStyle>;
  underlineTextStyle?: StyleProp<TextStyle>;
}

type RichTextType = Array<[string, RichTextOption]>;

const RichText: React.FC<RichTextProps> = ({
  text,
  textStyle = styles.base,
  boldTextStyle = styles.bold,
  lineThroughTextStyle = styles.lineThrough,
  underlineTextStyle = styles.underline,
}) => {
  return (
    <Text style={textStyle}>
      {text.map(([val, type], idx) => {
        if (type === RichTextOption.bold) {
          return (
            <Text key={idx} style={boldTextStyle}>
              {val}
            </Text>
          );
        } else if (type === RichTextOption.underline) {
          return (
            <Text key={idx} style={underlineTextStyle}>
              {val}
            </Text>
          );
        } else if (type === RichTextOption.lineThrough) {
          return (
            <Text key={idx} style={lineThroughTextStyle}>
              {val}
            </Text>
          );
        } else {
          return <Text key={idx}>{val}</Text>;
        }
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontSize: FontSizes.regular,
    color: Colors.text.black,
    ...GlobalStyles.text,
  },
  bold: {
    fontSize: FontSizes.regular,
    color: Colors.text.accent,
    ...GlobalStyles.boldText,
  },
  underline: {
    fontSize: FontSizes.regular,
    textDecorationLine: 'underline',
    ...GlobalStyles.text,
  },
  lineThrough: {
    fontSize: FontSizes.regular,
    textDecorationLine: 'line-through',
    ...GlobalStyles.text,
  },
});

export {RichTextOption};
export type {RichTextType};
export default RichText;
