import { useState } from "react"
import { CommentsServices, ICommentsServices } from "../services/comments.service"
import { DataEventsService } from "../services/data-event.service"
import { EventBus, IEventBus } from "../services/event-bus.service"
import { INotificationsService, NotificationsService } from "../services/notifications.service"
import { IPostsService, PostsService } from "../services/posts.service"
import { IServiceConstrutor } from "../types/global-types"

export const useServices = (): IAppServices => {

  const [services] = useState<IAppServices>((): IAppServices => {
    const eventBus = new EventBus();
    const notifications = new NotificationsService();
    const serviceProps: IServiceConstrutor = { eventBus, notifications };
    const postsService = new PostsService(serviceProps);
    const dataEvents = new DataEventsService(serviceProps);
    const commentsService = new CommentsServices(serviceProps);
    return { eventBus, dataEvents, notifications, postsService, commentsService };
  })

  return services;
}

export interface IAppServices {
  eventBus: IEventBus
  postsService: IPostsService
  commentsService: ICommentsServices
  notifications: INotificationsService,
  dataEvents: DataEventsService
}