import { Space, Typography } from 'antd'

const HomePage: React.FC = (): JSX.Element => {
  return (
    <div className="page-center">
      <Space direction="vertical" align="center">
        <Typography.Title level={2}>
          IPC Standards Documentaion
        </Typography.Title>
        <Typography.Title level={4}>
          <a
            target="_blank"
            className="link"
            rel="noreferrer"
            href="http://www.surfacemountprocess.com/uploads/5/4/1/9/54196839/j-std-033b01.pdf"
          >
            IPC/JEDEC J-STD-033B.1
          </a>
        </Typography.Title>
        <Typography.Text italic>
          * All of the following features are based of this documentaion.
        </Typography.Text>
      </Space>
    </div>
  )
}
export default HomePage
