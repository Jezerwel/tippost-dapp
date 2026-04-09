import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from '@/context/AppContext'
import { WalletProvider } from '@/hooks/useWallet'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
    </AppProvider>
  </StrictMode>,
)
