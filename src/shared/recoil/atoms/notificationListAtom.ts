import { atom } from 'recoil';

export enum NotificationKind {
  Error,
}

type Notification = {
  kind: NotificationKind,
  message: string,
};

export const notificationListAtom = atom<{ notifications: Array<Notification> }>({
  key: 'notificationList',
  default: { notifications: [] },
});

export default notificationListAtom;
