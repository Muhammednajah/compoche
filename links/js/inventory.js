// inventory.js - Inventory Management functionality

document.addEventListener('DOMContentLoaded', function() {
    // Apply theme from settings
    applyTheme();
    
    // Load inventory items
    loadInventory();
    
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
    // Add item button
    document.getElementById('add-item-btn').addEventListener('click', openAddModal);
    
    // Modal close buttons
    document.getElementById('close-modal').addEventListener('click', closeItemModal);
    document.getElementById('close-delete-modal').addEventListener('click', closeDeleteModal);
    
    // Item form submission
    document.getElementById('item-form').addEventListener('submit', saveItem);
    
    // Delete confirmation buttons
    document.getElementById('confirm-delete').addEventListener('click', confirmDelete);
    document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', searchInventory);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('item-modal')) {
            closeItemModal();
        }
        if (event.target === document.getElementById('delete-modal')) {
            closeDeleteModal();
        }
    });
}

// Load and display inventory items
function loadInventory() {
    const inventory = getDataType('inventory');
    const tbody = document.getElementById('inventory-tbody');
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add inventory rows
    inventory.forEach(item => {
        const row = document.createElement('tr');
        
        // Determine status based on quantity
        let status = 'In Stock';
        let statusClass = '';
        
        if (item.quantity === 0) {
            status = 'Out of Stock';
            statusClass = 'danger';
        } else if (item.quantity <= 5) {
            status = 'Low Stock';
            statusClass = 'warning';
        }
        
        row.innerHTML = `
            <td>${item.itemName}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td><span class="status ${statusClass}">${status}</span></td>
            <td>
                <button class="btn btn-secondary" onclick="editItem('${item.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteItem('${item.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Open add item modal
function openAddModal() {
    document.getElementById('modal-title').textContent = 'Add Inventory Item';
    document.getElementById('item-form').reset();
    document.getElementById('item-form').setAttribute('data-id', '');
    document.getElementById('item-modal').classList.add('active');
}

// Close item modal
function closeItemModal() {
    document.getElementById('item-modal').classList.remove('active');
}

// Edit item
function editItem(id) {
    const inventory = getDataType('inventory');
    const item = inventory.find(i => i.id === id);
    
    if (item) {
        document.getElementById('modal-title').textContent = 'Edit Inventory Item';
        document.getElementById('item-name').value = item.itemName;
        document.getElementById('category').value = item.category;
        document.getElementById('quantity').value = item.quantity;
        document.getElementById('item-form').setAttribute('data-id', id);
        document.getElementById('item-modal').classList.add('active');
    }
}

// Save item (add or update)
function saveItem(event) {
    event.preventDefault();
    
    const id = document.getElementById('item-form').getAttribute('data-id');
    const item = {
        itemName: document.getElementById('item-name').value,
        category: document.getElementById('category').value,
        quantity: parseInt(document.getElementById('quantity').value)
    };
    
    if (id) {
        // Update existing item
        updateItem('inventory', id, item);
        showToast('Item updated successfully!');
    } else {
        // Add new item
        item.id = generateId();
        addItem('inventory', item);
        showToast('Item added successfully!');
    }
    
    closeItemModal();
    loadInventory();
}

// Delete item
function deleteItem(id) {
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
    deleteItem('inventory', id);
    closeDeleteModal();
    loadInventory();
    showToast('Item deleted successfully!');
}

// Search inventory
function searchInventory() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#inventory-tbody tr');
    
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