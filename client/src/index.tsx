import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import './global.less'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') as Element
)
