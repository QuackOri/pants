console.log("This is a popup!");
document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggle-switch');
    const toggleLabel = document.getElementById('toggle-label');
    const slider = document.getElementById('slider');
    const sliderValue = document.getElementById('sliderValue');
    const reportButton = document.getElementById('report-button');
    
    chrome.storage.local.get(['predictedValue'], function(result) {
        const predictedValue = result.predictedValue || '0.0';
        const resultElement = document.getElementById('predictedValue');
        resultElement.textContent = `${predictedValue}%`;
    });

    chrome.storage.sync.get(['enabled', 'threshold'], function(data) {
        const isEnabled = data.enabled !== undefined ? data.enabled : true;
        const threshold = data.threshold !== undefined ? data.threshold : 70;

        updateToggleState(isEnabled);
        updateSlider(threshold);
    });

    toggleSwitch.addEventListener('click', function () {
        chrome.storage.sync.get(['enabled'], function(data) {
            const isEnabled = data.enabled !== undefined ? data.enabled : true;
            const newIsEnabled = !isEnabled;
            chrome.storage.sync.set({ enabled: newIsEnabled }, function() {
                console.log('Button is ' + (newIsEnabled ? 'enabled' : 'disabled'));
                updateToggleState(newIsEnabled);
            });
        });
    });

    slider.addEventListener('mousedown', function (e) {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    reportButton.addEventListener('click', function() {
        const currentUrl = window.location.href;
        const serverUrl = 'http://uskawjdu.iptime.org:8080/postUrl';

        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: currentUrl })
        })
        .then(response => {
            if (response.ok) {
                alert('신고가 전송되었습니다.');
            } else {
                alert('신고 전송에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('오류 발생:', error);
            alert('신고 전송 중 오류가 발생했습니다.');
        });
    });

    function onMouseMove(e) {
        const rect = slider.parentNode.getBoundingClientRect();
        const containerHeight = rect.height;
        const offsetY = Math.min(Math.max(0, rect.bottom - e.clientY), containerHeight);
        const percentage = (offsetY / containerHeight) * 100;
        updateSlider(percentage);
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        const currentValue = parseInt(sliderValue.textContent);
        chrome.storage.sync.set({ threshold: currentValue }, function () {
            console.log('Threshold set to ' + currentValue + '%');
        });
    }

    function updateToggleState(isEnabled) {
        if (isEnabled) {
            toggleSwitch.classList.add('on');
            toggleLabel.textContent = 'Enabled';
        } else {
            toggleSwitch.classList.remove('on');
            toggleLabel.textContent = 'Disabled';
        }
    }

    function updateSlider(value) {
        slider.style.height = value + '%';
        sliderValue.textContent = Math.round(value) + '%';
    }
});