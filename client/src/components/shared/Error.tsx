import { FetchState } from '@interfaces/fetch'
import { Space, Typography } from 'antd'

const Error: React.FC<Pick<FetchState<any>, 'error'>> = ({
  error,
}): JSX.Element | null => {
  if (!error) return null

  return (
    <Space className="flex-center-center" direction="vertical">
      <Typography.Title>{error}</Typography.Title>
    </Space>
  )
}

export default Error
