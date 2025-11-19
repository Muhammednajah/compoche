// tasks.js - Task Management functionality

document.addEventListener('DOMContentLoaded', function() {
    // Apply theme from settings
    applyTheme();
    
    // Load tasks
    loadTasks();
    
    // Set up event listeners
    setupEventListeners();
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

// Set up event listeners
function setupEventListeners() {
    // Add task button
    document.getElementById('add-task-btn').addEventListener('click', openAddModal);
    
    // Modal close buttons
    document.getElementById('close-modal').addEventListener('click', closeTaskModal);
    document.getElementById('close-delete-modal').addEventListener('click', closeDeleteModal);
    
    // Task form submission
    document.getElementById('task-form').addEventListener('submit', saveTask);
    
    // Delete confirmation buttons
    document.getElementById('confirm-delete').addEventListener('click', confirmDelete);
    document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', searchTasks);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('task-modal')) {
            closeTaskModal();
        }
        if (event.target === document.getElementById('delete-modal')) {
            closeDeleteModal();
        }
    });
}

// Load and display tasks
function loadTasks() {
    const tasks = getDataType('tasks');
    const taskList = document.getElementById('task-list');
    
    // Clear existing tasks
    taskList.innerHTML = '';
    
    // Sort tasks by due date
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    // Add task items
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Format due date
        const dueDate = new Date(task.dueDate);
        const formattedDate = dueDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Check if task is overdue
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isOverdue = !task.completed && dueDate < today;
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskComplete('${task.id}')">
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                <div class="task-due ${isOverdue ? 'overdue' : ''}">Due: ${formattedDate}</div>
            </div>
            <div class="task-actions">
                <button class="btn btn-secondary" onclick="editTask('${task.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
}

// Open add task modal
function openAddModal() {
    document.getElementById('modal-title').textContent = 'Add Task';
    document.getElementById('task-form').reset();
    
    // Set default due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('due-date').value = tomorrow.toISOString().split('T')[0];
    
    document.getElementById('task-form').setAttribute('data-id', '');
    document.getElementById('task-modal').classList.add('active');
}

// Close task modal
function closeTaskModal() {
    document.getElementById('task-modal').classList.remove('active');
}

// Edit task
function editTask(id) {
    const tasks = getDataType('tasks');
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        document.getElementById('modal-title').textContent = 'Edit Task';
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description || '';
        document.getElementById('due-date').value = task.dueDate;
        document.getElementById('task-form').setAttribute('data-id', id);
        document.getElementById('task-modal').classList.add('active');
    }
}

// Save task (add or update)
function saveTask(event) {
    event.preventDefault();
    
    const id = document.getElementById('task-form').getAttribute('data-id');
    const task = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        dueDate: document.getElementById('due-date').value,
        completed: false
    };
    
    if (id) {
        // Update existing task
        const existingTask = getDataType('tasks').find(t => t.id === id);
        task.completed = existingTask.completed;
        updateItem('tasks', id, task);
        showToast('Task updated successfully!');
    } else {
        // Add new task
        task.id = generateId();
        addItem('tasks', task);
        showToast('Task added successfully!');
    }
    
    closeTaskModal();
    loadTasks();
}

// Toggle task completion
function toggleTaskComplete(id) {
    const tasks = getDataType('tasks');
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        task.completed = !task.completed;
        updateItem('tasks', id, task);
        loadTasks();
        showToast(task.completed ? 'Task marked as completed!' : 'Task marked as pending!');
    }
}

// Delete task
function deleteTask(id) {
    document.getElementById('delete-modal').setAttribute('data-id', id);
    document.getElementById('delete-modal').classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
}

// Confirm delete
function confirmDelete() {
    const id = document.getElementById('delete-modal').getAttribute('data-id');
    deleteItem('tasks', id);
    closeDeleteModal();
    loadTasks();
    showToast('Task deleted successfully!');
}

// Search tasks
function searchTasks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? '' : 'none';
    });
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