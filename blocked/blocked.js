document.getElementById('report-button').addEventListener('click', function () {
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

// "Return Page" 버튼 클릭 시 이전 페이지로 돌아가기
document.getElementById('return-button').addEventListener('click', function () {
  window.history.back();
});
