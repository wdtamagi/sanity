/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useEffect, useState} from 'react'
import {RovingFocusProps} from '.'

const EMPTY_ARRAY = []

const MUTATION_ATTRIBUTE_FILTER = ['aria-hidden', 'disabled', 'href']

const FOCUSABLE =
  'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'

function getFocusableElements(element: HTMLElement) {
  return [...(element.querySelectorAll(FOCUSABLE) as any)].filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden="true"')
  ) as HTMLElement[]
}

export function useRovingFocus(props: RovingFocusProps, dependencies?: unknown[]): undefined {
  const {direction = 'horizontal', initialFocus, loop = true, pause = false, rootElement} = props
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([])

  const deps = dependencies ? dependencies : EMPTY_ARRAY

  const focusableLen = focusableElements.length
  const lastFocusableIndex = focusableLen - 1

  /**
   * Determine what keys to listen to depending on direction
   */
  const nextKey = direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
  const prevKey = direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'

  /**
   * Set focusable elements in state
   */
  const handleSetElements = useCallback(() => {
    if (rootElement) {
      const els = getFocusableElements(rootElement)

      setFocusableElements(els)
    }
  }, [rootElement, ...deps])

  /**
   * Set focused index
   */
  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index)
  }, [])

  /**
   * Handle increment/decrement of focusedIndex
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (pause) {
        return
      }

      if (event.key === prevKey) {
        event.preventDefault()
        setFocusedIndex((prevIndex) => {
          const next = (prevIndex + lastFocusableIndex) % focusableLen

          if (!loop && next === lastFocusableIndex) {
            return prevIndex
          }

          return next
        })
      }

      if (event.key === nextKey) {
        event.preventDefault()
        setFocusedIndex((prevIndex) => {
          const next = (prevIndex + 1) % focusableLen

          if (!loop && next === 0) {
            return prevIndex
          }

          return next
        })
      }
    },
    [focusableLen, loop, nextKey, pause, prevKey, lastFocusableIndex, ...deps]
  )

  /**
   * Set focusable elements on mount
   */
  useEffect(() => {
    handleSetElements()
  }, [handleSetElements, initialFocus, direction, ...deps])

  /**
   * Listen to DOM mutations to update focusableElements with latest state
   */
  useEffect(() => {
    const mo = new MutationObserver(handleSetElements)

    if (rootElement) {
      mo.observe(rootElement, {
        childList: true,
        subtree: true,
        attributeFilter: MUTATION_ATTRIBUTE_FILTER,
      })
    }

    return () => {
      mo.disconnect()
    }
  }, [focusableElements, handleSetElements, rootElement, ...deps])

  /**
   * Set focus on elements in focusableElements depending on focusedIndex
   */
  useEffect(() => {
    ;(focusableElements as HTMLElement[]).forEach((el, index) => {
      if (index === focusedIndex) {
        el.setAttribute('tabIndex', '0')
        el.setAttribute('aria-selected', 'true')
        el.focus()
        el.onfocus = () => handleFocus(index)
        el.onblur = () => handleFocus(-1)
      } else {
        el.setAttribute('tabIndex', '-1')
        el.setAttribute('aria-selected', 'false')
        el.onfocus = () => handleFocus(index)
      }
    })

    if (focusedIndex === -1 && focusableElements) {
      const initialIndex = initialFocus === 'last' ? lastFocusableIndex : 0
      focusableElements[initialIndex]?.setAttribute('tabIndex', '0')
      focusableElements[initialIndex]?.setAttribute('aria-selected', 'true')
    }
  }, [focusableElements, focusedIndex, handleFocus, lastFocusableIndex, ...deps])

  /**
   * Listen to key down events on rootElement
   */
  useEffect(() => {
    rootElement?.addEventListener('keydown', handleKeyDown)

    return () => {
      rootElement?.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, rootElement])

  return undefined
}
