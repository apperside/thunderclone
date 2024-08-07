import * as path from "path";

import notifier from "node-notifier";

function showMessage(
  title: string,
  message: string,
  callback?: (err: any, response: any, metadata: any) => void
) {
  notifier.notify(
    {
      title,
      message,
      icon: path.join(__dirname, "icon.png"), // Absolute path (doesn't work on balloons)
      sound: true, // Only Notification Center or Windows Toasters
      wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    callback
  );
}

const notifications = {
  showMessage,
};

export default notifications;
