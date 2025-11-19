// settings.js - Settings functionality

document.addEventListener('DOMContentLoaded', function() {
    // Apply theme from settings
    applyTheme();
    
    // Set up event listeners
    setupEventListeners();
});

// Apply theme based on settings
function applyTheme() {
    const settings = getSettings();
    const themeToggle = document.getElementById('theme-toggle');
    
    if (settings.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.checked = false;
    }
}

// Set up event listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('change', toggleTheme);
    
    // Export data
    document.getElementById('export-btn').addEventListener('click', exportData);
    
    // Import data
    document.getElementById('import-btn').addEventListener('click', function() {
        document.getElementById('import-input').click();
    });
    
    document.getElementById('import-input').addEventListener('change', importData);
    
    // Clear data
    document.getElementById('clear-btn').addEventListener('click', openClearModal);
    
    // Clear data modal
    document.getElementById('close-clear-modal').addEventListener('click', closeClearModal);
    document.getElementById('confirm-clear').addEventListener('click', confirmClearData);
    document.getElementById('cancel-clear').addEventListener('click', closeClearModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('clear-modal')) {
            closeClearModal();
        }
    });
}

// Toggle theme
function toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const theme = themeToggle.checked ? 'dark' : 'light';
    
    saveSettings({ theme });
    
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    showToast(`Theme changed to ${theme} mode`);
}

// Export data
function exportData() {
    const data = getData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `business-data-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Data exported successfully!');
}

// Import data
function importData(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const jsonData = e.target.result;
            const success = importData(jsonData);
            
            if (success) {
                showToast('Data imported successfully!');
                // Apply theme if changed
                applyTheme();
            } else {
                showToast('Error: Invalid JSON data');
            }
        } catch (error) {
            showToast('Error importing data');
        }
    };
    
    reader.readAsText(file);
    
    // Reset the input to allow importing the same file again
    event.target.value = '';
}

// Open clear data modal
function openClearModal() {
    document.getElementById('clear-modal').classList.add('active');
}

// Close clear data modal
function closeClearModal() {
    document.getElementById('clear-modal').classList.remove('active');
}

// Confirm clear data
function confirmClearData() {
    clearAllData();
    closeClearModal();
    showToast('All data cleared successfully!');
    
    // Apply theme after clearing data
    applyTheme();
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}