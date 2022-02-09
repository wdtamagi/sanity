import {useText} from '@sanity/ui-workshop'
import React from 'react'
import {NewsBlock} from '..'

export default function NewsBlockStory() {
  const label = useText('Label', 'Studio 2.8')
  const title = useText('Title', 'Try the next version of the Sanity Studio')
  const description = useText(
    'Description',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
  )
  const link = useText('Link', 'Check out the new features')
  const image = useText(
    'Image',
    'https://repository-images.githubusercontent.com/252413723/e6f28180-8882-11ea-9e76-78d72dfa2af0'
  )

  const linkObj = {
    url: '#',
    text: link,
  }

  return (
    <NewsBlock title={title} image={image} label={label} description={description} link={linkObj} />
  )
}
