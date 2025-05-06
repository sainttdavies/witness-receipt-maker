document.addEventListener('DOMContentLoaded', function() {
    // Generate receipt number and date
    generateReceiptNumber();
    updateDateAndTime();
    
    // Event listeners
    document.getElementById('add-item-btn').addEventListener('click', addCustomItemRow);
    document.getElementById('add-product-btn').addEventListener('click', handleAddProduct);
    document.getElementById('print-btn').addEventListener('click', printReceipt);
    document.getElementById('reset-btn').addEventListener('click', resetForm);
    document.getElementById('payment-method').addEventListener('change', togglePaymentDetails);
    document.getElementById('discount-amount').addEventListener('input', handleDiscountAmountChange);
    document.getElementById('discount-percent').addEventListener('input', handleDiscountPercentChange);
    
    // Initialize payment details visibility
    togglePaymentDetails();
});

function updateDateAndTime() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
    const timeStr = today.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('receipt-date').textContent = `${dateStr} at ${timeStr}`;
}

function generateReceiptNumber() {
    // Generate a unique receipt number using timestamp + random number
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    const receiptNumber = 'TWC-' + timestamp.toString().slice(-6) + '-' + random;
    document.getElementById('receipt-number').textContent = receiptNumber;
}

function togglePaymentDetails() {
    const paymentMethod = document.getElementById('payment-method').value;
    const detailsContainer = document.getElementById('payment-details-container');
    
    if (paymentMethod === 'mobile-money' || paymentMethod === 'telecel-cash' || 
        paymentMethod === 'bank-transfer' || paymentMethod === 'other') {
        detailsContainer.style.display = 'block';
    } else {
        detailsContainer.style.display = 'none';
    }
}

function handleAddProduct() {
    const productSelect = document.getElementById('product-select');
    const productKey = productSelect.value;
    
    if (!productKey) {
        alert('Please select a product');
        return;
    }
    
    const product = productCatalog[productKey];
    
    // Handle T-shirts with special options
    if (productKey === 'tshirt') {
        // Create dialog for T-shirt options
        const sizeColor = promptTshirtOptions();
        if (sizeColor) {
            addProductRow(product, `Size: ${sizeColor.size}, Color: ${sizeColor.color}`);
        }
    } 
    // Handle books with title
    else if (productKey === 'book') {
        const title = prompt('Enter book title:');
        if (title) {
            addProductRow(product, `Title: ${title}`);
        }
    }
    // Handle items with color option
    else if (product.needsColor) {
        const color = prompt('Enter color:');
        if (color) {
            addProductRow(product, `Color: ${color}`);
        }
    }
    else {
        addProductRow(product);
    }
    
    // Reset select
    productSelect.value = '';
}

function promptTshirtOptions() {
    const size = prompt('Enter T-shirt size (S, M, L, XL, XXL, etc):');
    if (!size) return null;
    
    const color = prompt('Enter T-shirt color:');
    if (!color) return null;
    
    return { size, color };
}

function addProductRow(product, description = '') {
    const tbody = document.getElementById('items-body');
    const row = document.createElement('tr');
    const currencySymbol = document.getElementById('currency-symbol').textContent;
    
    row.innerHTML = `
        <td><input type="text" class="item-name" value="${product.name}" readonly></td>
        <td><input type="text" class="item-desc" value="${description}" ${!description ? 'placeholder="Description"' : ''}></td>
        <td>${currencySymbol}<input type="number" class="item-price" value="${product.price.toFixed(2)}" step="0.01" min="0" onchange="updateRowTotal(this)"></td>
        <td><input type="number" class="item-qty" value="1" min="1" onchange="updateRowTotal(this)"></td>
        <td>${currencySymbol}<span class="row-total">${product.price.toFixed(2)}</span></td>
        <td><button class="remove-item-btn" onclick="removeItemRow(this)">Remove</button></td>
    `;
    
    tbody.appendChild(row);
    calculateTotal();
}

function addCustomItemRow() {
    const tbody = document.getElementById('items-body');
    const row = document.createElement('tr');
    const currencySymbol = document.getElementById('currency-symbol').textContent;
    
    row.innerHTML = `
        <td><input type="text" class="item-name" placeholder="Item Name"></td>
        <td><input type="text" class="item-desc" placeholder="Description"></td>
        <td>${currencySymbol}<input type="number" class="item-price" placeholder="0.00" step="0.01" min="0" onchange="updateRowTotal(this)"></td>
        <td><input type="number" class="item-qty" placeholder="1" value="1" min="1" onchange="updateRowTotal(this)"></td>
        <td>${currencySymbol}<span class="row-total">0.00</span></td>
        <td><button class="remove-item-btn" onclick="removeItemRow(this)">Remove</button></td>
    `;
    
    tbody.appendChild(row);
}

function removeItemRow(btn) {
    const row = btn.closest('tr');
    row.remove();
    calculateTotal();
}

function updateRowTotal(input) {
    const row = input.closest('tr');
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const qty = parseInt(row.querySelector('.item-qty').value) || 1;
    const total = price * qty;
    
    row.querySelector('.row-total').textContent = total.toFixed(2);
    calculateTotal();
}

function handleDiscountAmountChange() {
    // When discount amount changes, reset percentage
    if (parseFloat(document.getElementById('discount-amount').value) > 0) {
        document.getElementById('discount-percent').value = 0;
    }
    calculateTotal();
}

function handleDiscountPercentChange() {
    // When discount percentage changes, reset amount
    if (parseFloat(document.getElementById('discount-percent').value) > 0) {
        document.getElementById('discount-amount').value = 0;
    }
    calculateTotal();
}

function updateCurrencySymbol() {
    const currencySymbol = document.getElementById('currency').value;
    
    // Update all currency symbols
    document.getElementById('currency-symbol').textContent = currencySymbol;
    document.getElementById('currency-symbol-discount').textContent = currencySymbol;
    document.getElementById('currency-symbol-total').textContent = currencySymbol;
    
    // Update currency in table
    const priceCells = document.querySelectorAll('td:nth-child(3)');
    priceCells.forEach(cell => {
        cell.innerHTML = cell.innerHTML.replace(/[₵$€]/, currencySymbol);
    });
    
    const totalCells = document.querySelectorAll('td:nth-child(5)');
    totalCells.forEach(cell => {
        cell.innerHTML = cell.innerHTML.replace(/[₵$€]/, currencySymbol);
    });
    
    calculateTotal();
}

function calculateTotal() {
    const rowTotals = document.querySelectorAll('.row-total');
    let subtotal = 0;
    
    rowTotals.forEach(function(element) {
        subtotal += parseFloat(element.textContent) || 0;
    });
    
    // Calculate discount
    const discountAmount = parseFloat(document.getElementById('discount-amount').value) || 0;
    const discountPercent = parseFloat(document.getElementById('discount-percent').value) || 0;
    
    let discount = 0;
    if (discountAmount > 0) {
        discount = discountAmount;
    } else if (discountPercent > 0) {
        discount = (discountPercent / 100) * subtotal;
    }
    
    // Calculate final total
    const finalTotal = Math.max(0, subtotal - discount);
    
    // Update displays
    document.getElementById('subtotal-amount').textContent = subtotal.toFixed(2);
    document.getElementById('discount-applied').textContent = discount.toFixed(2);
    document.getElementById('total-amount').textContent = finalTotal.toFixed(2);
}

function printReceipt() {
    window.print();
}

function resetForm() {
    if (confirm('Are you sure you want to reset the form?')) {
        // Clear customer info
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-email').value = '';
        document.getElementById('customer-phone').value = '';
        document.getElementById('customer-notes').value = '';
        
        // Reset payment method
        document.getElementById('payment-method').value = 'cash';
        document.getElementById('payment-details').value = '';
        document.getElementById('payment-details-container').style.display = 'none';
        
        // Remove all item rows
        const tbody = document.getElementById('items-body');
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        
        // Reset discount fields
        document.getElementById('discount-amount').value = '0';
        document.getElementById('discount-percent').value = '0';
        
        // Reset totals
        document.getElementById('subtotal-amount').textContent = '0.00';
        document.getElementById('discount-applied').textContent = '0.00';
        document.getElementById('total-amount').textContent = '0.00';
        
        // Generate new receipt number and update date/time
        generateReceiptNumber();
        updateDateAndTime();
    }
}