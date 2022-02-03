import {Flex} from '@sanity/ui'
import React, {useEffect, useState} from 'react'

interface ObserveElementProps {
  children: React.ReactElement
  options?: IntersectionObserverInit
  callback: IntersectionObserverCallback
}

export function ObserveElement(props: ObserveElementProps) {
  const {callback, children, options, ...rest} = props
  const [el, setEl] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const io = new IntersectionObserver(callback, options)

    if (el) {
      io.observe(el)
    }

    return () => {
      if (el) {
        io.unobserve(el)
        io.disconnect()
      }
    }
  }, [el, callback, options])

  return (
    <Flex ref={setEl} {...rest}>
      {children}
    </Flex>
  )
}
