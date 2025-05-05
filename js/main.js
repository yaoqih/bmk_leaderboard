// Function to change language
function changeLanguage(lang) {
    console.log(`Changing language to: ${lang}`); // Debug log
    document.documentElement.lang = lang; // Set the lang attribute on <html>
    localStorage.setItem('preferredLang', lang); // Save preference

    const elements = document.querySelectorAll('[data-lang-key]');
    console.log(`Found ${elements.length} elements to translate.`); // Debug log

    elements.forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[lang] && translations[lang][key]) {
            // Replace placeholders like [Model Name], [Story ID]
            let text = translations[lang][key];
            // Avoid replacing placeholders if the element itself is the placeholder target
            if (!element.hasAttribute('data-placeholder-target')) { 
                text = text.replace(/\[Model Name\]/g, getPlaceholder("modelName"));
                text = text.replace(/\[Story ID\]/g, getPlaceholder("storyId"));
                // Add more general replacements as needed
            }
            element.textContent = text;
        } else {
            console.warn(`Translation key '${key}' not found for language '${lang}'.`);
        }
    });

    // Special handling for responsive table headers (data-label)
    updateTableHeadersLang(lang);
}

// Function to get placeholder values (can be expanded)
function getPlaceholder(type) {
    const urlParams = new URLSearchParams(window.location.search);
    switch (type) {
        case "modelName":
            return urlParams.get('model') || "[Model Name]";
        case "storyId":
            return urlParams.get('story') || "[Story ID]";
        default:
            return `[${type}]`;
    }
}

// Update table header text for responsive view labels
function updateTableHeadersLang(lang) {
    // Use the translations object directly for labels
    const currentTranslations = translations[lang] || translations.en;

    // Function to apply labels to a table
    const applyLabels = (tableSelector, headerKeys) => {
        const table = document.querySelector(tableSelector);
        if (!table) return; // Exit if table not found on the current page

        // Apply labels to main rows only
        table.querySelectorAll('tbody tr.main-row td').forEach(td => {
            const cellIndex = td.cellIndex;
            // Skip label for the expand column (index 0 in detailed leaderboard)
            if (td.classList.contains('expand-col') || headerKeys[cellIndex] === null) {
                td.removeAttribute('data-label');
                return;
            }

            const headerKey = headerKeys[cellIndex]; // Get the key name from our defined order

            if (headerKey && currentTranslations[headerKey]) {
                const labelText = currentTranslations[headerKey] || '';
                td.setAttribute('data-label', labelText + ': ');
            } else {
                // Fallback: Use header text content if key mapping fails
                const th = table.querySelector(`thead th:nth-child(${cellIndex + 1})`);
                if (th) {
                    const thText = (th.textContent || '').replace(/[▲▼]/g, '').trim(); // Remove arrows
                    td.setAttribute('data-label', thText ? thText + ': ' : ' ');
                } else {
                    td.removeAttribute('data-label');
                }
            }
        });
    };

    // --- Apply labels based on page/table --- 
    // Keys arrays define the expected column order and corresponding translation key for each table

    // Index Page: Leaderboard Summary
    const indexHeaderKeys = ['model', 'timestamp', 'cref', 'sref', 'prompt', 'quality', 'overall', 'details'];
    applyLabels('#leaderboard table', indexHeaderKeys);

    // Model Detail Page: Story List
    const modelDetailHeaderKeys = ['story_id', 'cref', 'sref', 'prompt', 'quality', 'details'];
    applyLabels('#story-list table', modelDetailHeaderKeys);

    // Detailed Leaderboard Page
    const detailedHeaderKeys = [null, 'model', 'timestamp', 'table_dataset', 'table_mode', 'cref', 'sref', 'prompt', 'quality', 'overall', 'table_notes'];
    applyLabels('#detailed-leaderboard-table', detailedHeaderKeys);
}

// --- Expand/Collapse Logic ---
function toggleDetails(rowId) {
    const detailsRow = document.getElementById(rowId);
    // Find the icon within the previous sibling (the main row)
    const mainRow = detailsRow?.previousElementSibling;
    const icon = mainRow?.querySelector('.expand-icon');

    if (detailsRow && icon) {
        const isVisible = detailsRow.style.display !== 'none'; // Check current state accurately
        detailsRow.style.display = isVisible ? 'none' : 'table-row';
        icon.textContent = isVisible ? '+' : '-'; // Toggle icon
    }
}

// --- Sorting Logic --- 
let sortDirection = {}; // Stores { domColumnIndex: 'asc' | 'desc' }

function sortTable(domColumnIndex, type) {
    const table = document.getElementById('detailed-leaderboard-table');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr.main-row'));

    const currentDirection = sortDirection[domColumnIndex] === 'asc' ? 'desc' : 'asc';
    sortDirection = { [domColumnIndex]: currentDirection }; // Reset other column directions

    rows.sort((a, b) => {
        const cellA = a.cells[domColumnIndex];
        const cellB = b.cells[domColumnIndex];
        let valA = cellA?.textContent.trim();
        let valB = cellB?.textContent.trim();

        // Type handling
        if (type === 'number') {
             // Try getting score from span first
             const scoreA = cellA?.querySelector('.score');
             const scoreB = cellB?.querySelector('.score');
             valA = parseFloat(scoreA ? scoreA.textContent : valA) || 0;
             valB = parseFloat(scoreB ? scoreB.textContent : valB) || 0;
        } else if (type === 'date') {
            valA = new Date(valA).getTime() || 0;
            valB = new Date(valB).getTime() || 0;
        } else { // text
             valA = valA?.toLowerCase() || '';
             valB = valB?.toLowerCase() || '';
        }

        if (valA < valB) return currentDirection === 'asc' ? -1 : 1;
        if (valA > valB) return currentDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Re-append sorted rows with their detail rows
    rows.forEach(row => {
        tbody.appendChild(row);
        const detailsRowId = row.querySelector('.expand-icon')?.getAttribute('onclick')?.match(/\('(.*)'\)/)?.[1];
        if (detailsRowId) {
            const detailsRow = document.getElementById(detailsRowId);
            if (detailsRow) {
                tbody.appendChild(detailsRow);
            }
        }
    });

    // Update sort indicators
    updateSortIndicators(table, domColumnIndex, currentDirection);
}

function updateSortIndicators(table, activeDomColumnIndex, direction) {
    table.querySelectorAll('thead th').forEach((th, index) => {
         const arrow = th.querySelector('.sort-arrow');
         if (!arrow) return; // Skip headers without arrows (like expand col)

        if (index === activeDomColumnIndex) {
            arrow.textContent = direction === 'asc' ? ' ▲' : ' ▼';
        } else {
            arrow.textContent = ''; // Clear inactive arrows
        }
    });
}

// --- Active Navigation --- 
function setActiveNav() {
     let currentPage = window.location.pathname.split('/').pop();
     if (currentPage === '' || currentPage === '.') {
         currentPage = 'index.html';
     }
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href').split('/').pop();
        // Handle case where link is '/' or empty
        const effectiveLinkPage = (linkPage === '' || linkPage === '.') ? 'index.html' : linkPage;
        if (effectiveLinkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Set Initial Language
    const preferredLang = localStorage.getItem('preferredLang') || 'en';
    changeLanguage(preferredLang); // Apply language first (this calls updateTableHeadersLang)

    // 2. Set Active Navigation Link
    setActiveNav();

    // 3. Add Language Button Event Listeners (Ensure this runs AFTER changeLanguage)
    const btnEn = document.getElementById('lang-en-btn');
    const btnZh = document.getElementById('lang-zh-btn');
    if (btnEn) {
        btnEn.addEventListener('click', () => changeLanguage('en'));
    }
    if (btnZh) {
        btnZh.addEventListener('click', () => changeLanguage('zh'));
    }

     // 4. Initialize expand/collapse for detailed leaderboard if present
     const detailedTable = document.getElementById('detailed-leaderboard-table');
     if (detailedTable) {
         // Optional: Pre-collapse all detail rows on load (if not hidden by default)
         // detailedTable.querySelectorAll('tbody tr.details-row').forEach(row => row.style.display = 'none');
         // detailedTable.querySelectorAll('tbody span.expand-icon').forEach(icon => icon.textContent = '+');
     }

    // Note: Result Explorer initialization is handled in its own script block in story_detail.html
}); 