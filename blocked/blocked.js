document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('return-button').addEventListener('click', function () {
      const urlParams = new URLSearchParams(window.location.search);
      const originalUrl = urlParams.get('originalUrl');

      fetch('http://uskawjdu.iptime.org:8080/report', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url: originalUrl })
      })
      .then(response => response.json())
      .then(data => {
          alert('The site has been reported.');
      })
      .catch(error => {
          console.error('Error reporting the site:', error.message);
      });
  });

  document.getElementById('return-button').addEventListener('click', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const originalUrl = urlParams.get('originalUrl');
    chrome.storage.sync.set({blocked: false}); 
    if (originalUrl) {
        window.location.href = decodeURIComponent(originalUrl);
    } else {
        chrome.storage.sync.set({blocked: true}); 
        window.history.back();
    }
  });
});
