import { Link } from 'react-router-dom'
import { Row } from 'antd'
import { Footer as AntDFooter } from 'antd/lib/layout/layout'

import { PATH } from '@const'

export const PublicFooter: React.FC = (): JSX.Element => {
  return (
    <>
      <AntDFooter>
        <Row justify="center">
          <Link to={PATH.ROOT} className="logo">
            SMT CALC
          </Link>
        </Row>
      </AntDFooter>
    </>
  )
}

export const PrivateFooter: React.FC = (): JSX.Element => {
  return (
    <>
      <AntDFooter>
        <Row justify="center">
          <Link to={PATH.DASHBOARD} className="logo">
            SMT CALC
          </Link>
        </Row>
      </AntDFooter>
    </>
  )
}
