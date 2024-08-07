import crypto from "crypto";
import { WebSocketServer } from "ws";
import cacheUtils from "../../inMemoryCache";
import logger from "../../logger";
import notifications from "../notifications-utils";
import socketMessageDispatcher from "./socketMessageDispatcher";

let wss: WebSocketServer | undefined = undefined;

// Add this function to verify the signature

async function verifySignature(
  data: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    logger.info("verify signature");
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(data);
    const computedSignature = hmac.digest("hex");
    logger.info(JSON.stringify({ computedSignature, signature }));
    return computedSignature === signature;
  } catch (err) {
    logger.error("Error verifying signature", err);
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
          const { action, payload, signature } = parsedMessage;

          // Verify the signature
          const dataToVerify = `${payload.url}|${payload.timestamp}`;
          const isValid = await verifySignature(
            dataToVerify,
            signature,
            cacheUtils.getPassword()
          );

          if (isValid) {
            socketMessageDispatcher(ws, message, false);
          } else {
            notifications.showMessage("Error", "You entered the wrong password");
            console.error("Invalid signature");
            ws.send(JSON.stringify({ error: "Invalid signature" }));
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
  }
}

function stopService() {
  console.log("wss", wss);
  if (wss) {
    notifications.showMessage("Instaclone", "Server stopped");
    wss.close();
    wss = null;
  }
}

const networkingUtils = {
  startService,
  stopService,
  verifySignature,
};

export default networkingUtils;
