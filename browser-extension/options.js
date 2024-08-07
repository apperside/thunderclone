document.getElementById('save').addEventListener('click', function() {
    const secretWord = document.getElementById('secretWord').value;
    chrome.storage.sync.set({secretWord: secretWord}, function() {
      console.log('Secret word saved');
    });
  });
  
  // Load saved secret word when options page is opened
  chrome.storage.sync.get('secretWord', function(data) {
    if (data.secretWord) {
      document.getElementById('secretWord').value = data.secretWord;
    }
  });