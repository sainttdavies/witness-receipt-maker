document.addEventListener('DOMContentLoaded', function() {
    // Generate receipt number and date
    generateReceiptNumber();
    updateDateAndTime();
    
    // Event listeners
    document.getElementById('add-item-btn').addEventListener('click', addCustomItemRow);
    document.getElementById('add-product-btn').addEventListener('click', handleAddProduct);
    document.getElementById('print-btn').addEventListener('click', prepareAndPrintReceipt);
    document.getElementById('reset-btn').addEventListener('click', resetForm);
    document.getElementById('payment-method').addEventListener('change', togglePaymentDetails);
    document.getElementById('discount-amount').addEventListener('input', handleDiscountAmountChange);
    document.getElementById('discount-percent').addEventListener('input', handleDiscountPercentChange);
    document.getElementById('currency').addEventListener('change', updateCurrencySymbol);
    
    // Initialize payment details visibility
    togglePaymentDetails();
    
    // Add these new function calls for responsive behavior
    optimizeTableForMobile();
    updateInputWidthsForMobile();
    
    // Listen for window resize events
    window.addEventListener('resize', handleScreenResize);
    
    // Also listen for orientation change for mobile devices
    window.addEventListener('orientationchange', handleScreenResize);
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
    
    // Update for form view
    document.getElementById('receipt-date').textContent = `${dateStr} at ${timeStr}`;
    
    // Update for print view
    document.getElementById('print-receipt-date').textContent = today.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function generateReceiptNumber() {
    // Generate a unique receipt number using timestamp + random number
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    const receiptNumber = 'SR-' + timestamp.toString().slice(-5);
    
    // Update for form view
    document.getElementById('receipt-number').textContent = receiptNumber;
    
    // Update for print view
    document.getElementById('print-receipt-number').textContent = receiptNumber;
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
            addProductRow(product, `${sizeColor.color} T-shirt(${sizeColor.size})`);
        }
    } 
    // Handle books with title
    else if (productKey === 'book') {
        const title = prompt('Enter book title:');
        if (title) {
            addProductRow(product, `Book: ${title}`);
        }
    }
    // Handle items with color option
    else if (product.needsColor) {
        const color = prompt('Enter color:');
        if (color) {
            addProductRow(product, `${color} ${product.name}`);
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
        <td>${currencySymbol}<input type="number" class="item-price" value="${product.price.toFixed(2)}" step="0.01" min="0"></td>
        <td><input type="number" class="item-qty" value="1" min="1"></td>
        <td>${currencySymbol}<span class="row-total">${product.price.toFixed(2)}</span></td>
        <td><button class="remove-item-btn">Remove</button></td>
    `;
    
    tbody.appendChild(row);
    
    // Add event listeners to input fields
    const priceInput = row.querySelector('.item-price');
    const qtyInput = row.querySelector('.item-qty');
    const removeBtn = row.querySelector('.remove-item-btn');
    
    priceInput.addEventListener('input', function() {
        updateRowTotal(this);
    });
    
    qtyInput.addEventListener('input', function() {
        updateRowTotal(this);
    });
    
    removeBtn.addEventListener('click', function() {
        removeItemRow(this);
    });
    
    calculateTotal();
    
    // Call responsive functions after adding a row
    optimizeTableForMobile();
    updateInputWidthsForMobile();
}

function addCustomItemRow() {
    const tbody = document.getElementById('items-body');
    const row = document.createElement('tr');
    const currencySymbol = document.getElementById('currency-symbol').textContent;
    
    row.innerHTML = `
        <td><input type="text" class="item-name" placeholder="Item Name"></td>
        <td><input type="text" class="item-desc" placeholder="Description"></td>
        <td>${currencySymbol}<input type="number" class="item-price" placeholder="0.00" value="0.00" step="0.01" min="0"></td>
        <td><input type="number" class="item-qty" placeholder="1" value="1" min="1"></td>
        <td>${currencySymbol}<span class="row-total">0.00</span></td>
        <td><button class="remove-item-btn">Remove</button></td>
    `;
    
    tbody.appendChild(row);
    
    // Add event listeners to input fields
    const priceInput = row.querySelector('.item-price');
    const qtyInput = row.querySelector('.item-qty');
    const removeBtn = row.querySelector('.remove-item-btn');
    
    priceInput.addEventListener('input', function() {
        updateRowTotal(this);
    });
    
    qtyInput.addEventListener('input', function() {
        updateRowTotal(this);
    });
    
    removeBtn.addEventListener('click', function() {
        removeItemRow(this);
    });
    
    calculateTotal();
    
    // Call responsive functions after adding a row
    optimizeTableForMobile();
    updateInputWidthsForMobile();
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
    const currencyText = document.getElementById('currency').options[document.getElementById('currency').selectedIndex].text.split('(')[0].trim();
    
    // Update all currency symbols in form view
    document.getElementById('currency-symbol').textContent = currencySymbol;
    document.getElementById('currency-symbol-discount').textContent = currencySymbol;
    document.getElementById('currency-symbol-total').textContent = currencySymbol;
    
    // Update currency in print view
    document.getElementById('print-currency-symbol').textContent = currencySymbol;
    document.getElementById('print-discount-symbol').textContent = currencySymbol;
    document.getElementById('print-currency-total').textContent = currencyText;
    
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
    
    // Update displays in form view
    document.getElementById('subtotal-amount').textContent = subtotal.toFixed(2);
    document.getElementById('discount-applied').textContent = discount.toFixed(2);
    document.getElementById('total-amount').textContent = finalTotal.toFixed(2);
    
    // Update displays in print view
    document.getElementById('print-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('print-discount').textContent = discount.toFixed(2);
    document.getElementById('print-total').textContent = finalTotal.toFixed(2);
}

function prepareAndPrintReceipt() {
    // Copy customer information to print view
    document.getElementById('print-customer-name').textContent = document.getElementById('customer-name').value || 'Guest Customer';
    document.getElementById('print-customer-email').textContent = document.getElementById('customer-email').value || '';
    document.getElementById('print-customer-phone').textContent = document.getElementById('customer-phone').value || '';
    
    // Set payment method
    const paymentMethod = document.getElementById('payment-method');
    const paymentText = paymentMethod.options[paymentMethod.selectedIndex].text;
    document.getElementById('print-payment-mode').textContent = paymentText;
    
    // Check if there's a payment reference to add
    if (document.getElementById('payment-details-container').style.display !== 'none') {
        const paymentDetails = document.getElementById('payment-details').value;
        if (paymentDetails) {
            document.getElementById('print-payment-mode').textContent += ` (Ref: ${paymentDetails})`;
        }
    }
    
    // Copy items to print view
    const printItemsBody = document.getElementById('print-items-body');
    printItemsBody.innerHTML = ''; // Clear existing items
    
    const items = document.getElementById('items-body').querySelectorAll('tr');
    let itemNumber = 1;
    
    items.forEach(item => {
        const name = item.querySelector('.item-name').value;
        const desc = item.querySelector('.item-desc').value;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        const qty = parseInt(item.querySelector('.item-qty').value) || 1;
        const total = price * qty;
        
        // Create description text combining name and description
        let description = name;
        if (desc) {
            description = `${name} - ${desc}`;
        }
        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${itemNumber}</td>
            <td>${description}</td>
            <td>${qty}</td>
            <td>${price.toFixed(2)}</td>
            <td>${total.toFixed(2)}</td>
        `;
        
        printItemsBody.appendChild(newRow);
        itemNumber++;
    });
    
    // Finally, print the receipt
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
        
        // Reset print view values
        document.getElementById('print-subtotal').textContent = '0.00';
        document.getElementById('print-discount').textContent = '0.00';
        document.getElementById('print-total').textContent = '0.00';
        document.getElementById('print-customer-name').textContent = '';
        document.getElementById('print-customer-email').textContent = '';
        document.getElementById('print-customer-phone').textContent = '';
        document.getElementById('print-items-body').innerHTML = '';
        
        // Generate new receipt number and update date/time
        generateReceiptNumber();
        updateDateAndTime();
    }
}

// Function to ensure the table cells adapt to the screen size
function optimizeTableForMobile() {
    const screenWidth = window.innerWidth;
    const itemsTable = document.getElementById('items-table');
    
    // Handle very small screens
    if (screenWidth < 480) {
        // Adjust column widths for small screens
        const headerCells = itemsTable.querySelectorAll('th');
        if (headerCells.length >= 6) {
            // Item name column
            headerCells[0].style.width = '20%';
            // Description column
            headerCells[1].style.width = '25%';
            // Price column
            headerCells[2].style.width = '15%';
            // Quantity column
            headerCells[3].style.width = '10%';
            // Total column
            headerCells[4].style.width = '15%';
            // Action column
            headerCells[5].style.width = '15%';
        }
    } else {
        // Reset for larger screens
        const headerCells = itemsTable.querySelectorAll('th');
        headerCells.forEach(cell => {
            cell.style.width = '';
        });
    }
}

// Function to update input field widths on mobile
function updateInputWidthsForMobile() {
    const screenWidth = window.innerWidth;
    
    // Price input fields adjustment
    const priceInputs = document.querySelectorAll('.item-price');
    priceInputs.forEach(input => {
        if (screenWidth < 480) {
            input.style.width = '50px';
        } else {
            input.style.width = '';
        }
    });
    
    // Quantity input fields adjustment
    const qtyInputs = document.querySelectorAll('.item-qty');
    qtyInputs.forEach(input => {
        if (screenWidth < 480) {
            input.style.width = '40px';
        } else {
            input.style.width = '';
        }
    });
}

// Function to handle orientation change and resize
function handleScreenResize() {
    optimizeTableForMobile();
    updateInputWidthsForMobile();
} 