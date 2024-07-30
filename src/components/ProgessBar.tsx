import {View, StyleSheet, DimensionValue} from 'react-native';
import React, {ReactNode} from 'react';
import Colors from '@src/Colors';

const SIZE = 30;
interface ProgressBarProps {
  progress: number;
  children?: ReactNode;
}

const ProgressBar: React.FC<ProgressBarProps> = ({progress, children}) => {
  const percentage: DimensionValue = `${progress}%`;

  return (
    <View style={barStyle.background}>
      <View style={[barStyle.bar, {width: percentage}]} />
      <View style={barStyle.content}>{children}</View>
    </View>
  );
};

const barStyle = StyleSheet.create({
  background: {
    width: '100%',
    backgroundColor: Colors.ui.background,
    borderRadius: SIZE,
    borderWidth: 1,
    borderColor: Colors.ui.disabled,
    height: SIZE,
  },
  bar: {
    position: 'absolute',
    backgroundColor: Colors.primary[50],
    borderRadius: SIZE,
    height: SIZE,
  },
  content: {
    height: SIZE,
    marginHorizontal: 12,
    position: 'absolute',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});

export default ProgressBar;
