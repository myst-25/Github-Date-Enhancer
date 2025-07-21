// content.js
function enhanceDates() {
  document.querySelectorAll('relative-time').forEach(el => {
    // Skip if already enhanced
    if (el.parentElement.classList.contains('gh-date-enhanced')) return;
    
    // Get ISO date string from datetime attribute
    const isoDate = el.getAttribute('datetime');
    if (!isoDate) return;
    
    // Format date to "Month DD, YYYY"
    const formattedDate = formatDate(isoDate);
    
    // Create container for both date elements
    const container = document.createElement('span');
    container.className = 'gh-date-enhanced';
    
    // Create absolute date element
    const absoluteEl = document.createElement('span');
    absoluteEl.className = 'gh-absolute-date';
    absoluteEl.textContent = formattedDate;
    
    // Clone the relative time element
    const relativeClone = el.cloneNode(true);
    relativeClone.classList.add('gh-relative-time');
    
    // Add elements to container
    container.appendChild(absoluteEl);
    container.appendChild(relativeClone);
    
    // Replace original element with new container
    el.parentNode.replaceChild(container, el);
  });
  
  // Inject minimal styles if needed
  if (!document.getElementById('gh-date-styles')) {
    const style = document.createElement('style');
    style.id = 'gh-date-styles';
    style.textContent = `
      /* Container styling */
      .gh-date-enhanced {
        display: inline;
        margin-left: 6px;
      }
      
      /* Absolute date styling */
      .gh-absolute-date {
        display: inline;
        font-weight: 500;
        color: var(--color-fg-default);
      }
      
      /* Relative time styling */
      .gh-relative-time {
        display: inline;
        color: var(--color-fg-muted);
        font-style: normal;
        margin-left: 4px;
      }
      
      /* GitHub theme compatibility */
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

// Format date without time or timezone
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Initial enhancement
enhanceDates();

// Observer for dynamic content
const observer = new MutationObserver(() => {
  enhanceDates();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Handle GitHub's PJAX navigation
document.addEventListener('pjax:end', enhanceDates);

// Message handler for popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_GH_DATES') {
        const dates = Array.from(document.querySelectorAll('.gh-absolute-date'))
            .map(el => el.textContent);
        
        // Return first and last unique dates
        const uniqueDates = [...new Set(dates)];
        const result = [];
        if (uniqueDates.length > 0) result.push(uniqueDates[0]);
        if (uniqueDates.length > 1) result.push(uniqueDates[uniqueDates.length - 1]);
        
        sendResponse({ dates: result });
    }
});