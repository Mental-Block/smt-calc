import React from 'react'

import { Space, Typography } from 'antd'

const FourOhFourPage: React.FC = (): JSX.Element => {
  return (
    <div className="page-center">
      <Space direction="vertical">
        <Typography.Title>404 this page does not exist</Typography.Title>
        <Typography.Paragraph>
          Please use the menu when searching for content. If you believe this is
          an error please contact{' '}
          <Typography.Text copyable={true} strong={true}>
            atibben@rossvideo.com
          </Typography.Text>
        </Typography.Paragraph>
      </Space>
    </div>
  )
}

export default FourOhFourPage
