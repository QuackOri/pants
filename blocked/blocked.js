document.addEventListener('DOMContentLoaded', () => {
    const originalUrl = new URLSearchParams(window.location.search).get('originalUrl');
    console.log(originalUrl);
    // const reportButton = document.getElementById('report-button');
  
    // if (originalUrl) {
    //   document.getElementById('blocked-url').textContent = originalUrl;
  
    //   reportButton.addEventListener('click', () => {
    //     fetch('http://uskawjdu.iptime.org:8080/report', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({ url: originalUrl, html: document.documentElement.outerHTML })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //       alert('The URL has been reported.');
    //     })
    //     .catch(error => {
    //       console.error('Error reporting URL:', error);
    //     });
    //   });
    // }
  });
  