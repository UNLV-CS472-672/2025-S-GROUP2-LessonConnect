import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Styles/index.css'
import './Styles/about.css'
import './Styles/learn_more.css'
// import './Styles/Login.css'
// import './Styles/SignUp.css'
import App from './App.jsx'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
)