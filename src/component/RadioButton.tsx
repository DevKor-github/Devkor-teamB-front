import React, {Children, ReactElement, cloneElement} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Color} from './Color';

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
            borderColor: selected ? Color.ui.primary : Color.ui.disabled,
            ...style.radioButton,
          }}>
          <View style={selected ? style.radioEnabled : style.radioDisabled} />
        </View>
        <Text
          style={{
            color: selected ? Color.text.primary : Color.text.default,
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
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioEnabled: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Color.ui.primary,
  },
  radioDisabled: {},
  radioLabel: {
    marginHorizontal: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});

export {RadioGroup, RadioButton};
