import {View, StyleSheet, DimensionValue} from 'react-native';
import React, {ReactNode} from 'react';
import Colors from '@src/Colors';

interface ProgressBarProps {
  progress: number;
  children?: ReactNode;
}

interface ProgressBarNoChildProps {
  width: DimensionValue;
}

interface ProgressBarWithChildrenProps extends ProgressBarNoChildProps {
  children?: ReactNode;
}

const ProgressBar: React.FC<ProgressBarProps> = ({progress, children}) => {
  const width: DimensionValue = `${progress}%`;
  if (children === undefined) {
    return <ProgressBarNoChild width={width} />;
  } else {
    return (
      <ProgressBarWithChildren width={width}>
        {children}
      </ProgressBarWithChildren>
    );
  }
};

const ProgressBarNoChild: React.FC<ProgressBarNoChildProps> = ({width}) => {
  return (
    <View style={[barNoChildStyle.background]}>
      <View style={[barNoChildStyle.bar, {width: width}]} />
    </View>
  );
};

const ProgressBarWithChildren: React.FC<ProgressBarWithChildrenProps> = ({
  width,
  children,
}) => {
  return (
    <View style={[barWithChildrenStyle.background]}>
      <View style={[barWithChildrenStyle.bar, {width: width}]} />
      <View style={[barWithChildrenStyle.content]}>{children}</View>
    </View>
  );
};

const barNoChildStyle = StyleSheet.create({
  background: {
    width: '100%',
    backgroundColor: Colors.ui.disabled,
    borderRadius: 100,
    height: 8,
  },
  bar: {
    position: 'absolute',
    backgroundColor: Colors.primary[500],
    borderRadius: 8,
    height: 8,
  },
});

const barWithChildrenStyle = StyleSheet.create({
  background: {
    width: '100%',
    backgroundColor: Colors.ui.background,
    borderRadius: 100,
    borderWidth: 1,
    height: 30,
    borderColor: Colors.ui.disabled,
  },
  bar: {
    position: 'absolute',
    backgroundColor: Colors.primary[50],
    borderRadius: 30,
    height: 30,
  },
  content: {
    marginHorizontal: 12,
    position: 'absolute',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 30,
  },
});

export default ProgressBar;
