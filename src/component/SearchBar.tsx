import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SearchBarProps {
  text: string;
  placeholder?: string;
  onChangeText: Function;
  onSubmit: Function;
}

const SearchBar: React.FC<SearchBarProps> = ({
  text,
  placeholder,
  onChangeText,
  onSubmit,
}) => {
  return (
    <View style={style.searchBar}>
      <View style={style.row}>
        <Icon name="search" size={20} color={'gray'} />
        <TextInput
          style={style.searchText}
          value={text}
          maxLength={20}
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
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    borderColor: 'lightgray',
  },
  searchText: {
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 12,
  },
});

export default SearchBar;
