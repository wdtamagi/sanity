import React, {useMemo} from 'react'
import styled from 'styled-components'

export interface CustomIconProps {
  icon: string
  active: boolean
}

const Root = styled.span`
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: inherit;
  background-origin: content-box;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

export function CustomIcon(props: CustomIconProps) {
  const {icon, active} = props

  return useMemo(
    () => (
      <Root
        style={{
          backgroundImage: `url(${icon})`,
          filter: active ? 'invert(100%)' : 'invert(0%)',
        }}
      />
    ),
    [active, icon]
  )
}
