console.log('Test message from content script.');

chrome.storage.sync.get(['enabled'], function(result) {
    if (result.enabled){
        console.log("send");
        const currentUrl = window.location.href;
        const pageHtml = document.documentElement.outerHTML;

        // function sendDataToServer(url, html) {
        //     const xhr = new XMLHttpRequest();
        //     xhr.open("POST", "http://uskawjdu.iptime.org:8080/predict", true);
        //     xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        
        //     xhr.onreadystatechange = function() {
        //         if (xhr.readyState === 4) { // 요청 완료 시
        //             if (xhr.status === 200) { // 서버가 200 OK를 반환하면
        //                 console.log("Success:", xhr.responseText);
        //             } else {
        //                 console.error("Error:", xhr.status, xhr.statusText);
        //             }
        //         }
        //     };
        
        //     xhr.send(JSON.stringify({
        //         url: currentUrl,
        //         html: pageHtml
        //     }));
        // }
        // sendDataToServer(currentUrl, pageHtml);

        // $.ajax({
        //     url: 'http://uskawjdu.iptime.org:8080/predict',
        //     type: 'POST',
        //     data: JSON.stringify({
        //         url: currentUrl,
        //         html: pageHtml
        //     }),
        //     contentType: 'application/json',
        //     success: function(response) {
        //         console.log('Success');
        //     },
        //     error: function(xhr, status, error){
        //         console.log('Error');
        //     }
        // });

        fetch('http://uskawjdu.iptime.org:8080/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: currentUrl,
                html: pageHtml
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});
