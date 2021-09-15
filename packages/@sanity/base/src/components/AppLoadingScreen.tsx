import React from 'react'
import {ThemeProvider, studioTheme, Flex, Stack, Text} from '@sanity/ui'

import {FillShape, LoaderWrapper} from './AppLoadingScreen.styles'

export const AppLoadingScreen: React.FunctionComponent<{text?: string}> = ({
  text = 'Loading Content Studio',
}) => {
  return (
    <ThemeProvider theme={studioTheme}>
      <Flex align="center" justify="center" height="fill" width="fill">
        <Stack space={5} padding={2}>
          <LoaderWrapper>
            <svg
              width="73"
              height="95"
              viewBox="0 0 73 95"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              shapeRendering="geometricPrecision"
            >
              <mask
                id="bottom"
                mask-type="alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="62"
                width="67"
                height="33"
              >
                <path
                  d="M56.4905 62.9807C63.6434 67.5637 66.7972 73.9744 66.7972 83.168C60.7987 90.7262 50.4577 95 38.2203 95C17.6963 95 3.17759 84.8102 0.0100098 67.282H19.7851C22.3343 75.3761 29.0748 79.1209 38.0622 79.1209C49.056 79.1209 56.3462 73.2598 56.4905 62.9807"
                  fill="white"
                />
              </mask>
              <g mask="url(#bottom)">
                <FillShape
                  data-placement="bottom"
                  d="M8 59C9.35605 77.6466 25.4128 87.4032 37.5 87.5C54 87.6322 62 75 71.5 66.5"
                />
              </g>

              <mask
                id="middle"
                mask-type="alpha"
                maskUnits="userSpaceOnUse"
                x="2"
                y="12"
                width="71"
                height="72"
              >
                <path
                  d="M7.73317 12.1206C7.73317 24.8871 15.6418 32.5484 31.4729 36.568L48.2521 40.4571C63.238 43.8926 72.3834 52.4472 72.3834 66.3818C72.493 72.4436 70.5187 78.3594 66.7904 83.1404C66.7904 69.2402 59.5963 61.7232 42.2605 57.2157L25.7698 53.471C12.5842 50.4683 2.40806 43.4323 2.40806 28.2952C2.33733 22.4523 4.21324 16.7521 7.74004 12.0931"
                  fill="white"
                />
              </mask>
              <g mask="url(#middle)">
                <FillShape
                  data-placement="middle"
                  d="M-15.5 8.5C-15.5 12 -1 41.7047 38.3457 48C65.7344 52.3822 69 68 62.8457 74.5C56.6914 81 54.5 82 54.5 82"
                />
              </g>

              <mask
                id="top"
                mask-type="alpha"
                maskUnits="userSpaceOnUse"
                x="7"
                y="0"
                width="65"
                height="32"
              >
                <path
                  d="M18.0122 31.1124C11.1411 26.7149 7.70557 20.524 7.70557 12.1138C13.4636 4.59677 23.3648 0 35.5198 0C56.4973 0 68.6317 11.09 71.6275 26.6737H52.5945C50.4988 20.5309 45.2562 15.7348 35.6641 15.7348C25.4399 15.7348 18.4863 21.6852 18.0122 31.1124"
                  fill="white"
                />
              </mask>
              <g mask="url(#top)">
                <FillShape
                  data-placement="top"
                  d="M9 35C9 21 19 5.49993 40 8.49996C61 11.5 65.3456 29 65.3456 33.5"
                />
              </g>
            </svg>
          </LoaderWrapper>
          <Text size={1} weight="semibold">
            {text}
          </Text>
        </Stack>
      </Flex>
    </ThemeProvider>
  )
}

export default AppLoadingScreen
