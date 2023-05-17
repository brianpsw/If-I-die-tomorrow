self.addEventListener('push', event => {
  const notificationData = event.data.json();
  const { title, body, icon } = notificationData;

  const options = {
    body,
    icon,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
