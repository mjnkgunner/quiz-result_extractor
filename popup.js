document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup DOM loaded');
  const exportBtn = document.getElementById('exportBtn');
  if (!exportBtn) {
    console.error('Button with ID exportBtn not found');
    alert('Error: Button not found in popup. Check popup.html.');
    return;
  }
  
  
  exportBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        console.error('Không tìm thấy tab active');
        // alert('Error: Không tìm thấy tab active.'); // tắt alert tạm thời
        return;
      }
      // console.log('Injecting extract.js into tab:', tabs[0].id);
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['script.js']
      }).then(() => {
        console.log('Gắn script thành công');
      }).catch((error) => {
        console.error('Script injection error:', error);
        alert('Error: Cannot inject script. ' + error.message);
      });
    });
  });
});