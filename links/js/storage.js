// storage.js - Helper functions for LocalStorage operations

// Initialize LocalStorage with default data if empty
function initializeStorage() {
    if (!localStorage.getItem('businessData')) {
        const initialData = {
            employees: [],
            clients: [],
            inventory: [],
            tasks: [],
            settings: {
                theme: 'light'
            }
        };
        localStorage.setItem('businessData', JSON.stringify(initialData));
    }
}

// Get all data from LocalStorage
function getData() {
    initializeStorage();
    return JSON.parse(localStorage.getItem('businessData'));
}

// Save all data to LocalStorage
function saveData(data) {
    localStorage.setItem('businessData', JSON.stringify(data));
}

// Get specific data type (employees, clients, etc.)
function getDataType(type) {
    const data = getData();
    return data[type] || [];
}

// Save specific data type
function saveDataType(type, items) {
    const data = getData();
    data[type] = items;
    saveData(data);
}

// Add a new item to a specific data type
function addItem(type, item) {
    const items = getDataType(type);
    items.push(item);
    saveDataType(type, items);
}

// Update an item in a specific data type
function updateItem(type, id, updatedItem) {
    const items = getDataType(type);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items[index] = { ...items[index], ...updatedItem };
        saveDataType(type, items);
        return true;
    }
    return false;
}

// Delete an item from a specific data type
function deleteItem(type, id) {
    const items = getDataType(type);
    const filteredItems = items.filter(item => item.id !== id);
    saveDataType(type, filteredItems);
}

// Get settings
function getSettings() {
    const data = getData();
    return data.settings || { theme: 'light' };
}

// Save settings
function saveSettings(settings) {
    const data = getData();
    data.settings = { ...data.settings, ...settings };
    saveData(data);
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export all data as JSON
function exportData() {
    return JSON.stringify(getData(), null, 2);
}

// Import data from JSON
function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        saveData(data);
        return true;
    } catch (e) {
        console.error('Invalid JSON data', e);
        return false;
    }
}

// Clear all data
function clearAllData() {
    localStorage.removeItem('businessData');
    initializeStorage();
}