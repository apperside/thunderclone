import tippy, { Instance, Props } from "tippy.js";

const STORAGE_KEY = "thunderclone_auth_token";

let socketReady = false;
let ws: WebSocket | null = null;

/**
 * Get the stored authentication token from Chrome storage
 */
async function getStoredToken(): Promise<string | null> {
  try {
    const result = await chrome.storage.sync.get([STORAGE_KEY]);
    return result[STORAGE_KEY] || null;
  } catch (error) {
    console.error("Error getting stored token:", error);
    return null;
  }
}

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

    // Initialize Tippy on the new button for status feedback
    const tippyInstance = tippy(newButton, {
      content: "Click to clone repository",
      theme: "light",
      animation: "scale",
      trigger: "mouseenter",
    });

    // Handle click on the button
    newButton.addEventListener("click", () => handleCloneClick(tippyInstance));
  }
}

/**
 * Handle the clone button click - uses stored token for authentication
 */
async function handleCloneClick(tippyInstance: Instance<Props>) {
  // Check WebSocket connection
  if (!socketReady) {
    tippyInstance.setContent(
      "Unable to connect to Thunderclone. Please make sure the desktop app is running."
    );
    tippyInstance.show();
    setTimeout(() => tippyInstance.hide(), 3000);
    return;
  }

  // Get the stored token
  const token = await getStoredToken();

  if (!token) {
    tippyInstance.setContent(
      'No token configured. Click the Thunderclone extension icon to set up authentication.'
    );
    tippyInstance.show();
    setTimeout(() => tippyInstance.hide(), 4000);
    return;
  }

  tippyInstance.setContent("Cloning repository...");
  tippyInstance.show();

  const url = window.location.href;

  // Send the clone request with the token
  const message = JSON.stringify({
    action: "clone-repo",
    payload: {
      url: url,
      timestamp: Date.now(),
    },
    token: token,
  });

  ws?.send(message);
  console.log("Clone request sent to Thunderclone");

  tippyInstance.setContent("Clone request sent!");
  setTimeout(() => {
    tippyInstance.hide();
  }, 2000);
}

function init() {
  ws = new WebSocket("ws://localhost:3456");

  ws.onopen = function () {
    console.log("Thunderclone: WebSocket connected");
    socketReady = true;
  };

  ws.onerror = function (error) {
    console.error("Thunderclone: WebSocket error:", error);
  };

  ws.onclose = function (event) {
    console.log("Thunderclone: WebSocket closed:", event.code, event.reason);
    socketReady = false;

    // Attempt to reconnect after 5 seconds
    setTimeout(() => {
      if (!socketReady) {
        init();
      }
    }, 5000);
  };

  ws.onmessage = function (event) {
    try {
      const response = JSON.parse(event.data);
      if (response.error) {
        console.error("Thunderclone error:", response.error);
        // Could show a notification to the user here
      }
    } catch (e) {
      console.log("Thunderclone message:", event.data);
    }
  };

  if (document.readyState !== "loading") {
    addButton();
  } else {
    document.addEventListener("DOMContentLoaded", addButton);
  }
}

export default init;
