import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.jsx'

// StrictMode is intentionally omitted: GSAP pinning mutates the DOM
// and double-invoked effects make dev-mode pin-spacers flicker.
createRoot(document.getElementById('root')).render(<App />)