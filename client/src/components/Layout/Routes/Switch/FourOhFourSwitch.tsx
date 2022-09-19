import React from 'react'
import { Switch, useHistory } from 'react-router-dom'

import { PATH } from '@const'

const FourOhFour: React.FC = () => {
  const history = useHistory()
  React.useEffect(() => {
    history.push(PATH.FOUROHFOUR)
  }, [history])
  return null
}

const FourOhFourSwitch: React.FC = ({ children }) => {
  return (
    <React.Fragment>
      <Switch>
        {children}
        <FourOhFour />
      </Switch>
    </React.Fragment>
  )
}

export default FourOhFourSwitch
