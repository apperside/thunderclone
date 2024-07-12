import { WebSocketServer } from 'ws';
import notifications from '../notifications-utils';
import socketMessageDispatcher from './socketMessageDispatcher';

let wss: WebSocketServer | undefined = undefined;

function startService() {
  if (!wss) {
    wss = new WebSocketServer({ port: 3456 });

    wss.on('connection', (ws) => {
      console.log('Client connected');

      ws.on('message', (message) => {
        socketMessageDispatcher(ws, message, false);
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
    wss.on('open', () => console.log('socket open'));
    wss.on('error', console.error);
    notifications.showMessage('Thunderclone', 'Server started');
  }
}

function stopService() {
  console.log('wss', wss);
  if (wss) {
    notifications.showMessage('Instaclone', 'Server stopped');
    wss.close();
    wss = null;
  }
}

const networkingUtils = {
  startService,
  stopService,
};

export default networkingUtils;
