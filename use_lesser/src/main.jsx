import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PointsProvider } from './components/PointsProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PointsProvider>
    <App />
    </PointsProvider>
  </StrictMode>,
)
