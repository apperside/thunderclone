import crypto from "crypto";
import { WebSocketServer } from "ws";
import cacheUtils from "../../inMemoryCache";
import logger from "../../logger";
import notifications from "../notifications-utils";
import socketMessageDispatcher from "./socketMessageDispatcher";

let wss: WebSocketServer | undefined = undefined;

function verifyToken(providedToken: string): boolean {
  const storedToken = cacheUtils.getToken();
  if (!providedToken || !storedToken) {
    return false;
  }
  // Use timing-safe comparison to prevent timing attacks
  if (providedToken.length !== storedToken.length) {
    return false;
  }
  try {
    return crypto.timingSafeEqual(
      Buffer.from(providedToken),
      Buffer.from(storedToken)
    );
  } catch (err) {
    logger.error("Error verifying token", err);
    return false;
  }
}

function startService() {
  if (!wss) {
    wss = new WebSocketServer({ port: 3456 });

    wss.on("connection", (ws) => {
      console.log("Client connected");

      ws.on("message", async (message) => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          const { action, payload, token } = parsedMessage;

          // Verify the token
          const isValid = verifyToken(token);

          if (isValid) {
            logger.info("Token verified successfully");
            socketMessageDispatcher(ws, message, false);
          } else {
            logger.warn("Invalid token received");
            notifications.showMessage(
              "Authentication Failed",
              "Invalid token. Please check your extension settings."
            );
            console.error("Invalid token");
            ws.send(
              JSON.stringify({
                error: "Invalid token",
                message:
                  "Authentication failed. Please ensure your extension has the correct token configured.",
              })
            );
          }
        } catch (error) {
          console.error("Error processing message:", error);
          ws.send(JSON.stringify({ error: "Error processing message" }));
        }
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });
    wss.on("open", () => console.log("socket open"));
    wss.on("error", console.error);
    notifications.showMessage("Thunderclone", "Server started");
    cacheUtils.setServiceRunning(true);
  }
}

function stopService() {
  console.log("wss", wss);
  if (wss) {
    notifications.showMessage("Thunderclone", "Server stopped");
    wss.close();
    wss = null;
    cacheUtils.setServiceRunning(false);
  }
}

const networkingUtils = {
  startService,
  stopService,
  verifyToken,
};

export default networkingUtils;
