import { inject } from '@angular/core';
import { NotificationStatusEnum } from '@closing/shared/interfaces';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { MessageService } from 'primeng/api';

type Notification = {
  id: string;
  message: string;
  status: NotificationStatusEnum;
};

export const NotificationStore = signalStore(
  withEntities<Notification>(),
  withMethods((store, service = inject(MessageService)) => ({
    addNotification: (notification: Notification) => {
      patchState(store, addEntity(notification));
      service.add({
        severity: notification.status,
        summary: notification.message,
      });
    },
    removeNotification: (id: string) => {
      patchState(store, removeEntity(id));
    },
    clearNotifications: () => {
      patchState(store, removeAllEntities());
    },
  }))
);
