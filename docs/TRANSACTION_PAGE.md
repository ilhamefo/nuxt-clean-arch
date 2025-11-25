# Transaction Page Documentation

## Overview
Halaman transaksi yang dibuat untuk mentrigger API dengan payload tertentu sesuai dengan clean architecture pattern yang digunakan dalam project ini.

## API Payload Structure
```json
{
  "date_end": "2025/08/31",
  "date_start": "2025/08/01", 
  "id_area": "",
  "id_induk": "",
  "id_pusat": "",
  "unit_code": ""
}
```

## Features

### 1. Form Input Fields
- **Tanggal Mulai**: Date picker for start date
- **Tanggal Akhir**: Date picker for end date  
- **ID Pusat**: Optional text input for pusat ID
- **ID Induk**: Optional text input for induk ID
- **ID Area**: Optional text input for area ID
- **Unit Code**: Optional text input for unit code

### 2. Functionality
- Auto-initialize form with current month date range
- Real-time API payload preview
- Form validation (date range validation)
- Loading states and error handling
- Reset form functionality
- Display API response
- Transaction data table view

### 3. Architecture Components

#### Entities
- `Transaction.ts`: Core domain entities and interfaces
- `TransactionPayload`: API request payload interface
- `TransactionResponse`: API response interface

#### Repository
- `TransactionRepository.ts`: Contract interface for transaction operations

#### Service  
- `TransactionService.ts`: Infrastructure layer for API calls
- Supports both internal Nuxt API and external API calls
- Multiple endpoint options (POST, GET with query params)

#### Store
- `transaction.ts`: Pinia store for state management
- Error handling and loading states
- Clean transaction data management

#### Composable
- `useTransactionForm.ts`: Reusable logic for transaction forms
- Helper functions for validation and data formatting
- Computed properties for reactive state

## Usage

### 1. Navigate to Transaction Page
```
http://localhost:3000/transaksi
```

### 2. Fill Form Fields
- Select date range (required)
- Fill optional filter fields as needed
- View real-time API payload preview

### 3. Submit Form
- Click "Ambil Data Transaksi" button
- View loading state during API call
- See results in API response section
- Browse transaction data in table format

### 4. Reset Form
- Click "Reset" button to clear all fields
- Form will reinitialize with current month

## API Endpoints

### Default (Mock API)
```
POST /api/transactions
```

### External API (if configured)
```
POST /external/transactions  
GET /api/transactions?params
POST /api/transaction-report
```

## Error Handling

### Validation Errors
- Empty date fields
- Invalid date range (start > end)
- Server validation (422 status)

### Server Errors  
- Network errors
- 404 Not Found
- 500 Internal Server Error
- Custom error messages from API

## Customization

### 1. Change API Endpoint
Update `TransactionService.ts`:
```typescript
// For external API
async getTransactions(payload: TransactionPayload) {
  const { data } = await api.post('/your-api-endpoint', payload);
  return data;
}
```

### 2. Add New Fields
1. Update `TransactionPayload` interface
2. Add form fields in template
3. Update `formData` reactive object
4. Modify `apiPayload` computed property

### 3. Customize Response Display
Update transaction table columns in template or create custom components for different data visualization.

### 4. Add Export Features
Extend the store and service to support data export (CSV, Excel, PDF).

## File Structure
```
src/
├── core/domain/
│   ├── entities/Transaction.ts
│   └── repositories/TransactionRepository.ts
├── infrastructure/services/
│   └── TransactionService.ts
├── presentation/
│   ├── stores/transaction.ts
│   └── composables/useTransactionForm.ts
├── pages/transaksi/
│   └── index.vue
└── server/api/
    └── transactions.post.ts (mock)
```

## Testing

### 1. Mock API Testing
The included mock API (`server/api/transactions.post.ts`) provides sample data for testing without external dependencies.

### 2. Real API Testing  
1. Update `TransactionService` to use your actual API endpoint
2. Configure proper authentication if required
3. Update response interfaces to match your API structure

## Next Steps

1. **Authentication**: Add authentication headers if required
2. **Pagination**: Implement pagination for large datasets  
3. **Filters**: Add more advanced filtering options
4. **Export**: Add data export functionality
5. **Charts**: Integrate charts for data visualization
6. **Real-time**: Add real-time updates if needed
