import {ErrorOutlineIcon} from '@sanity/icons'

export default {
  name: 'simpleBlock',
  title: 'Simple block',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'body',
      description: 'A simple portable text field',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {type: 'object', name: 'link', fields: [{type: 'string', name: 'url'}]},
              {type: 'object', name: 'test', fields: [{type: 'string', name: 'mystring'}]},
              {
                type: 'object',
                icon: ErrorOutlineIcon,
                name: 'validated',
                title: 'Validated',
                fields: [
                  {
                    type: 'string',
                    name: 'title',
                    title: 'Title',
                    validation: (Rule) => Rule.required(),
                  },
                ],
              },
            ],
          },
          of: [
            {type: 'image', name: 'image'},
            {
              type: 'object',
              name: 'test',
              fields: [{type: 'string', name: 'mystring', validation: (Rule) => Rule.required()}],
            },
            {
              type: 'reference',
              name: 'strongAuthorRef',
              title: 'A strong author ref',
              to: {type: 'author'},
            },
          ],
        },
        {type: 'image', name: 'image'},
        {
          type: 'object',
          name: 'test',
          fields: [{type: 'string', name: 'mystring', validation: (Rule) => Rule.required()}],
        },
      ],
    },
    {
      name: 'notes',
      type: 'array',
      of: [
        {
          type: 'simpleBlockNote',
        },
      ],
    },
  ],
}
