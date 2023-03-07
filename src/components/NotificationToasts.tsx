import React from 'react';
import { useRecoilState } from 'recoil';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NotificationKind, notificationListAtom } from '../shared/recoil/atoms/notificationListAtom';
import './NotificationToasts.scss';

export default function NotificationToasts() {
  const [notificationList, setNotificationList] = useRecoilState(notificationListAtom);

  const removeNotification = (index: number) => {
    setNotificationList(
      (notificationListOld) => {
        const notifications = [...notificationList.notifications];
        notifications.splice(index, 1);
        return { ...notificationListOld, notifications };
      },
    );
  };

  const titleByNotificationKind: Record<NotificationKind, string> = {
    [NotificationKind.Error]: 'Error',
    [NotificationKind.Info]: 'Info',
  };

  return (
    <ToastContainer position="bottom-end" className="notification-toasts">
      {
        // <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        notificationList.notifications.map(
          (notification, index) => (
            <Toast onClose={() => removeNotification(index)}>
              <Toast.Header>
                {
                  (notification.kind === NotificationKind.Error)
                    ? <FontAwesomeIcon color="#dc3545" icon="circle-xmark" className="fa-lg me-2" />
                    : <FontAwesomeIcon icon="circle-info" className="fa-lg me-2" />
                }
                <strong className="me-auto">{titleByNotificationKind[notification.kind]}</strong>
              </Toast.Header>
              <Toast.Body>{notification.message}</Toast.Body>
            </Toast>
          ),
        )
      }
    </ToastContainer>
  );
}
