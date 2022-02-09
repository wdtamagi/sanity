import {Button, ButtonProps, Card, CardTone, Flex, FlexProps, Text, Theme} from '@sanity/ui'
import React from 'react'
import styled, {css} from 'styled-components'
import {Link} from './Link'

interface BannerProps {
  buttonProps?: ButtonProps
  links: {
    title: string
    url: string
  }[]
  onClose?: () => void
  title: string
  tone?: CardTone
}

const RootCard = styled(Card)(({theme, $tone}: {theme: Theme; $tone: CardTone}) => {
  const {bg, fg} = theme.sanity.color.solid[$tone || 'default'].enabled

  return css`
    /* --card-bg-color: ${bg};
    --card-fg-color: ${fg};
    --card-link-color: ${fg}; */
    --card-link-color: var(--card-fg-muted-color);
  `
})

const TitleText = styled(Text)`
  word-break: break-word;
`

const GAP = 4
const DIRECTION: FlexProps['direction'] = ['column', 'column', 'row']
const ALIGN: FlexProps['align'] = ['flex-start', 'flex-start', 'center']

export function Banner(props: BannerProps) {
  const {buttonProps, tone, title, links, onClose} = props

  return (
    <RootCard paddingX={4} paddingY={[4, 4, 2]} sizing="border" tone={tone} $tone={tone}>
      <Flex align={ALIGN} gap={GAP} direction={DIRECTION}>
        <Flex align={ALIGN} direction={DIRECTION} flex={1} gap={GAP}>
          <TitleText size={1} weight="semibold" muted>
            {title}
          </TitleText>

          {links?.map((link) => (
            <Link key={link.title} text={link.title} href={link.url} />
          ))}
        </Flex>

        <Button
          fontSize={1}
          mode="ghost"
          onClick={onClose}
          padding={2}
          radius={2}
          text="Snooze"
          {...buttonProps}
        />
      </Flex>
    </RootCard>
  )
}
