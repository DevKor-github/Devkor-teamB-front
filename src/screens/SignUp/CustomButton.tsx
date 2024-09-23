import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import Colors from '@src/Colors';
import {GlobalStyles} from '@src/GlobalStyles';

interface CustomButtonProps extends TouchableOpacityProps {
  text: string;
  outline?: boolean;
}

const FilledButton: React.FC<CustomButtonProps> = props => {
  const buttonStyle = [
    styles.btnText,
    {
      color: props.disabled ? Colors.text.lightgray : Colors.text.white,
    },
  ];

  return (
    <TouchableOpacity
      style={[
        styles.btnWrapper,
        {
          backgroundColor: props.disabled
            ? Colors.ui.disabled
            : Colors.ui.primary,
        },
      ]}
      onPress={props.onPress}
      disabled={props.disabled}>
      <Text style={buttonStyle}>{props.text}</Text>
    </TouchableOpacity>
  );
};

const OutlinedButton: React.FC<CustomButtonProps> = props => {
  const buttonStyle = [
    styles.btnText,
    {
      color: props.disabled ? Colors.text.lightgray : Colors.text.accent,
    },
  ];
  const buttonWrapperStyle = [
    styles.outlineBtnWrapper,
    {
      borderColor: props.disabled ? Colors.ui.disabled : Colors.ui.primary,
    },
  ];

  return (
    <TouchableOpacity
      style={buttonWrapperStyle}
      onPress={props.onPress}
      disabled={props.disabled}>
      <Text style={buttonStyle}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export const CustomButton: React.FC<CustomButtonProps> = props => {
  return props.outline ? (
    <OutlinedButton {...props} />
  ) : (
    <FilledButton {...props} />
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
  },
  btnText: {
    ...GlobalStyles.boldText,
    fontSize: 18,
    textAlign: 'center',
  },
  outlineBtnWrapper: {
    backgroundColor: Colors.ui.background,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
  },
});
