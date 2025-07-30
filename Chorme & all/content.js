// content.js
const version = "1.2";

function enhanceDates() {
  document.querySelectorAll('relative-time').forEach(el => {
    if (el.parentElement?.classList.contains('gh-date-enhanced')) return;

    const isoDate = el.getAttribute('datetime');
    if (!isoDate) return;

    const formattedDate = formatDate(isoDate);

    const container = document.createElement('span');
    container.className = 'gh-date-enhanced';

    const absoluteEl = document.createElement('span');
    absoluteEl.className = 'gh-absolute-date';
    absoluteEl.textContent = formattedDate;

    const relativeClone = el.cloneNode(true);
    relativeClone.classList.add('gh-relative-time');

    container.appendChild(absoluteEl);
    container.appendChild(relativeClone);

    el.parentNode.replaceChild(container, el);
  });

  if (!document.getElementById('gh-date-styles')) {
    const style = document.createElement('style');
    style.id = 'gh-date-styles';
    style.textContent = `
      .gh-date-enhanced {
        display: inline;
        margin-left: 6px;
      }
      .gh-absolute-date {
        display: inline;
        font-weight: 500;
        color: var(--color-fg-default);
        white-space: nowrap;
      }
      .gh-relative-time {
        display: inline;
        color: var(--color-fg-muted);
        font-style: normal;
        margin-left: 4px;
      }
      [data-color-mode="light"][data-light-theme*="light"] .gh-absolute-date {
        color: #24292f;
      }
      [data-color-mode="light"][data-light-theme*="light"] .gh-relative-time {
        color: #57606a;
      }
      [data-color-mode="dark"][data-dark-theme*="dark"] .gh-absolute-date {
        color: #e6edf3;
      }
      [data-color-mode="dark"][data-dark-theme*="dark"] .gh-relative-time {
        color: #7d8590;
      }
    `;
    document.head.appendChild(style);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Observe mutations and debounce calls to enhanceDates for dynamic content (files list, etc)
let debounceTimer;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    enhanceDates();
  }, 250);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial call when content script loads
enhanceDates();
