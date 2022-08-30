import React from 'react'

import { DateColumnProps } from '@interfaces/table'
import { Tooltip } from 'antd'

const DateColumn: React.FC<DateColumnProps> = ({ date }) => {
  return (
    <React.Fragment>
      {date ? (
        <Tooltip
          title={`${
            new Date(date).toDateString() +
            ', ' +
            new Date(date).toLocaleTimeString()
          }`}
        >
          <div>{new Date(date).toDateString()}</div>
        </Tooltip>
      ) : (
        'NA'
      )}
    </React.Fragment>
  )
}

export default DateColumn
