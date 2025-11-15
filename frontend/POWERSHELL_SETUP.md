# PowerShell Setup Guide

## Fix PowerShell Execution Policy

If you're getting errors about scripts being disabled, you need to change the execution policy.

### Option 1: Change Execution Policy (Recommended for Development)

Run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then verify it worked:
```powershell
Get-ExecutionPolicy
```

### Option 2: Bypass for Current Session Only

If you don't want to change the policy permanently, you can bypass it for the current session:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Option 3: Use Command Prompt Instead

You can also use Command Prompt (cmd.exe) instead of PowerShell, which doesn't have this restriction:

1. Open Command Prompt
2. Navigate to the frontend directory
3. Run npm commands normally

## After Fixing Execution Policy

Once the execution policy is fixed, you can run:

```powershell
cd frontend
npm install
npm run dev
```

## Alternative: Use npx

If you continue having issues, you can use npx directly:

```powershell
npx next dev
```

