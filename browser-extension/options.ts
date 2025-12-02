const STORAGE_KEY = "thunderclone_auth_token";
const WS_URL = "ws://localhost:3456";

// DOM Elements
const tokenInput = document.getElementById("tokenInput") as HTMLInputElement;
const saveButton = document.getElementById("saveButton") as HTMLButtonElement;
const clearButton = document.getElementById("clearButton") as HTMLButtonElement;
const toggleVisibility = document.getElementById(
  "toggleVisibility"
) as HTMLButtonElement;
const statusDisplay = document.getElementById("statusDisplay") as HTMLDivElement;
const statusText = document.getElementById("statusText") as HTMLSpanElement;
const messageDisplay = document.getElementById(
  "messageDisplay"
) as HTMLDivElement;

// Load saved token on page load
document.addEventListener("DOMContentLoaded", async () => {
  await loadSavedToken();
  checkConnection();
});

async function loadSavedToken(): Promise<void> {
  try {
    const result = await chrome.storage.sync.get([STORAGE_KEY]);
    if (result[STORAGE_KEY]) {
      tokenInput.value = result[STORAGE_KEY];
    }
  } catch (error) {
    console.error("Error loading token:", error);
  }
}

async function saveToken(): Promise<void> {
  const token = tokenInput.value.trim();

  if (!token) {
    showMessage("Please enter a token", "error");
    return;
  }

  // Validate token format (should be 64 hex characters)
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    showMessage(
      "Invalid token format. Token should be 64 hexadecimal characters.",
      "error"
    );
    return;
  }

  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: token });
    showMessage("Token saved successfully!", "success");

    // Check connection with new token
    setTimeout(checkConnection, 500);
  } catch (error) {
    console.error("Error saving token:", error);
    showMessage("Failed to save token. Please try again.", "error");
  }
}

async function clearToken(): Promise<void> {
  try {
    await chrome.storage.sync.remove([STORAGE_KEY]);
    tokenInput.value = "";
    showMessage("Token cleared", "success");
    updateStatus("no-token", "No token configured");
  } catch (error) {
    console.error("Error clearing token:", error);
    showMessage("Failed to clear token", "error");
  }
}

function showMessage(text: string, type: "success" | "error"): void {
  messageDisplay.textContent = text;
  messageDisplay.className = `message ${type}`;

  // Auto-hide after 3 seconds
  setTimeout(() => {
    messageDisplay.className = "message";
  }, 3000);
}

function updateStatus(
  status: "connected" | "disconnected" | "no-token",
  text: string
): void {
  statusDisplay.className = `status ${status}`;
  statusText.textContent = text;
}

function checkConnection(): void {
  const token = tokenInput.value.trim();

  if (!token) {
    updateStatus("no-token", "No token configured");
    return;
  }

  updateStatus("no-token", "Checking connection...");

  const ws = new WebSocket(WS_URL);
  const timeout = setTimeout(() => {
    ws.close();
    updateStatus("disconnected", "Desktop app not running");
  }, 3000);

  ws.onopen = () => {
    clearTimeout(timeout);
    updateStatus("connected", "Connected to Thunderclone desktop app");
    ws.close();
  };

  ws.onerror = () => {
    clearTimeout(timeout);
    updateStatus("disconnected", "Cannot connect to desktop app");
  };
}

// Toggle password visibility
toggleVisibility.addEventListener("click", () => {
  if (tokenInput.type === "password") {
    tokenInput.type = "text";
    toggleVisibility.textContent = "Hide";
  } else {
    tokenInput.type = "password";
    toggleVisibility.textContent = "Show";
  }
});

// Save button click
saveButton.addEventListener("click", saveToken);

// Clear button click
clearButton.addEventListener("click", clearToken);

// Save on Enter key
tokenInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    saveToken();
  }
});
