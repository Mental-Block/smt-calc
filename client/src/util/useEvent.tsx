import React from 'react'
import { EventOptionsProps } from '@interfaces/event'

const useEvent = (
  event: keyof GlobalEventHandlersEventMap,
  handler: (e: Event) => void,
  { enabled = true, target = document }: EventOptionsProps = {}
): void => {
  const handlerRef = React.useRef(handler)

  React.useEffect(() => {
    handlerRef.current = handler
  })

  React.useEffect(() => {
    if (!enabled) {
      return
    }

    const internalRef = (e: Event) => handlerRef.current(e)

    target.addEventListener(event, internalRef)

    return () => {
      target.removeEventListener(event, internalRef)
    }
  }, [enabled, target, event])
}

export default useEvent
