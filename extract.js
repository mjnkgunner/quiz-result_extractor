(function() {
  // console.log('Extract script injected on page:', window.location.href);

  async function loadExcelLang() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['excelLang'], (result) => {
        resolve(result.excelLang || "en");
      });
    });
  }

  async function extractAndExport() {
    const excelLang = await loadExcelLang();

    const table = document.querySelector('.table-responsive table');
    if (!table) {
      console.warn('Không tìm được thẻ Div với class là table-responsive.');
      return;
    }

    const headerCells = table.querySelectorAll('thead th');
    if (!headerCells.length) {
      console.warn('Không tìm được header');
      return;
    }

    let loginIndex = -1;
    let percentIndex = -1;
    headerCells.forEach((th, i) => {
      const text = th.textContent.trim().toLowerCase();
      if (text.includes('login') || text.includes('đăng nhập')) loginIndex = i;
      if (text.includes('percent solved')) percentIndex = i;
    });

    if (loginIndex === -1 || percentIndex === -1) {
      alert('⚠️ Không tìm thấy cột "Login/Đăng nhập" hoặc "Percent Solved".');
      console.warn('Header not matched:', { loginIndex, percentIndex });
      return;
    }

    const rows = table.querySelectorAll('tbody tr');
    const data = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      const login = (cells[loginIndex]?.textContent || '').trim();
      const percentText = (cells[percentIndex]?.textContent || '').trim().replace('%', '').trim();
      const percent = parseFloat(percentText);
      if (login && !isNaN(percent)) {
        const mark = Math.round((percent / 10) * 10) / 10;
        const delimiter = excelLang === "vi" ? ";" : ",";
        data.push(`${login}${delimiter}${mark}`);
      }
    });

    const crumbSelectors = [
      '.breadcrumb .crumb a',
      'ol.breadcrumb.hidden-print li a'
    ];
    let crumbs = [];
    for (const selector of crumbSelectors) {
      const found = Array.from(document.querySelectorAll(selector)).map(a => a.textContent.trim());
      if (found.length) {
        crumbs = found;
        break;
      }
    }

    // Breadcrumb xử lí
    crumbs = crumbs.filter(text => !/làm\s*bài\s*quiz/i.test(text));
    const quizIndex = crumbs.findIndex(text => /^quiz\s*\d+/i.test(text));
    if (quizIndex > 0 && /^(quiz)$/i.test(crumbs[quizIndex - 1])) {
      crumbs.splice(quizIndex - 1, 1);
    }
    const lastParts = crumbs.slice(-4).join(' - ') || 'quiz_results';
    const safeFileName = lastParts.replace(/[\\/:*?"<>|]/g, '_') + '.txt';

    if (data.length > 0) {
      // console.log('✅ Extracted data:', data);
      chrome.runtime.sendMessage({ action: 'saveData', data, filename: safeFileName });
      // alert(`✅ Extracted ${data.length} rows.\nFile: ${safeFileName}`); //thông báo, tắt tạm thời
    } else {
      console.warn('⚠️ No valid Percent Solved data found.');
    }
  }

  extractAndExport();

  // watch dom mutation in order to rerun extract function
  const observer = new MutationObserver(() => {
    if (document.querySelector('.table-responsive table')) {
      extractAndExport();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Fallback thử lại sau 5s nếu cần
  // setTimeout(() => {
  //   extractAndExport();
  // }, 5000);
  // console.log('Extract script injected on page:', window.location.href);
})();