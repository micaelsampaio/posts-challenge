import axios from "axios";
import { GLOBAL_EVENTS } from "../types/constants";
import { IServiceConstrutor } from "../types/global-types";
import { ICommentsServices } from "./comments.service";
import { IEventBus } from "./event-bus.service";
import { IPostsService } from "./posts.service";

export class DataEventsService {
  private eventBus: IEventBus;
  postsService!: IPostsService;
  iCommentsServices!: ICommentsServices;

  constructor({ eventBus }: IServiceConstrutor) {
    this.eventBus = eventBus;
    this.subscribeEvents();
  }

  async publish(eventName: string, data: any): Promise<void> {
    try {
      await axios.request({
        url: `/api/events`,
        method: 'POST',
        data: { event: eventName, data }
      });
    } catch (error) { }
  }

  subscribeEvents() {
    this.eventBus.subscribe(GLOBAL_EVENTS.NEW_POST, (data: any) => {
      this.publish("new_post", data);
    })

    this.eventBus.subscribe(GLOBAL_EVENTS.NEW_COMMENT, (data: any) => {
      this.publish("new_comment", data);
    })
  }

}