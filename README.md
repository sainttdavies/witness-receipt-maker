# The Witness Collection Receipt System

A simple yet feature-rich sales receipt system for The Witness Collection, designed to manage sales transactions for faith-inspired merchandise.

## Features

- **Product Management**: Easy selection of products from a predefined catalog
- **Custom Items**: Add custom items with descriptions and pricing
- **Customer Information**: Record customer details for follow-ups and record-keeping
- **Flexible Payment Options**: Support for multiple payment methods including:
  - Cash
  - Mobile Money
  - Telecel Cash
  - Bank Transfer
  - Card Payment
  - Other (with reference details)
- **Discount System**: Apply discounts by either fixed amount or percentage
- **Multi-Currency Support**: Switch between Ghana Cedi (₵), US Dollar ($), and Euro (€)
- **Receipt Printing**: Clean print layout optimized for receipts
- **Unique Receipt Numbers**: Automatically generated unique receipt numbers that change with each transaction
- **Date and Time Tracking**: Accurate timestamps for each transaction

## File Structure

- **index.html**: The main HTML structure of the receipt system
- **styles.css**: All styling and layout information
- **productCatalog.js**: Contains the product catalog with default prices and options
- **script.js**: All functionality and interactive features

## How to Use

1. **Open the system**: Simply open the `index.html` file in a web browser.

2. **Add products**: 
   - Select a product from the dropdown and click "Add to Receipt"
   - For products with options (like T-shirts), follow the prompts for additional information

3. **Add custom items**:
   - Click "+ Add Custom Item" to add non-catalog items
   - Enter name, description, price, and quantity

4. **Fill customer information**:
   - Enter customer details for record-keeping

5. **Select payment method**:
   - Choose from the available payment methods
   - Enter reference numbers for electronic payments

6. **Apply discounts** (if applicable):
   - Enter either a fixed discount amount or a percentage discount
   - The system automatically calculates the new total

7. **Print or reset**:
   - Click "Print Receipt" to print the receipt
   - Click "Reset Form" to start a new receipt

## Product Options

Some products have additional options:

- **T-shirts**: Prompts for size and color
- **Books**: Prompts for title
- **Face Towels**: Prompts for color

## Customization

To customize the product catalog, modify the `productCatalog.js` file by adding, removing, or editing products.

## Development

This system uses:
- HTML5 for structure
- CSS3 for styling
- Vanilla JavaScript for functionality (no dependencies)

## Installation

No installation required. Simply download the files and open `index.html` in a web browser.

## Credits

The Witness Collection Receipt System - Faith-Inspired Merchandise