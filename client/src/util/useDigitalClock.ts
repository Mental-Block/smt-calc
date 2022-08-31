import React from 'react'

/**
 *
 * @param time new Date( YOUR DATE ).getTime() to get a number for clock
 *
 */

const useDigitalClock = (time: number | Date) => {
  const [timeString, setTimeString] = React.useState<string>('')

  React.useLayoutEffect(() => {
    const digitalClock = () => {
      const newTime = new Date(time)

      const currentHours: number = newTime.getUTCHours()
      const currentMinutes: number = newTime.getUTCMinutes()
      const currentSeconds: number = newTime.getUTCSeconds()

      const hoursString: string = (currentHours < 10 ? '0' : '') + currentHours
      const minutesString: string =
        (currentMinutes < 10 ? '0' : '') + currentMinutes
      const secondsString: string =
        (currentSeconds < 10 ? '0' : '') + currentSeconds

      setTimeString(
        `${hoursString + ':' + minutesString + ':' + secondsString}`
      )
    }

    return digitalClock()
  }, [time])

  return timeString
}

export default useDigitalClock
