import Colors from '@src/Colors';
import {GlobalStyles} from '@src/GlobalStyles';
import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {TextInputProps} from 'react-native';

interface InputFieldProps extends TextInputProps {
  icon?: number;
  error?: boolean;
  errorText?: string;
  infoText?: string;
}

export const InputField: React.FC<InputFieldProps> = props => {
  const isNotEmpty = (value: string | undefined) =>
    value !== undefined && value.length !== 0;

  const [isEncrypted, setIsEncrypted] = useState(props.secureTextEntry);

  const inputStyle = [
    styles.input,
    {
      borderBottomColor: isNotEmpty(props.value)
        ? Colors.text.black
        : Colors.text.lightgray,
    },
  ];

  const iconStyle = [
    styles.iconBase,
    {tintColor: props.value === '' ? Colors.text.lightgray : Colors.text.black},
  ];

  const handleClear = () => props.onChangeText?.('');

  return (
    <>
      <View style={inputStyle}>
        {props.icon && <Image source={props.icon} style={iconStyle} />}
        {props.icon && <View style={styles.iconPadding} />}
        <TextInput
          style={styles.inputText}
          placeholderTextColor={Colors.text.lightgray}
          onChangeText={props.onChangeText}
          value={props.value}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          autoCapitalize="none"
          secureTextEntry={isEncrypted}
        />
        {isNotEmpty(props.value) && props.secureTextEntry && (
          <TouchableOpacity
            style={styles.iconBase}
            onPress={() => setIsEncrypted(!isEncrypted)}>
            <Image
              source={
                isEncrypted
                  ? require('@src/assets/icons/password_invisible.png')
                  : require('@src/assets/icons/password_visible.png')
              }
              style={styles.iconBase}
            />
          </TouchableOpacity>
        )}
        {isNotEmpty(props.value) && (
          <>
            <View style={styles.iconPadding} />
            <TouchableOpacity style={styles.iconBase} onPress={handleClear}>
              <Image
                source={require('@src/assets/icons/clear.png')}
                style={styles.iconBase}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
      {props.infoText && !props.error && (
        <View style={styles.msgWrapper}>
          <Image
            source={require('@src/assets/icons/error_circle.png')}
            style={styles.infoIcon}
          />
          <Text style={styles.infoMsg}>{props.infoText}</Text>
        </View>
      )}
      {props.error && (
        <View style={styles.msgWrapper}>
          <Image
            source={require('@src/assets/icons/error_circle.png')}
            style={styles.errorIcon}
          />
          <Text style={styles.errorMsg}>{props.errorText}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  iconPadding: {
    width: 12,
  },
  iconBase: {
    alignSelf: 'center',
    width: 21,
    height: 21,
  },
  input: {
    flexDirection: 'row',
    marginTop: 32,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  inputText: {
    ...GlobalStyles.text,
    flex: 1,
    fontSize: 16,
  },
  errorMsg: {
    fontSize: 14,
    color: Colors.text.red,
    paddingVertical: 6,
  },
  infoMsg: {
    fontSize: 14,
    color: Colors.text.lightgray,
    paddingVertical: 6,
  },
  errorIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: Colors.text.red,
  },
  infoIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: Colors.text.lightgray,
  },
  msgWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
});
