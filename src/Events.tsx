class EventListener {
  listeners: {desc: string; callback: Function}[];

  constructor() {
    this.listeners = [];
  }

  emit(target: string, value: any) {
    this.listeners.forEach(
      ({desc, callback}) => desc === target && callback(value),
    );
  }

  addListener(desc: string, callback: Function) {
    this.listeners.push({desc: desc, callback: callback});
    return this;
  }

  removeListener(desc: string) {
    this.listeners = this.listeners.filter(listener => listener.desc !== desc);
  }
}

const PointEventHandler = new EventListener();
const BriefingEventHandler = new EventListener();
export {PointEventHandler, BriefingEventHandler};
