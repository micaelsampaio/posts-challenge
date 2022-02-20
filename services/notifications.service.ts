const { NotificationManager }: any = require('react-notifications');

export interface INotificationsService {
  info(notificationText: string): void
  success(notificationText: string, notificationTitle?: string): void
  warning(notificationText: string, notificationTitle?: string, time?: number): void
  error(notificationText: string, notificationTitle?: string, time?: number, cb?: any): void
}

export class NotificationsService implements INotificationsService {
  info(notificationText: string) {
    NotificationManager.info(notificationText)
  }

  success(notificationText: string, notificationTitle: string) {
    NotificationManager.success(notificationText, notificationTitle, 1000)
  }

  warning(notificationText: string, notificationTitle: string, time: number = 2000) {
    NotificationManager.warning(notificationText, notificationTitle, time)
  }

  error(notificationText: string, notificationTitle: string, time: number = 2500, cb: any) {
    NotificationManager.error(notificationText, notificationTitle, time, cb);
  }


}