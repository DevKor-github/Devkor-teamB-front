import React, {Children, ReactElement, cloneElement} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '@src/Colors';
import {GlobalStyles} from '@src/GlobalStyles';

interface RadioGroupProps {
  option: number;
  onPress: Function;
  children: ReactElement[];
}

interface RadioButtonProps {
  label: string;
  selected?: boolean;
  onPress?: Function;
}

const RadioGroup: React.FC<RadioGroupProps> = ({option, onPress, children}) => {
  return (
    <View style={style.radioGroup}>
      {Children.map(children, (child, index) => {
        return cloneElement(child, {
          selected: option === index,
          onPress: () => {
            onPress(index);
          },
        });
      })}
    </View>
  );
};

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (onPress !== undefined) {
          onPress();
        }
      }}>
      <View style={style.radio}>
        <View
          style={{
            borderColor: selected ? Colors.ui.primary : Colors.ui.disabled,
            ...style.radioButton,
          }}>
          <View style={selected ? style.radioEnabled : style.radioDisabled} />
        </View>
        <Text
          style={{
            color: selected ? Colors.text.accent : Colors.text.black,
            ...style.radioLabel,
          }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  radioGroup: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioEnabled: {
    width: '70%',
    height: '70%',
    borderRadius: 10,
    backgroundColor: Colors.ui.primary,
  },
  radioDisabled: {},
  radioLabel: {
    marginLeft: 8,
    marginRight: 16,
    fontSize: 14,
    textAlign: 'center',
    ...GlobalStyles.text,
  },
});

export {RadioGroup, RadioButton};
