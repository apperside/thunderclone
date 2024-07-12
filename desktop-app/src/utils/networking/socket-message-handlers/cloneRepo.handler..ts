import { spawn } from 'child_process';
import { WebSocket } from 'ws';

import { SocketPayloads } from '../socketMessageDispatcher';
import utils from '../../index';
import logger from '../../../logger';
import { app } from 'electron';
import path from 'path';
const cloneRepoHandler = (
  payload: SocketPayloads['clone-repo'],
  ws: WebSocket
) => {
  const url = payload.url;
  console.log('Received clone-repo command', url);

  const { owner, repo } = utils.parsing.parseGitHubUrl(url);
  //TODO: this should be configurable through a preferences window

  const ls = spawn('git', [
    'clone',
    `https://github.com/${owner}/${repo}`,
    `${path.join(app.getPath('home'), '.thunderclone', owner, repo)}`,
  ]);
  ls.stdout.on('data', (data: any) => {
    logger.info(`stdout: ${data}`);
  });
  ls.on('close', (code: any) => {
    logger.info(`child process exited with code ${code}`);
    if (code === 0) {
      utils.notifications.showMessage(
        'Thunderclone',
        'Repository cloned successfully'
      );
    } else {
      utils.notifications.showMessage(
        'Thunderclone',
        'Repository clone failed with error code ' + code + ''
      );
    }
  });
  ls.on('error', (error: { message: any }) => {
    logger.error(`error: ${error.message}`);
  });
  ls.stderr.on('data', (data: any) => {
    logger.info(`stderr: ${data}`);
  });

  ls.on('error', (error: { message: any }) => {
    logger.error(`error: ${error.message}`);
  });

  ls.on('close', (code: any) => {
    logger.info(`child process exited with code ${code}`);
  });

  // Add your logic to clone the repository here
  ws.send('Repository cloned successfully');
};

export default cloneRepoHandler;
