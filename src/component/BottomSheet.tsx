import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {Color} from './Color';

export enum BottomSheetState {
  HALF,
  EXPANDED,
}

enum AnimationState {
  MOVING,
  STOPPED,
}

interface BottomSheetProps {
  children?: ReactNode[];
  minHeight: number;
}

interface BottomSheetHandlerProps {
  bottomSheetState: BottomSheetState;
  animationState: AnimationState;
  onStateChanged: Function;
}

const BottomSheetHandle: React.FC<BottomSheetHandlerProps> = ({
  bottomSheetState,
  animationState,
  onStateChanged,
}) => {
  const THRESHOLD = 50;
  return (
    <View
      style={style.controller}
      onStartShouldSetResponder={_ => true}
      onResponderMove={evt => {
        const to = evt.nativeEvent.locationY;
        if (animationState === AnimationState.STOPPED) {
          if (to < -THRESHOLD && bottomSheetState === BottomSheetState.HALF) {
            onStateChanged(
              BottomSheetState.EXPANDED,
              AnimationState.MOVING,
              1000,
            );
          } else if (
            to > THRESHOLD &&
            bottomSheetState === BottomSheetState.EXPANDED
          ) {
            onStateChanged(BottomSheetState.HALF, AnimationState.MOVING, 450);
          }
        }
      }}>
      <View style={style.bar} />
    </View>
  );
};

const BottomSheet: React.FC<BottomSheetProps> = ({children, minHeight}) => {
  const [animationState, setAnimationState] = useState(AnimationState.STOPPED);
  const [bottomSheetState, setBottomSheetState] = useState(
    BottomSheetState.HALF,
  );
  const windowHeight = Dimensions.get('window').height;
  const [height, setHeight] = useState(windowHeight - minHeight - 240);
  const anim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(minHeight)).current;

  useEffect(() => {
    Animated.timing(anim, {
      duration: 200,
      easing: Easing.cubic,
      toValue: bottomSheetState === BottomSheetState.HALF ? minHeight : 0,
      useNativeDriver: false,
    }).start(() => {
      setAnimationState(AnimationState.STOPPED);
    });

    Animated.timing(heightAnim, {
      duration: 200,
      easing: Easing.cubic,
      toValue: height,
      useNativeDriver: false,
    }).start(() => {
      setAnimationState(AnimationState.STOPPED);
    });
  }, [bottomSheetState, minHeight, height, anim, heightAnim]);

  return (
    <Animated.View style={{...style.modal, top: anim, height: heightAnim}}>
      <BottomSheetHandle
        bottomSheetState={bottomSheetState}
        animationState={animationState}
        onStateChanged={(s: BottomSheetState, a: AnimationState, h: number) => {
          setBottomSheetState(s);
          setHeight(h);
          setAnimationState(a);
        }}
      />
      <View style={{paddingHorizontal: 8}}>{children}</View>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  modal: {
    position: 'absolute',
    width: '100%',
    height: 1000,
    backgroundColor: Color.ui.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    ...Platform.select({
      ios: {
        // shadowColor: 'black',
        shadowOpacity: 0.5,
        // shadowRadius: 5,
        shadowOffset: {width: 0, height: 0},
      },
      android: {
        elevation: 3,
      },
    }),
  },
  controller: {
    width: '100%',
    padding: 12,
    borderColor: 'black',
    alignItems: 'center',
  },
  bar: {
    height: 4,
    width: 64,
    borderRadius: 4,
    backgroundColor: 'lightgray',
  },
});

export default BottomSheet;
