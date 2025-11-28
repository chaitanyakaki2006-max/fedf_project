# Setup Instructions

## Step 1: Fix PowerShell Execution Policy (One-time)

Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or if you don't have admin rights, run this in your current PowerShell session:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

## Step 2: Install Dependencies

Navigate to the project directory (if not already there):
```powershell
cd "C:\Users\Lenovo\mental health"
```

Install backend dependencies:
```powershell
npm install
```

Install frontend dependencies:
```powershell
cd client
npm install
cd ..
```

## Step 3: Run the Application

### Option A: Run both server and client together
```powershell
npm run dev
```

### Option B: Run separately (in two separate terminal windows)

**Terminal 1 - Backend Server:**
```powershell
cd "C:\Users\Lenovo\mental health"
npm run server
```

**Terminal 2 - Frontend Client:**
```powershell
cd "C:\Users\Lenovo\mental health"
npm run client
```

## Step 4: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Quick Start (All in One)

If you want to bypass execution policy just for npm commands:
```powershell
cd "C:\Users\Lenovo\mental health"
$env:Path += ";C:\Program Files\nodejs"
npm install
cd client
npm install
cd ..
npm run dev
```

