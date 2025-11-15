# Quick Setup Guide

## Complete Setup in 5 Minutes

### Step 1: Backend Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up the database:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. Start Django server (keep this running):
   ```bash
   python manage.py runserver
   ```

### Step 2: Frontend Setup

1. Open a new terminal and navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Start Next.js server:
   ```bash
   npm run dev
   ```

### Step 3: Access the Application

- **Frontend UI**: http://localhost:3000
- **Django Admin**: http://127.0.0.1:8000/admin/
- **API Endpoints**: http://127.0.0.1:8000/api/

## Troubleshooting

### Port Already in Use

**Django (port 8000):**
```bash
python manage.py runserver 8001
```

**Next.js (port 3000):**
```bash
npm run dev -- -p 3001
```
Then update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` if needed.

### CORS Errors

If you see CORS errors, make sure:
1. Django server is running on port 8000
2. Next.js server is running on port 3000
3. `CORS_ALLOWED_ORIGINS` in `bankproject/settings.py` includes your frontend URL

### Database Errors

If you encounter database errors:
```bash
# Delete the database
del db.sqlite3  # Windows
rm db.sqlite3   # Mac/Linux

# Recreate migrations
python manage.py makemigrations
python manage.py migrate
```

## Development Workflow

1. **Backend changes**: Restart Django server
2. **Frontend changes**: Next.js hot-reloads automatically
3. **Database changes**: Run migrations after model changes

## Production Deployment

See the main README.md for production deployment instructions.

