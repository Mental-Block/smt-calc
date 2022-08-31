import React from 'react'

import { BREAK_POINTS } from '@const'

import useEvent from '@util/useEvent'

const useHeader = () => {
  const [showMenu, setMenu] = React.useState(true)

  useEvent(
    'resize',
    () => {
      if (window.innerWidth >= BREAK_POINTS.sm && showMenu === false) {
        openMenu()
      }
    },
    { target: window }
  )

  const openMenu = () => {
    setMenu(true)
  }

  const closeMenu = () => {
    setMenu(false)
  }

  const toggleMenu = () => {
    setMenu((showMenu) => !showMenu)
  }

  return {
    showMenu,
    openMenu,
    closeMenu,
    toggleMenu,
  }
}

export default useHeader
