document.addEventListener('DOMContentLoaded', async function() {
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    const dateDynamic = document.getElementById('dateDynamic');
    
    // Set button URLs
    document.getElementById('sourceButton').href = "https://github.com/myst-25/github-date-enhancer";
    document.getElementById('githubButton').href = "https://github.com/myst-25";

    // Cross-browser tab query
    const tabs = await browser.tabs.query({active: true, currentWindow: true});
    const currentTab = tabs[0];
    const isGithub = currentTab.url && currentTab.url.includes('github.com');
    
    if (isGithub) {
        // Working status UI
        statusIcon.className = 'status-icon working';
        statusIcon.innerHTML = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm3.28 5.78-4.5 4.5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 0 1 1.06-1.06l1.47 1.47 3.97-3.97a.75.75 0 0 1 1.06 1.06Z"/>
        </svg>`;
        statusText.className = 'status-text working';
        statusText.textContent = 'Working on GitHub';

        // Get dates from content script
        try {
            const response = await browser.tabs.sendMessage(currentTab.id, { type: 'GET_GH_DATES' });
            if (response?.dates?.length > 0) {
                dateDynamic.innerHTML = response.dates.map(date => 
                    `<span class="absolute-date">${date}</span>`
                ).join(' <span style="margin:0 4px;">to</span> ');
            }
        } catch (e) {
            dateDynamic.innerHTML = '<span class="absolute-date">No dates found</span>';
        }
    } else {
        // Not working status UI
        statusIcon.className = 'status-icon not-working';
        statusIcon.innerHTML = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM4.5 7.25a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7Z"/>
        </svg>`;
        statusText.className = 'status-text not-working';
        statusText.textContent = 'Only works on GitHub';
    }

    // Add click events to buttons
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            browser.tabs.create({ url: e.currentTarget.href });
        });
    });
});