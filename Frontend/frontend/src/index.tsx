import React from 'react';
import GlobalStyles from './styles/GlobalStyles';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';

function askForNotificationPermission() {
  return new Promise<void>((resolve, reject) => {
    if (!('Notification' in window)) {
      reject(new Error('Notifications not supported in this browser'));
    } else if (Notification.permission === 'granted') {
      resolve();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === 'granted') {
            resolve();
          } else {
            reject(new Error('Permission denied for notifications'));
          }
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(new Error('Permission denied for notifications'));
    }
  });
}

function subscribeToPushNotifications() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: '<YOUR_PUBLIC_KEY>',
        })
        .then((subscription) => {
          console.log('Push notification subscription:', subscription);
        })
        .catch((error) => {
          console.error('Failed to subscribe to push notifications:', error);
        });
    });
  } else {
    console.error('Push notifications not supported');
  }
}

// Ask for notification permission and subscribe to push notifications on app load
askForNotificationPermission()
  .then(() => {
    subscribeToPushNotifications();
  })
  .catch((error) => {
    console.error('Error:', error);
  });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <GlobalStyles />
      <App />
    </RecoilRoot>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
