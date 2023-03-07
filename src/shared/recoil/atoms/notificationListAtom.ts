import { atom, SetterOrUpdater } from 'recoil';

export enum NotificationKind {
  Error,
}

type Notification = {
  kind: NotificationKind,
  message: string,
};

type NotificationList = {
  notifications: Array<Notification>,
};

export const notificationListAtom = atom<NotificationList>({
  key: 'notificationList',
  default: { notifications: [] },
});

export default notificationListAtom;

export function pushNotification(
  setNotificationList: SetterOrUpdater<NotificationList>,
  kind: NotificationKind,
  message: string,
) {
  setNotificationList(
    (notificationListOld) => {
      const notifications = [...notificationListOld.notifications];
      notifications.push({ kind, message });
      return { ...notificationListOld, notifications };
    },
  );
}
