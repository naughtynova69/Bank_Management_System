# Windows Setup Instructions

## Quick Setup

### Step 1: Verify Environment Files
The `.env.local` file should already be created. If not, create it manually:

```powershell
cd frontend
"NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api" | Out-File -FilePath .env.local -Encoding utf8
```

### Step 2: Install Dependencies

If you get execution policy errors, try one of these:

**Option A: Use Command Prompt (Easiest)**
1. Open Command Prompt (cmd.exe) - not PowerShell
2. Navigate to frontend folder:
   ```cmd
   cd C:\Users\naray\Documents\BankManagement\frontend
   ```
3. Run:
   ```cmd
   npm install
   ```

**Option B: Bypass PowerShell Policy for Current Session**
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm install
```

**Option C: Use npx (No npm install needed)**
```powershell
npx next dev
```

### Step 3: Start Development Server

**Using npm:**
```powershell
npm run dev
```

**Or using npx directly:**
```powershell
npx next dev
```

## Troubleshooting

### If npm still doesn't work:

1. **Use Command Prompt instead of PowerShell**
   - Open `cmd.exe`
   - Navigate to the frontend folder
   - Run npm commands normally

2. **Check Node.js installation:**
   ```powershell
   node --version
   npm --version
   ```

3. **Use full path to npm:**
   ```powershell
   & "C:\Program Files\nodejs\npm.cmd" install
   ```

## Complete Setup Commands (Command Prompt)

If using Command Prompt (cmd.exe):

```cmd
cd C:\Users\naray\Documents\BankManagement\frontend
npm install
npm run dev
```

The frontend will be available at: http://localhost:3000

