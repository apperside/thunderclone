import { RawData, WebSocket } from 'ws';

import logger from '../../logger';
import cloneRepoHandler from './socket-message-handlers/cloneRepo.handler.';

export type SocketPayloads = {
  'clone-repo': {
    url: string; // the full url, like https://github.com/owner/repo
  };
  'other-action': {};
};

export type WebSocketCommand<T extends keyof SocketPayloads> = {
  action: T;
  payload: SocketPayloads[T];
};

export type WebSocketCommandsMap = {
  [K in keyof SocketPayloads]: WebSocketCommand<K>;
};

const handlersMap: {
  [K in keyof SocketPayloads]: (
    payload: SocketPayloads[K],
    ws: WebSocket
  ) => void;
} = {
  'clone-repo': cloneRepoHandler,
  'other-action': () => {},
};

const socketMessageDispatcher = (
  ws: WebSocket,
  message: RawData,
  isBinary: boolean
) => {
  try {
    logger.info('message recieved: ' + message, {});
    const parsed = JSON.parse(message.toString()) as WebSocketCommand<any>;
    const command = parsed.action as keyof WebSocketCommandsMap;

    handlersMap[command](parsed.payload, ws);
  } catch (err) {
    logger.error('Error parsing message: ' + message, err);
    ws.send('Repository clone error');
  }
};

export default socketMessageDispatcher;
