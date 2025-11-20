// sales.js (FULL FIXED VERSION)
document.addEventListener('DOMContentLoaded', initSalesPage);

let sales = [];
let salesChart;

function initSalesPage() {
  // Load sales from storage
  sales = (typeof getSales === 'function') ? getSales() : JSON.parse(localStorage.getItem('sales') || '[]');

  document.getElementById('add-sale-btn').addEventListener('click', handleAddSale);

  renderSalesTable();
  drawSalesChart();
}

function handleAddSale() {
  const itemEl = document.getElementById('sale-item');
  const qtyEl = document.getElementById('sale-qty');
  const priceEl = document.getElementById('sale-price');
  const dateEl = document.getElementById('sale-date');

  const item = itemEl.value.trim();
  const qty = Number(qtyEl.value) || 0;
  const price = Number(priceEl.value) || 0;
  let date = dateEl.value;

  if (!item || qty <= 0 || price <= 0) {
    showToast('Please fill valid item, quantity and price');
    return;
  }

  if (!date) {
    date = new Date().toISOString().slice(0, 10);
  }

  const sale = {
    id: generateId(),
    item,
    qty,
    price,
    date
  };

  sales.push(sale);
  saveAllSales();
  clearForm();
  renderSalesTable();
  drawSalesChart();
  showToast('Sale added');
}

function generateId() {
  return 's_' + Date.now() + '_' + Math.floor(Math.random() * 9999);
}

function saveAllSales() {
  if (typeof saveSales === 'function') {
    saveSales(sales);
  } else {
    localStorage.setItem('sales', JSON.stringify(sales));
  }
}

function renderSalesTable() {
  const tbody = document.getElementById('sales-table');
  tbody.innerHTML = '';

  if (!sales.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--light-text)">No sales recorded</td></tr>';
    return;
  }

  const list = [...sales].reverse();
  list.forEach(s => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${escapeHtml(s.item)}</td>
      <td>${s.qty}</td>
      <td>${formatNumber(s.price)}</td>
      <td>${s.date}</td>
      <td>
        <button class="btn btn-secondary" onclick="editSale('${s.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteSale('${s.id}')">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function editSale(id) {
  const sale = sales.find(s => s.id === id);
  if (!sale) return showToast('Sale not found');

  document.getElementById('sale-item').value = sale.item;
  document.getElementById('sale-qty').value = sale.qty;
  document.getElementById('sale-price').value = sale.price;
  document.getElementById('sale-date').value = sale.date;

  sales = sales.filter(s => s.id !== id);
  saveAllSales();
  renderSalesTable();
  drawSalesChart();
  showToast('Edit the fields and click "Add Sale" to save changes');
}

function deleteSale(id) {
  if (!confirm('Delete this sale?')) return;

  sales = sales.filter(s => s.id !== id);
  saveAllSales();
  renderSalesTable();
  drawSalesChart();
  showToast('Sale deleted');
}

function clearForm() {
  document.getElementById('sale-item').value = '';
  document.getElementById('sale-qty').value = '';
  document.getElementById('sale-price').value = '';
  document.getElementById('sale-date').value = '';
}

// ---- FIXED FUNCTION HERE ----
function getLast7DaysTotals() {
    const sales = getSales();
    const result = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        const dateStr = d.toISOString().slice(0, 10);

        const total = sales
            .filter(s => s.date === dateStr)
            .reduce((acc, s) => acc + Number(String(s.price).replace(/,/g, '').trim()), 0);

        result.push({
            date: dateStr,
            total: total
        });
    }

    return result;
}

function drawSalesChart() {
  const ctx = document.getElementById('salesChart')?.getContext?.('2d');
  if (!ctx) return;

  const dataPoints = getLast7DaysTotals();
  const labels = dataPoints.map(d => d.date);
  const values = dataPoints.map(d => d.total);

  if (salesChart) salesChart.destroy();

  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Sales (7 days)',
        data: values,
        borderWidth: 2,
        tension: 0.2,
        fill: true,
        backgroundColor: 'rgba(0,0,0,0.03)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: v => formatNumber(v)
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => ` ₹ ${formatNumber(ctx.parsed.y)}`
          }
        }
      }
    }
  });
}

function formatNumber(n) {
  return Number(n).toLocaleString();
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  } else {
    alert(message);
  }
}
