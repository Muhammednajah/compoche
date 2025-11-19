// dashboard.js - Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    // Apply theme from settings
    applyTheme();
    
    // Update dashboard data
    updateDashboard();
});

// Apply theme based on settings
function applyTheme() {
    const settings = getSettings();
    if (settings.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

// Update dashboard with current data
function updateDashboard() {
    // Get data from LocalStorage
    const employees = getDataType('employees');
    const clients = getDataType('clients');
    const inventory = getDataType('inventory');
    const tasks = getDataType('tasks');
    
    // Update basic counts
    document.getElementById('total-employees').textContent = employees.length;
    document.getElementById('total-clients').textContent = clients.length;
    document.getElementById('total-inventory').textContent = inventory.length;
    document.getElementById('total-tasks').textContent = tasks.length;
    
    // Calculate and update additional metrics
    const lowStockItems = inventory.filter(item => item.quantity <= 5).length;
    document.getElementById('low-stock').textContent = lowStockItems;
    
    const completedTasks = tasks.filter(task => task.completed).length;
    document.getElementById('completed-tasks').textContent = completedTasks;
    
    const pendingTasks = tasks.filter(task => !task.completed).length;
    document.getElementById('pending-tasks').textContent = pendingTasks;
    
    // Calculate overdue tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTasks = tasks.filter(task => {
        if (task.completed) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < today;
    }).length;
    
    document.getElementById('overdue-tasks').textContent = overdueTasks;
}