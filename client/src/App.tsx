import { BrowserRouter } from 'react-router-dom'

import { AuthContextProvider } from '@context/AuthContext'
import Layouts from '@components/Layout'

import React from 'react'

const App: React.FC = (): JSX.Element => {
  return (
    <React.Fragment>
      <AuthContextProvider>
        <BrowserRouter>
          <Layouts />
        </BrowserRouter>
      </AuthContextProvider>
    </React.Fragment>
  )
}

export default App
