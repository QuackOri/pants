console.log("This is a popup!");
document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggle-switch');
    const toggleLabel = document.getElementById('toggle-label');
    const slider = document.getElementById('slider');
    const sliderValue = document.getElementById('sliderValue');
    
    chrome.storage.sync.get(['enabled', 'threshold'], function(data) {
        const isEnabled = data.enabled || true;
        const threshold = data.threshold !== undefined ? data.threshold : 50;

        updateToggleState(isEnabled);
        updateSlider(threshold);
    })

    // 스위치 클릭 시 상태 변경
    toggleSwitch.addEventListener('click', function () {
        const isEnabled = !toggleSwitch.classList.contains('on');
        chrome.storage.sync.set({ enabled: isEnabled }, function () {
            console.log('Button is ' + (isEnabled ? 'enabled' : 'disabled'));
            updateToggleState(isEnabled);
        });
        //chrome.runtime.sendMessage({ enabled: isEnabled });
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

// const sliderContainer = document.getElementById('sliderContainer');
// const slider = document.getElementById('slider');
// const sliderHandle = document.getElementById('sliderHandle');
// const sliderValue = document.getElementById('sliderValue');

// let isDragging = false;

// function updateSliderValue(clientY) {
//     const rect = sliderContainer.getBoundingClientRect();
//     const containerHeight = rect.height;
//     const offsetY = Math.min(Math.max(0, rect.bottom - clientY), containerHeight);
//     const percentage = (offsetY / containerHeight) * 100;

//     slider.style.height = percentage + '%';
//     sliderValue.textContent = Math.round(percentage) + '%';
// }

// sliderHandle.addEventListener('mousedown', (e) => {
//     isDragging = true;
//     document.body.style.userSelect = 'none'; // 드래그 중 텍스트 선택 비활성화
// });

// document.addEventListener('mousemove', (e) => {
//     if (isDragging) {
//         updateSliderValue(e.clientY);
//     }
// });

// document.addEventListener('mouseup', () => {
//     isDragging = false;
//     document.body.style.userSelect = ''; // 드래그 종료 후 텍스트 선택 활성화
// });