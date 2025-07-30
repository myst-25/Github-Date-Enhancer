// content.js
function formatDate(dateString) {
  // Returns "27, June 2025"
  const date = new Date(dateString);
  // e.g., new Date('2025-06-27T12:00:00Z')
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'long' }); // "June"
  const year = date.getFullYear();
  return `${day}, ${month} ${year}`;
}

function enhanceDates() {
  document.querySelectorAll('relative-time:not(.gh-date-enhanced)').forEach(el => {
    const isoDate = el.getAttribute('datetime');
    if (!isoDate) return;
    const formatted = formatDate(isoDate);

    // Replace the element with a span with your styling (optional)
    const span = document.createElement('span');
    span.className = 'gh-date-enhanced';
    span.textContent = formatted;

    el.parentNode.replaceChild(span, el);
  });

  // Optional: add style once if you want dates colored/bold
  if (!document.getElementById('gh-date-styles')) {
    const style = document.createElement('style');
    style.id = 'gh-date-styles';
    style.textContent = `
      .gh-date-enhanced {
        font-weight: 500;
        color: var(--color-fg-default, #ffffffff);
        white-space: nowrap;
        margin-left: 6px;
        line-height: 1.2;
      }
      [data-color-mode="dark"][data-dark-theme*="dark"] .gh-date-enhanced {
        color: #e6edf3;
      }
    `;
    document.head.appendChild(style);
  }
}

// Initial run
enhanceDates();

// Enhance instantly as new elements load dynamically
const observer = new MutationObserver(() => enhanceDates());
observer.observe(document.body, { childList: true, subtree: true });
