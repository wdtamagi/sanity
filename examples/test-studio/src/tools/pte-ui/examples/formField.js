import {
  FormBuilderContext,
  PortableTextInput,
  resolveInputComponent,
  SanityFormBuilder,
} from '@sanity/form-builder'
import {Card, Text} from '@sanity/ui'
import React, {useCallback, useMemo} from 'react'
import schema from 'part:@sanity/base/schema'
import SanityPreview from 'part:@sanity/base/preview'
import styled from 'styled-components'

const resolvePreviewComponent = () => SanityPreview

const EMPTY_ARRAY = []

const Root = styled.div`
  [data-ui='PTEditor'] {
    height: 600px;
  }
`

const documentType = 'simpleBlock'
const fieldName = 'body'

export function PTFormFieldExample(props) {
  const {value} = props
  // const compareValue = EMPTY_ARRAY
  const filterField = useCallback(() => true, [])
  const focusPath = EMPTY_ARRAY
  const markers = EMPTY_ARRAY
  const onBlur = useCallback(() => undefined, [])
  const onChange = useCallback((patch) => console.log('onChange', patch), [])
  const onFocus = useCallback(() => undefined, [])
  const patchChannel = useMemo(() => SanityFormBuilder.createPatchChannel(), [])
  const presence = EMPTY_ARRAY
  const readOnly = false
  const docType = schema.get(documentType)
  const type = docType && docType.fields.find((f) => f.name === fieldName)
  const hotkeys = EMPTY_ARRAY

  if (!type) {
    return (
      <Card border padding={3} tone="critical">
        <Text>
          Schema type not found:{' '}
          <code>
            {documentType}.{fieldName}
          </code>
        </Text>
      </Card>
    )
  }

  return (
    <Root>
      <FormBuilderContext
        value={value}
        patchChannel={patchChannel}
        schema={schema}
        filterField={filterField}
        resolveInputComponent={resolveInputComponent}
        resolvePreviewComponent={resolvePreviewComponent}
      >
        <PortableTextInput
          focusPath={focusPath}
          hotkeys={hotkeys}
          level={1}
          markers={markers}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          // onCopy?: OnCopyFn
          // onPaste?: OnPasteFn
          readOnly={readOnly}
          // renderBlockActions?: RenderBlockActions
          // renderCustomMarkers?: RenderCustomMarkers
          presence={presence}
          // subscribe: PatchSubscribe
          type={type.type}
          value={value}
        />
      </FormBuilderContext>
    </Root>
  )
}
