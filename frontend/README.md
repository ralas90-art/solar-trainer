# Frontend Setup Instructions

**Note**: The automatic setup failed because Node.js/npm is not detected in your current PATH.

## 1. Install Node.js
Please download and install Node.js (LTS version) from [nodejs.org](https://nodejs.org/).

## 2. Initialize the Project
Once installed, open your terminal in this directory (`frontend`) and run:
```bash
npx create-next-app@latest . --use-npm --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

## 3. Install Dependencies
```bash
npx shadcn-ui@latest init
npm install lucide-react clsx tailwind-merge
```

## 4. Copy the Source Code
I have generated the core component files for you. After running the above commands, overwrite your `app/page.tsx` with the file provided in `frontend/app/page.tsx`.
