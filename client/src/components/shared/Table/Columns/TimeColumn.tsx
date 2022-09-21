import React from 'react'

import { Spin, Tooltip } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { TIME } from '@const'

import { TimeColumnProps } from '@interfaces/table'

import Countdown from 'antd/lib/statistic/Countdown'

const TimeColumn: React.FC<TimeColumnProps> = ({ date, finished }) => {
  const timeLeft = new Date(date).getTime() - new Date().getTime()
  const [isFinished, setFinshed] = React.useState(timeLeft <= TIME.NOW)

  const defualtText = new Date(date).toDateString()
  const toolTipText =
    new Date(date).toDateString() + ' ' + new Date(date).toLocaleTimeString()

  return (
    <React.Fragment>
      {/* NO TIME */}
      {timeLeft === undefined && <Spin indicator={<LoadingOutlined spin />} />}

      {/* 24 Hour Clock */}
      {timeLeft <= TIME.ONE_DAY && timeLeft >= TIME.NOW && (
        <Tooltip title={toolTipText}>
          <Countdown
            format="HH:mm:ss"
            valueStyle={{ fontSize: '16px' }}
            className="column-warning"
            value={Date.parse(date)}
            onFinish={() => {
              setFinshed(true)
            }}
          />
        </Tooltip>
      )}

      {/* Finished */}
      {isFinished && (
        <Tooltip title={toolTipText}>
          <div className={finished?.className}>{finished?.text}</div>
        </Tooltip>
      )}

      {/* Defualt */}
      {timeLeft >= TIME.ONE_DAY && (
        <Tooltip title={toolTipText}>
          <div>{defualtText}</div>
        </Tooltip>
      )}
    </React.Fragment>
  )
}

export default TimeColumn
