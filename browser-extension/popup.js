// Popup script
document.addEventListener('DOMContentLoaded', function() {
  // Get the secret word input field
  const secretWordInput = document.getElementById('secretWord');

  // Get the save button
  const saveButton = document.getElementById('save');

  // Get the reset button
  const resetButton = document.getElementById('reset');

  // Get the status display element
  const statusDisplay = document.getElementById('status');

  // Set the initial status
  statusDisplay.textContent = 'Enter your secret word and click Save';

  // Save button click event
  
  saveButton.addEventListener('click', function() {
    const secretWord = secretWordInput.value;
    const hashedSecret = md5(secretWord);
    chrome.storage.sync.set({secretWord: hashedSecret}, function() {
      console.log('Hashed secret word saved');
      alert('Secret word saved successfully!');
    });
  });

  // Reset button click event
  resetButton.addEventListener('click', function() {
    chrome.storage.sync.clear(function() {
      console.log('Secret word reset');
      statusDisplay.textContent = 'Secret word reset';
    });
  });

  // MD5 hashing function
  function md5(string) {
    const crypto = window.crypto || window.msCrypto;
    return crypto.subtle.digest('MD5', new TextEncoder().encode(string))
      .then(buffer => Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      );
  }
});