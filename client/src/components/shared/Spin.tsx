import { LoadingOutlined } from '@ant-design/icons'
import { Spin as AntDSpin, SpinProps } from 'antd'

const Spin: React.FC<SpinProps> = (props) => (
  <AntDSpin
    delay={400}
    indicator={<LoadingOutlined style={{ fontSize: 54 }} />}
    {...props}
  />
)

export default Spin
