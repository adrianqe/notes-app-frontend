import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './tailwind.css';
import App from './App.jsx'
import CategoriesComponent from './CategoriesComponent.jsx';
import TagsComponent from './TagsComponent.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
