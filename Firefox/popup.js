const version = "1.2";

async function checkStatus() {
  const statusIcon = document.getElementById('status-icon');
  const statusText = document.getElementById('status-text');
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    const isGithub = currentTab && currentTab.url && currentTab.url.includes('github.com');
    if (isGithub) {
      updateStatus('working', '✅', 'Working: Github enhanced');
    } else {
      updateStatus('not-working', '❌', 'Only works on GitHub');
    }
  } catch (error) {
    console.error('Error querying tabs:', error);
    updateStatus('not-working', '!', 'Unable to retrieve tab info.');
  }
}

function updateStatus(statusClass, iconText, message) {
  const statusIcon = document.getElementById('status-icon');
  const statusText = document.getElementById('status-text');
  statusIcon.className = `status-icon ${statusClass}`;
  statusIcon.textContent = iconText;
  statusText.className = `status-text ${statusClass}`;
  statusText.textContent = message;
}

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const dateDynamic = document.getElementById('date-dynamic');
  const sourceButton = document.getElementById('source-button');
  const githubButton = document.getElementById('github-button');
  const refreshBtn = document.getElementById('refresh-btn');

  // Set button URLs
  if (sourceButton) sourceButton.href = "https://github.com/myst-25/github-date-enhancer";
  if (githubButton) githubButton.href = "https://github.com/myst-25";

  // Hide dateDynamic if present (hidden by default in CSS)
  if (dateDynamic) dateDynamic.style.display = 'none';

  // Check status on popup load
  checkStatus();

  // Open all <a> tags in new tabs
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      browser.tabs.create({ url: link.href });
    });
  });

  // Refresh button: reload tab and rerun status check
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        await browser.tabs.reload(tabs[0].id);
        // Wait a moment to let the reload start, then recheck status
        setTimeout(checkStatus, 700);
      }
    });
  }
});
