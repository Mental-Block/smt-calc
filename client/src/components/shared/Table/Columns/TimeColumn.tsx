import React from 'react'

import { Spin, Tooltip } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { TIME } from '@const'

import useTimer from '@util/useTimer'
import useDigitalClock from '@util/useDigitalClock'

import { TimeColumnProps } from '@interfaces/table'

// finishedStatus: 'EXPIRED' | 'RECOVERED'

const TimeColumn: React.FC<TimeColumnProps> = ({
  date,
  finishedStatus,
  finishedText,
}) => {
  const time = useTimer(new Date(date).getTime() - new Date().getTime(), 0, {
    direction: 'down',
    increment: TIME.ONE_SECOND,
  })

  const digitalText = useDigitalClock(time)

  const defualtText = new Date(date).toDateString()
  const toolTipText = `${
    new Date(date).toDateString() + ' ' + new Date(date).toLocaleTimeString()
  }`

  return (
    <React.Fragment>
      {time === undefined && <Spin indicator={<LoadingOutlined spin />} />}
      {time <= TIME.NOW ? (
        <Tooltip title={`${toolTipText}`}>
          <div
            className={
              finishedStatus === 'success' ? 'column-success' : 'column-error'
            }
          >
            {finishedText}
          </div>
        </Tooltip>
      ) : time <= TIME.ONE_DAY ? (
        <Tooltip title={`${toolTipText}`}>
          <div className="column-warning">{digitalText}</div>
        </Tooltip>
      ) : (
        <Tooltip title={`${toolTipText}`}>
          <div>{defualtText}</div>
        </Tooltip>
      )}
    </React.Fragment>
  )
}

export default TimeColumn
