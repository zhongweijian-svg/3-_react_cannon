import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Leva } from "leva";

const root=ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* <Leva> */}
    <Leva collapsed/>
    <App />
    {/* </Leva> */}

  </React.StrictMode>,
)
