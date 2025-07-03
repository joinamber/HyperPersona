import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applySecurityHeaders } from './utils/securityHeaders'
import SecureStorage from './utils/secureStorage'
import { DataRetentionManager } from './utils/dataRetention'

// Initialize security measures
applySecurityHeaders();
SecureStorage.initAutoCleanup();
DataRetentionManager.initAutoCleanup();

createRoot(document.getElementById("root")!).render(<App />);
