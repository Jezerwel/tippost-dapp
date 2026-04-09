# Vercel Deployment Guide

## Prerequisites

- GitHub account with repository pushed
- Vercel account (sign up at vercel.com)

## Environment Variables

Before deploying, set these environment variables in Vercel dashboard:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `VITE_CONTRACT_ADDRESS` | `0x538Cd3c96Ab67500b487dD872b9b008169066D6C` | TipPost contract on Sepolia |
| `VITE_CHAIN_ID` | `11155111` | Sepolia testnet chain ID |

## Deployment Steps

### 1. Push to GitHub
Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project settings:

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3. Environment Variables
1. In project settings, go to "Environment Variables"
2. Add each variable from the table above
3. Save

### 4. Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://your-project.vercel.app`

## Build Output
- Directory: `frontend/dist`
- Contains static HTML, CSS, JS assets
- Deployed as SPA (Single Page Application)

## Custom Domain (Optional)
1. Go to project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify `npm run build` works locally

### Contract Not Found
- Verify `VITE_CONTRACT_ADDRESS` matches deployed contract
- Check Sepolia network connectivity

### SPA Routing Issues
Vercel configuration handles client-side routing automatically via `vercel.json`.
