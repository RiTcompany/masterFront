// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {HashRouter} from "react-router-dom";
import {CategoryProvider} from "./CategoryContext.tsx";
// import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <HashRouter>
        <CategoryProvider>
            <App />
        </CategoryProvider>
    </HashRouter>
)
