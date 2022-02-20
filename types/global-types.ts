import { IEventBus } from "../services/event-bus.service";
import { INotificationsService } from "../services/notifications.service";

export interface IServiceConstrutor {
  config: IConfig,
  eventBus: IEventBus,
  notifications: INotificationsService
}

export interface IConfig{

}
