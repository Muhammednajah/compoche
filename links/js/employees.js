// employees.js - Employee Management functionality

document.addEventListener('DOMContentLoaded', function() {
    // Apply theme from settings
    applyTheme();
    
    // Load employees
    loadEmployees();
    
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
    // Add employee button
    document.getElementById('add-employee-btn').addEventListener('click', openAddModal);
    
    // Modal close buttons
    document.getElementById('close-modal').addEventListener('click', closeEmployeeModal);
    document.getElementById('close-delete-modal').addEventListener('click', closeDeleteModal);
    
    // Employee form submission
    document.getElementById('employee-form').addEventListener('submit', saveEmployee);
    
    // Delete confirmation buttons
    document.getElementById('confirm-delete').addEventListener('click', confirmDelete);
    document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', searchEmployees);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('employee-modal')) {
            closeEmployeeModal();
        }
        if (event.target === document.getElementById('delete-modal')) {
            closeDeleteModal();
        }
    });
}

// Load and display employees
function loadEmployees() {
    const employees = getDataType('employees');
    const tbody = document.getElementById('employees-tbody');
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add employee rows
    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.jobTitle}</td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>
                <button class="btn btn-secondary" onclick="editEmployee('${employee.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteEmployee('${employee.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Open add employee modal
function openAddModal() {
    document.getElementById('modal-title').textContent = 'Add Employee';
    document.getElementById('employee-form').reset();
    document.getElementById('employee-form').setAttribute('data-id', '');
    document.getElementById('employee-modal').classList.add('active');
}

// Close employee modal
function closeEmployeeModal() {
    document.getElementById('employee-modal').classList.remove('active');
}

// Edit employee
function editEmployee(id) {
    const employees = getDataType('employees');
    const employee = employees.find(e => e.id === id);
    
    if (employee) {
        document.getElementById('modal-title').textContent = 'Edit Employee';
        document.getElementById('name').value = employee.name;
        document.getElementById('job-title').value = employee.jobTitle;
        document.getElementById('email').value = employee.email;
        document.getElementById('phone').value = employee.phone;
        document.getElementById('employee-form').setAttribute('data-id', id);
        document.getElementById('employee-modal').classList.add('active');
    }
}

// Save employee (add or update)
function saveEmployee(event) {
    event.preventDefault();
    
    const id = document.getElementById('employee-form').getAttribute('data-id');
    const employee = {
        name: document.getElementById('name').value,
        jobTitle: document.getElementById('job-title').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    
    if (id) {
        // Update existing employee
        updateItem('employees', id, employee);
        showToast('Employee updated successfully!');
    } else {
        // Add new employee
        employee.id = generateId();
        addItem('employees', employee);
        showToast('Employee added successfully!');
    }
    
    closeEmployeeModal();
    loadEmployees();
}

// Delete employee
function deleteEmployee(id) {
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
    deleteItem('employees', id);
    closeDeleteModal();
    loadEmployees();
    showToast('Employee deleted successfully!');
}

// Search employees
function searchEmployees() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#employees-tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
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