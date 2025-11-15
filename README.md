# Bank Management System

A comprehensive Python-based bank management application with a modern **Next.js frontend** and **Django REST API backend**. The system provides efficient account management, transactions, and data persistence using a SQLite database.

## Features

### Frontend (Next.js)
- **Modern React UI** - Beautiful, responsive interface built with Next.js 14 and Tailwind CSS
- **TypeScript** - Full type safety throughout the application
- **Real-time Updates** - Instant feedback with toast notifications
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Fast Performance** - Optimized with Next.js App Router

### Backend (Django REST API)
- **RESTful API** - Clean, well-structured API endpoints
- **CORS Support** - Configured for frontend communication
- **Database Integration** - SQLite database for efficient data storage
- **Atomic Transactions** - Ensures data consistency
- **Account Management**
  - Create new bank accounts with unique account numbers
  - View all accounts in a table format
  - View detailed account information
  - Close existing accounts
- **Transactions**
  - Deposit money with descriptions
  - Withdraw money with balance validation
  - Transfer money between accounts with atomic transactions
  - View complete transaction history with timestamps
- **Dashboard**
  - Real-time bank statistics
  - Total accounts, active accounts, total deposits
  - Transaction count overview
- **Database Integration**
  - SQLite database for efficient data storage
  - Automatic transaction logging
  - Data persistence without manual save/load

### Command Line Interface (Legacy)
- Original CLI interface still available (`bank_cli.py`)
- JSON file-based storage for CLI version

## Project Structure

```
BankManagement/
├── frontend/            # Next.js frontend application
│   ├── app/            # Next.js app directory
│   │   ├── accounts/   # Account pages
│   │   ├── transfer/   # Transfer page
│   │   └── page.tsx    # Home page
│   ├── components/     # React components
│   ├── lib/            # Utilities and API client
│   └── package.json    # Node.js dependencies
├── bankproject/        # Django project configuration
│   ├── settings.py     # Django settings
│   ├── urls.py         # Main URL routing
│   └── wsgi.py         # WSGI configuration
├── bankapp/            # Django application
│   ├── models.py       # Account and Transaction models
│   ├── api_views.py    # REST API views
│   ├── serializers.py  # API serializers
│   ├── api_urls.py     # API URL routing
│   ├── views.py        # Template views (legacy)
│   ├── forms.py        # Django forms (legacy)
│   ├── urls.py         # Template URL routing (legacy)
│   ├── admin.py        # Django admin configuration
│   └── templates/      # HTML templates (legacy)
├── bank_account.py     # Original Account and Transaction classes (legacy)
├── bank.py             # Original Bank class (legacy)
├── bank_cli.py         # Command-line interface (legacy)
├── manage.py           # Django management script
├── requirements.txt    # Python dependencies
└── README.md           # This file
```

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 18+ and npm
- pip (Python package manager)

### Backend Setup (Django)

1. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Database Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Create Superuser (Optional - for Django Admin)**
   ```bash
   python manage.py createsuperuser
   ```

4. **Run Django Development Server**
   ```bash
   python manage.py runserver
   ```
   The API will be available at: `http://127.0.0.1:8000/api/`

### Frontend Setup (Next.js)

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   ```bash
   cp .env.local.example .env.local
   ```
   Update `.env.local` if your Django backend is on a different URL.

4. **Run Next.js Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Django Admin: `http://127.0.0.1:8000/admin/`
   - API Root: `http://127.0.0.1:8000/api/`

## Usage Guide

### Web Interface

#### Dashboard
- View bank statistics at a glance
- Quick access to common actions
- Real-time updates

#### Creating an Account
1. Click "Create Account" in the navigation or dashboard
2. Enter account holder name
3. Optionally enter initial deposit amount
4. Click "Create Account"
5. Account number is automatically generated

#### Depositing Money
1. Navigate to account details
2. Click "Deposit" button
3. Enter deposit amount
4. Optionally add a description
5. Click "Deposit"

#### Withdrawing Money
1. Navigate to account details
2. Click "Withdraw" button
3. Enter withdrawal amount
4. System validates sufficient funds
5. Optionally add a description
6. Click "Withdraw"

#### Transferring Money
1. Click "Transfer" in navigation
2. Select source account
3. Select destination account
4. Enter transfer amount
5. System validates both accounts and balance
6. Click "Transfer"

#### Viewing Transaction History
1. Navigate to any account detail page
2. Scroll to "Transaction History" section
3. View all transactions with timestamps, types, and descriptions

### Command Line Interface (Legacy)

The original CLI interface is still available:

```bash
python bank_cli.py
```

## Technical Improvements

### Efficiency Enhancements
1. **Database Storage** - SQLite database replaces JSON file storage for better performance
2. **Atomic Transactions** - Database transactions ensure data consistency
3. **Optimized Queries** - Django ORM provides efficient database queries
4. **Indexed Fields** - Account numbers are indexed for fast lookups
5. **Decimal Precision** - Uses DecimalField for accurate financial calculations

### Architecture
- **MVC Pattern** - Models, Views, and Templates separation
- **Form Validation** - Client and server-side validation
- **Error Handling** - Comprehensive error messages and validation
- **Responsive Design** - Mobile-friendly Bootstrap interface
- **Modern UI** - Gradient designs, icons, and smooth animations

## Django Admin

Access the Django admin panel to:
- View all accounts and transactions
- Edit account details
- Filter and search records
- Export data

URL: `http://127.0.0.1:8000/admin/`

## Database Schema

### Account Model
- `account_number` (Primary Key) - Unique account identifier
- `account_holder` - Name of account holder
- `balance` - Current account balance (Decimal)
- `is_active` - Account status (Active/Closed)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Transaction Model
- `account` (ForeignKey) - Related account
- `transaction_type` - Type of transaction (DEPOSIT, WITHDRAWAL, etc.)
- `amount` - Transaction amount (Decimal)
- `balance_after` - Balance after transaction
- `description` - Optional transaction description
- `timestamp` - Transaction timestamp

## Error Handling

The system includes validation for:
- Negative amounts
- Insufficient funds
- Invalid account numbers
- Closed accounts
- Duplicate account numbers
- Invalid form inputs
- Database integrity constraints

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
```

### Applying Migrations
```bash
python manage.py migrate
```

### Collecting Static Files (Production)
```bash
python manage.py collectstatic
```

## Production Deployment

For production deployment:
1. Set `DEBUG = False` in `settings.py`
2. Update `SECRET_KEY` with a secure random key
3. Configure `ALLOWED_HOSTS` with your domain
4. Use a production database (PostgreSQL recommended)
5. Set up static file serving
6. Configure HTTPS
7. Set up proper security middleware

## Requirements

- Django >= 4.2.0
- Python 3.8+

## License

Free to use and modify for educational purposes.

## Future Enhancements

Possible additions:
- User authentication and authorization
- Interest calculation
- Account types (Savings, Checking)
- Loan management
- Account statements/reports (PDF generation)
- Multi-currency support
- REST API
- Real-time notifications
- Email notifications
- Advanced reporting and analytics
