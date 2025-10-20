document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup DOM loaded');
  const exportBtn = document.getElementById('exportBtn');
  const excelLangSelect = document.getElementById('excelLang');
  if (!exportBtn) {
    console.error('Button with ID exportBtn not found');
    alert('Error: Button not found in popup. Check popup.html.');
    return;
  }
  // get local lựa chọn bản excel
    chrome.storage.local.get(['excelLang'], (result) => {
    if (result.excelLang) {
      excelLangSelect.value = result.excelLang;
      console.log('Khôi phục lựa chọn:', result.excelLang);
    }
  });
  // thay đổi lựa chọn
  excelLangSelect.addEventListener('change', () => {
    const selected = excelLangSelect.value;
    console.log(selected);
    
    chrome.storage.local.set({ excelLang: selected }, () => {
      console.log('Đã lưu lựa chọn:', selected);
    });
  });
  exportBtn.addEventListener('click', () => {
    const excelLang = excelLangSelect.value;
    chrome.storage.local.set({ excelLang });
    console.log('Export button clicked');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        console.error('Không tìm thấy tab active');
        // alert('Error: Không tìm thấy tab active.'); // tắt alert tạm thời
        return;
      }
      // console.log('Injecting extract.js into tab:', tabs[0].id);
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['extract.js']
      }).then(() => {
        console.log('Gắn script thành công');
      }).catch((error) => {
        console.error('Script injection error:', error);
        alert('Error: Cannot inject script. ' + error.message);
      });
    });
  });
});