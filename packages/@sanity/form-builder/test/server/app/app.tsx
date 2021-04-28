// import PortableTextEditor from '@sanity/form-builder/inputs/PortableText/PortableTextInput'
// import {createSchema} from '@sanity/base'
import {LegacyPartsProvider} from '@sanity/base'
import FormBuilderContext from '@sanity/form-builder/FormBuilderContext'
import {BlockObject} from '@sanity/form-builder/inputs/PortableText/Objects/BlockObject'
import {Box, studioTheme, Text, ThemeProvider} from '@sanity/ui'
import React, {useCallback, useMemo} from 'react'
import {Type} from '@sanity/portable-text-editor'

const mockParts = {
  'part:@sanity/base/router': {useRouter: () => ({})},
}

// const schema = createSchema({
//   type: [
//     {
//       type: 'document',
//       name: 'post',
//       title: 'Post',
//       fields: [
//         {
//           type: 'string',
//           name: 'title',
//           title: 'Title',
//         },
//       ],
//     },
//   ],
// })

// console.log(schema)

export function App() {
  const attributes = {
    focused: true,
    selected: true,
    path: [],
    // annotations?: PortableTextBlock[];
    // style?: string;
    // listItem?: string;
  }

  const ptValue = {
    _type: 'block',
    _key: 'foo',
    myParam: 'Foo',
  }

  // const handleChange = useCallback(() => {}, [])
  const handleFocus = useCallback(() => {
    //
  }, [])

  const type: Type = useMemo(
    () => ({
      type: {} as any,
      name: 'test',
      title: 'Test',
      options: {},
      // type: Type;
      // name: string;
      // title: string;
      // description?: string;
      // readOnly?: boolean;
      // of?: Type[];
      // options: Record<string, any> | null;
      // fields?: Type[];
      // [prop: string]: any;
    }),
    []
  )

  const mockEditor = useMemo(() => ({} as any), [])

  // console.log(schema)

  const resolveInputComponent = useCallback((t: any) => {
    console.log('resolveInputComponent', t)
    return function CustomInput() {
      return (
        <Box padding={4}>
          <Text>Input</Text>
        </Box>
      )
    }
  }, [])

  const resolvePreviewComponent = useCallback((t: any) => {
    console.log('resolvePreviewComponent', t)
    return function CustomPreview() {
      return (
        <Box padding={4}>
          <Text>Preview</Text>
        </Box>
      )
    }
  }, [])

  return (
    <LegacyPartsProvider parts={mockParts}>
      <ThemeProvider theme={studioTheme}>
        <div>
          <FormBuilderContext
            schema={{} as any}
            patchChannel={{} as any}
            resolveInputComponent={resolveInputComponent}
            resolvePreviewComponent={resolvePreviewComponent}
            value={{} as any}
          >
            <BlockObject
              attributes={attributes}
              editor={mockEditor}
              focusPath={[]}
              markers={[]}
              // onChange={handleChange}
              onFocus={handleFocus}
              readOnly={false}
              type={type}
              value={ptValue}
            />
          </FormBuilderContext>
        </div>
      </ThemeProvider>
    </LegacyPartsProvider>
  )
}
