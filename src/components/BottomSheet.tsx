import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Keyboard, StyleSheet, View} from 'react-native';
import {GlobalStyles} from '@src/GlobalStyles';
import Colors from '@src/Colors';

const THRESHOLD = 25;

interface BottomSheetProps {
  children?: ReactNode[] | ReactNode;
  hidden?: boolean;
  height: number;
  state: BottomSheetState;
  onStateChange: Function;
}

interface BottomSheetHandlerProps {
  state: BottomSheetState;
  animState: AnimationState;
  onStateChange: Function;
}

type HandleType = React.FC<BottomSheetHandlerProps>;
type BottomSheetType = React.FC<BottomSheetProps>;

const BottomSheetHandle: HandleType = ({state, animState, onStateChange}) => {
  return (
    <View
      style={style.controller}
      onStartShouldSetResponder={_ => true}
      onResponderMove={evt => {
        const to = evt.nativeEvent.locationY;
        if (animState === AnimationState.IDLE) {
          if (to < -THRESHOLD && state === BottomSheetState.HIDDEN) {
            onStateChange(BottomSheetState.HALF);
          } else if (to < -THRESHOLD && state === BottomSheetState.HALF) {
            onStateChange(BottomSheetState.FULL);
          } else if (to > THRESHOLD && state === BottomSheetState.HALF) {
            onStateChange(BottomSheetState.HIDDEN);
          } else if (to > THRESHOLD && state === BottomSheetState.FULL) {
            Keyboard.dismiss();
            onStateChange(BottomSheetState.HALF);
          }
        }
      }}>
      <View style={style.bar} />
    </View>
  );
};

// 주의사항: 상단 위젯의 높이 + PaddingVertical 값을 height로 주어야 함
const BottomSheet: BottomSheetType = ({
  children,
  height,
  state,
  onStateChange,
  hidden = true,
}) => {
  const minHeight = hidden ? Dimensions.get('window').height : height;

  const [animState, setAnimState] = useState(AnimationState.IDLE);
  const topAnim = useRef(new Animated.Value(minHeight)).current;

  const dragEvent = Animated.spring(topAnim, {
    useNativeDriver: false,
    bounciness: 0,
    toValue:
      state === BottomSheetState.FULL
        ? 0
        : state === BottomSheetState.HALF
        ? height
        : minHeight,
  });

  useEffect(() => {
    const keybordListener = Keyboard.addListener('keyboardWillShow', () => {
      if (state !== BottomSheetState.FULL) {
        setAnimState(AnimationState.MOVING);
        onStateChange(BottomSheetState.FULL);
      }
    });

    dragEvent.start(() => {
      setAnimState(AnimationState.IDLE);
    });

    return () => {
      keybordListener.remove();
      dragEvent.stop();
    };
  }, [dragEvent, onStateChange, state]);

  return (
    <Animated.View style={{top: topAnim, ...style.modal}}>
      <BottomSheetHandle
        state={state}
        animState={animState}
        onStateChange={(nextState: BottomSheetState) => {
          setAnimState(AnimationState.MOVING);
          onStateChange(nextState);
        }}
      />
      <View style={style.content}>{children}</View>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: Colors.ui.background,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...GlobalStyles.shadow,
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
    backgroundColor: Colors.ui.disabled,
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
});

enum AnimationState {
  MOVING,
  IDLE,
}

export enum BottomSheetState {
  HIDDEN,
  HALF,
  FULL,
}
export default BottomSheet;
