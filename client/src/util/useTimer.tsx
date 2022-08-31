import React from 'react'

import { TIME } from '@const'
import { TimerOptionProps } from '@interfaces/timer'

const useTimer = (
  start: number,
  stop: number,
  {
    speed = TIME.ONE_SECOND,
    increment = 1,
    direction = 'up',
  }: TimerOptionProps = {}
): number => {
  const [time, setTime] = React.useState<number>(start)

  React.useEffect(() => {
    const count = () => {
      switch (direction) {
        case 'down':
          if (time <= stop) {
            return
          }
          setTime((time) => time - increment)
          break
        case 'up':
          if (time >= stop) {
            return
          }
          setTime((time) => time + increment)
          break
      }
    }

    const timer = setTimeout(count, speed)

    return () => clearTimeout(timer)
  }, [start, stop, time, speed, direction, increment])

  return time
}

export default useTimer
