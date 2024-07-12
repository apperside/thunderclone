const ws = new WebSocket('ws://localhost:3456');

let socketReady = false;
ws.onopen = function () {
  console.log('WebSocket Client Connected');
  socketReady = true;
};
console.log('ws', ws);
console.log('ws.on', ws.on);

function addButton() {
  // Find the "Code" button
  const codeButton = Array.from(document.querySelectorAll('button')).find(
    (button) => button.querySelector('span')?.innerText === 'Code'
  );
  if (codeButton) {
    // Create a new button
    const newButton = document.createElement('button');
    newButton.innerText = 'Thunderclone';
    newButton.style.marginLeft = '10px';
    newButton.className = 'btn btn-sm btn-primary';

    // Insert the new button next to the "Code" button
    codeButton.parentNode.insertBefore(newButton, codeButton.nextSibling);

    console.log('Custom button added next to the Code button');
    // WebSocket connection
    const socket = new WebSocket('ws://localhost:3456'); // Update with the correct WebSocket URL

    // Event listener for WebSocket connection open
    socket.addEventListener('open', function (event) {
      console.log('WebSocket connection established');
    });

    // Event listener for WebSocket errors
    socket.addEventListener('error', function (event) {
      console.error('WebSocket error:', event);
    });

    // Event listener for button click
    newButton.onclick = function () {
      const message = JSON.stringify({
        action: 'clone-repo',
        payload: { url: window.location.href },
      });
      ws.send(message);
      console.log('Message sent to WebSocket:', message);
    };
  }
}
console.log('content.js loaded', document.readyState);
if (document.readyState !== 'loading') {
  console.log('document is already ready, just execute code here');
  addButton();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    console.log('document was not ready, place code here');
    addButton();
  });
}

console.log('content.js loaded');
