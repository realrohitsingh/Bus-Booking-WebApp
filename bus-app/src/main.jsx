import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BBW from './BBW.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BBW />
  </StrictMode>,
)
