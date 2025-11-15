# Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Set Up Database
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 3: Run the Server
```bash
python manage.py runserver
```

### Step 4: Open Your Browser
Navigate to: **http://127.0.0.1:8000/**

That's it! You're ready to use the Bank Management System.

## First Steps

1. **Create Your First Account**
   - Click "Create Account" in the navigation
   - Enter a name and optional initial deposit
   - Click "Create Account"

2. **Make a Deposit**
   - Go to the account detail page
   - Click "Deposit"
   - Enter an amount and click "Deposit"

3. **View Transactions**
   - Scroll down on any account page to see transaction history

## Optional: Django Admin

To access the admin panel:

1. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

2. Visit: **http://127.0.0.1:8000/admin/**

## Troubleshooting

### Port Already in Use
If port 8000 is busy, use a different port:
```bash
python manage.py runserver 8080
```

### Database Errors
If you encounter database errors, delete `db.sqlite3` and run migrations again:
```bash
del db.sqlite3
python manage.py migrate
```

### Import Errors
Make sure you're in the project directory:
```bash
cd C:\Users\naray\Documents\BankManagement
```

## Need Help?

Check the main README.md for detailed documentation.

