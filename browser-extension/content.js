// const secret = result.secretWord | "ciaociaociao";




let socketReady = false;
const ws = new WebSocket('ws://localhost:3456');
function initializeWebSocket() {

  ws.onopen = function () {
    console.log('WebSocket Client Connected');
    socketReady = true;
  };

  ws.onerror = function (error) {
    console.error('WebSocket Error:', error);
  };

  ws.onclose = function (event) {
    console.log('WebSocket Closed:', event.code, event.reason);
    socketReady = false;
  };

  function addButton() {
    const codeButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.querySelector('span')?.innerText === 'Code'
    );
    if (codeButton) {
      const newButton = document.createElement('button');
      newButton.innerText = 'Thunderclone';
      newButton.style.marginLeft = '10px';
      newButton.className = 'btn btn-sm btn-primary';

      codeButton.parentNode.insertBefore(newButton, codeButton.nextSibling);

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
        theme: 'light',
        animation: 'scale',
        trigger: 'click',
        onShow: (instance) => {
          const cloneButton = instance.popper.querySelector('#tippyCloneButton');
          cloneButton.onclick = () => handleCloneClick(instance);
        },
      });
    }
  }

  if (document.readyState !== 'loading') {
    addButton();
  } else {
    document.addEventListener('DOMContentLoaded', addButton);
  }
}

initializeWebSocket();

async function createSignature(data, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * In order to improve security, to clone a repository, the user must enter the secret word used to launch the desktop app.
 * and the signature of the request is created using the HMAC algorithm with the secret word
 * and the request is sent to the desktop app
 */
function handleCloneClick(tippyInstance) {
  const inputElement = tippyInstance.popper.querySelector('#tippyInput');
  const secret = inputElement.value.trim();

  if (!socketReady) {
    console.error('WebSocket is not connected');
    alert('Unable to connect to Thunderclone service. Please make sure the desktop app is running.');
    return;
  }

  tippyInstance.setContent('Cloning repository...');

  const timestamp = Date.now();
  const url = window.location.href;
  const dataToSign = `${url}|${timestamp}`;

  createSignature(dataToSign, secret).then((signature) => {
    const message = JSON.stringify({
      action: 'clone-repo',
      payload: {
        url: url,
        timestamp: timestamp,
      },
      signature: signature
    });
    ws.send(message);
    console.log('Message sent to WebSocket:', message);

    tippyInstance.setContent('Repository cloning initiated!');
    setTimeout(() => {
      tippyInstance.hide();
    }, 3000);
  });
}