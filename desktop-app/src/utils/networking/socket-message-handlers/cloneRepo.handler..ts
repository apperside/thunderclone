import { spawn } from "child_process";
import { WebSocket } from "ws";

import { app, shell } from "electron";
import fs from "fs";
import path from "path";
import logger from "../../../logger";
import preferences from "../../../preferences";
import utils from "../../index";
import { SocketPayloads } from "../socketMessageDispatcher";

const cloneRepoHandler = (
  payload: SocketPayloads["clone-repo"],
  ws: WebSocket
) => {
  const url = payload.url;
  console.log("Received clone-repo command", url);

  const { owner, repo } = utils.parsing.parseGitHubUrl(url);
  //TODO: this should be configurable through a preferences window
  const clonePath = preferences.preferencesPanel.value(
    "cloning.cloneDirectory"
  );
  console.log("Clone path", clonePath);
  if (clonePath) {
    const exists = !!clonePath && fs.existsSync(clonePath);
    if (!exists) {
      utils.notifications.showMessage(
        "Thunderclone",
        "Clone path does not exist: " + clonePath
      );
      throw new Error("Clone path does not exist: " + clonePath);
    }
  }

  utils.notifications.showMessage("Thunderclone", "Clone started ");

  const basePath = clonePath || path.join(app.getPath("home"), ".thunderclone");
  const finalPath = path.join(basePath, owner, repo);

  // fire the clone command
  const ls = spawn("git", [
    "clone",
    `https://github.com/${owner}/${repo}`,
    `${finalPath}`,
  ]);

  ls.stdout.on("data", (data: any) => {
    logger.info(`stdout: ${data}`);
  });

  const showInFolder = () => {
    try {
      shell.openPath(finalPath);
      logger.info(`Showing item in folder: ${finalPath}`);
    } catch (err) {
      logger.error(`error: ${err}`);
    }
  };
  ls.on("close", (code: any) => {
    logger.info(`child process exited with code ${code}`);
    if (code === 0) {
      utils.notifications.showMessage(
        "Thunderclone",
        "Repository cloned successfully",
        showInFolder
      );
    } else {
      utils.notifications.showMessage(
        "Thunderclone",
        "Repository clone failed with error code " + code + "",
        showInFolder
      );
    }
  });
  ls.on("error", (error: { message: any }) => {
    logger.error(`error: ${error.message}`);
  });
  ls.stderr.on("data", (data: any) => {
    logger.info(`stderr: ${data}`);
  });

  ls.on("error", (error: { message: any }) => {
    logger.error(`error: ${error.message}`);
  });

  ls.on("close", (code: any) => {
    logger.info(`child process exited with code ${code}`);
  });

  // Add your logic to clone the repository here
  ws.send("Repository cloned successfully");
};

export default cloneRepoHandler;
