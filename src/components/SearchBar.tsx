import React, {ReactNode} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import Colors from '@src/Colors';
import {GlobalStyles} from '@src/GlobalStyles';

interface SearchBarProps {
  text: string;
  icon: ReactNode;
  placeholder?: string;
  onChangeText: Function;
  onSubmit: Function;
}

const SearchBar: React.FC<SearchBarProps> = ({
  text,
  icon,
  placeholder,
  onChangeText,
  onSubmit,
}) => {
  return (
    <View style={style.searchBar}>
      <View style={style.row}>
        {icon}
        <TextInput
          style={style.searchText}
          value={text}
          maxLength={20}
          placeholderTextColor={Colors.text.lightgray}
          onChangeText={e => onChangeText(e)}
          onEndEditing={_ => onSubmit()}
          placeholder={placeholder}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  row: {flexDirection: 'row'},
  searchBar: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderColor: Colors.ui.disabled,
  },
  searchText: {
    width: '100%',
    textAlign: 'left',
    fontSize: 16,
    marginHorizontal: 8,
    ...GlobalStyles.text,
  },
});

export default SearchBar;
