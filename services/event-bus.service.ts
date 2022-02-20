export interface IEventBus {
  subscribe(eventName: string, callback: Function): void
  unsubscribe(eventName: string, callback: Function): void
  publish(eventName: string, data: any): void
}

export type EventBusEvents = {
  [key: string]: Array<Function>
}


export class EventBus implements IEventBus {
  private events: EventBusEvents = {};

  subscribe(eventName: string, callback: Function) {
    if (this.events[eventName]) {
      this.events[eventName].push(callback);
    } else {
      this.events[eventName] = [callback];
    }
  }

  unsubscribe(eventName: string, callback: Function) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);

      if (this.events[eventName].length == 0) delete this.events[eventName];
    }
  }

  publish(eventName: string, data: any) {
    if (this.events[eventName]) {

      this.events[eventName].forEach(cb => {
        try {
          cb(data);
        } catch (error) {
          console.error(error);
        }
      })
    }
  }
}