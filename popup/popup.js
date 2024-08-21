console.log("This is a popup!");
document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggle-switch');
    const toggleLabel = document.getElementById('toggle-label');
    const slider = document.getElementById('slider');
    const sliderValue = document.getElementById('sliderValue');
    
    chrome.storage.sync.get(['enabled', 'threshold'], function(data) {
        const isEnabled = data.enabled !== undefined ? data.enabled : true;
        const threshold = data.threshold !== undefined ? data.threshold : 70;

        updateToggleState(isEnabled);
        updateSlider(threshold);
    });

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.action == 'updatePrediction') {
            console.log(message.value);
            const predictedValue = message.value;
            const resultElement = document.getElementById('predictedValue');
            resultElement.textContent = `${predictedValue}%`;
        }
    });

    // 스위치 클릭 시 상태 변경
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