/* eslint-disable import/named */

import styled, {css, DefaultTheme, StyledComponent} from 'styled-components'

export const AssetBackground: StyledComponent<'div', DefaultTheme> = styled.div.attrs({
  'data-ui': 'AssetBackground',
})(() => {
  return css`
    position: relative;
    padding-bottom: 100%;

    & > div {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `
})
