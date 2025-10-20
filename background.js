console.log('Background script loaded');

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'saveData') {
    const textContent = message.data.join('\n');
    const blob = new Blob([textContent], { type: "text/csv;charset=utf-8;" });

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      chrome.downloads.download({
        url: dataUrl,
        filename: message.filename || 'quiz_results.csv',
        saveAs: true
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error('Download error:', chrome.runtime.lastError.message);
        } else {
          console.log('Download started successfully:', message.filename);
        }
      });
    };
    reader.readAsDataURL(blob);
  }
});
