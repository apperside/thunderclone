import tippy, { Instance, Props } from "tippy.js";
import utils from "./utils";

let socketReady = false;
let ws: WebSocket | null = null;

/**
 * Function which actually injects the button
 */
function addButton() {
  const codeButton = Array.from(document.querySelectorAll("button")).find(
    (button) => button.querySelector("span")?.innerText === "Code"
  );
  if (codeButton) {
    const newButton = document.createElement("button");
    newButton.innerText = "Thunderclone";
    newButton.style.marginLeft = "10px";
    newButton.className = "btn btn-sm btn-primary";

    codeButton.parentNode?.insertBefore(newButton, codeButton.nextSibling);

    // Initialize Tippy on the new button with HTML content
    tippy(newButton, {
      content: `
        <div>
          <input type="text" id="tippyInput" placeholder="Enter password">
          <button id="tippyCloneButton">Clone</button>
        </div>
      `,
      allowHTML: true,
      interactive: true,
      theme: "light",
      animation: "scale",
      trigger: "click",
      onShow: (instance) => {
        const cloneButton = instance.popper.querySelector("#tippyCloneButton");
        if (cloneButton) {
          (cloneButton as HTMLElement).onclick = () =>
            handleCloneClick(instance);
        }
      },
    });
  }
}

/**
 * In order to improve security, to clone a repository, the user must enter the secret word used to launch the desktop app.
 * and the signature of the request is created using the HMAC algorithm with the secret word
 * and the request is sent to the desktop app
 */
function handleCloneClick(tippyInstance: Instance<Props>) {
  const inputElement = tippyInstance.popper.querySelector("#tippyInput");
  const secret = (inputElement as any)?.value?.trim();

  if (!socketReady) {
    console.error("WebSocket is not connected");
    alert(
      "Unable to connect to Thunderclone service. Please make sure the desktop app is running."
    );
    return;
  }

  tippyInstance.setContent("Cloning repository...");

  const timestamp = Date.now();
  const url = window.location.href;
  const dataToSign = `${url}|${timestamp}`;

  utils.createSignature(dataToSign, secret).then((signature) => {
    const message = JSON.stringify({
      action: "clone-repo",
      payload: {
        url: url,
        timestamp: timestamp,
      },
      signature: signature,
    });
    ws?.send(message);
    console.log("Message sent to WebSocket:", message);

    tippyInstance.setContent("Repository cloning initiated!");
    setTimeout(() => {
      tippyInstance.hide();
    }, 3000);
  });
}

function init() {
  ws = new WebSocket("ws://localhost:3456");

  ws.onopen = function () {
    console.log("WebSocket Client Connected");
    socketReady = true;
  };

  ws.onerror = function (error) {
    console.error("WebSocket Error:", error);
  };

  ws.onclose = function (event) {
    console.log("WebSocket Closed:", event.code, event.reason);
    socketReady = false;
  };

  if (document.readyState !== "loading") {
    addButton();
  } else {
    document.addEventListener("DOMContentLoaded", addButton);
  }
}

export default init;
