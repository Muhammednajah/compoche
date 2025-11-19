// clients.js - Client Management functionality

document.addEventListener('DOMContentLoaded', function() {
    // Apply theme from settings
    applyTheme();
    
    // Load clients
    loadClients();
    
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
    // Add client button
    document.getElementById('add-client-btn').addEventListener('click', openAddModal);
    
    // Modal close buttons
    document.getElementById('close-modal').addEventListener('click', closeClientModal);
    document.getElementById('close-delete-modal').addEventListener('click', closeDeleteModal);
    
    // Client form submission
    document.getElementById('client-form').addEventListener('submit', saveClient);
    
    // Delete confirmation buttons
    document.getElementById('confirm-delete').addEventListener('click', confirmDelete);
    document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', searchClients);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('client-modal')) {
            closeClientModal();
        }
        if (event.target === document.getElementById('delete-modal')) {
            closeDeleteModal();
        }
    });
}

// Load and display clients
function loadClients() {
    const clients = getDataType('clients');
    const tbody = document.getElementById('clients-tbody');
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add client rows
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.company}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>
                <button class="btn btn-secondary" onclick="editClient('${client.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteClient('${client.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Open add client modal
function openAddModal() {
    document.getElementById('modal-title').textContent = 'Add Client';
    document.getElementById('client-form').reset();
    document.getElementById('client-form').setAttribute('data-id', '');
    document.getElementById('client-modal').classList.add('active');
}

// Close client modal
function closeClientModal() {
    document.getElementById('client-modal').classList.remove('active');
}

// Edit client
function editClient(id) {
    const clients = getDataType('clients');
    const client = clients.find(c => c.id === id);
    
    if (client) {
        document.getElementById('modal-title').textContent = 'Edit Client';
        document.getElementById('name').value = client.name;
        document.getElementById('company').value = client.company;
        document.getElementById('email').value = client.email;
        document.getElementById('phone').value = client.phone;
        document.getElementById('notes').value = client.notes || '';
        document.getElementById('client-form').setAttribute('data-id', id);
        document.getElementById('client-modal').classList.add('active');
    }
}

// Save client (add or update)
function saveClient(event) {
    event.preventDefault();
    
    const id = document.getElementById('client-form').getAttribute('data-id');
    const client = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        notes: document.getElementById('notes').value
    };
    
    if (id) {
        // Update existing client
        updateItem('clients', id, client);
        showToast('Client updated successfully!');
    } else {
        // Add new client
        client.id = generateId();
        addItem('clients', client);
        showToast('Client added successfully!');
    }
    
    closeClientModal();
    loadClients();
}

// Delete client
function deleteClient(id) {
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
    deleteItem('clients', id);
    closeDeleteModal();
    loadClients();
    showToast('Client deleted successfully!');
}

// Search clients
function searchClients() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#clients-tbody tr');
    
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