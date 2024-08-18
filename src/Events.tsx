import {NativeEventEmitter, NativeModules} from 'react-native';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter()']);
LogBox.ignoreAllLogs();

const pointModule = NativeModules.PointModule;
const pointEventEmiiter = new NativeEventEmitter(pointModule);
export default pointEventEmiiter;
