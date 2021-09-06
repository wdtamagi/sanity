import {FormField, FormFieldSet} from '@sanity/base/components'
import {usePaneRouter} from '@sanity/desk-tool'
import {LinkIcon} from '@sanity/icons'
import {Button, Stack, Text, TextInput} from '@sanity/ui'
import {PatchEvent, set, unset, setIfMissing} from 'part:@sanity/form-builder/patch-event'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import React, {useCallback} from 'react'

const documentIdPath = ['documentId']

export function PseudoReferenceInput(props: any) {
  const {onChange, type, value} = props
  const typeName = type.name
  const documentId = value?.documentId
  const {ChildLink} = usePaneRouter()

  const handleDocumentIdChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextDocumentId = event.currentTarget.value

      onChange(
        PatchEvent.from([
          setIfMissing({_type: typeName}),
          nextDocumentId ? set(nextDocumentId, documentIdPath) : unset(documentIdPath),
        ])
      )
    },
    [onChange, typeName]
  )

  const DocumentLink = useCallback(
    (linkProps: any) => {
      return <ChildLink {...linkProps} childId={documentId} childParameters={{}} />
    },
    [ChildLink, documentId]
  )

  return (
    <FormFieldSet level={1} title={type.title}>
      <Stack space={5}>
        {documentId && (
          <Button
            as={DocumentLink}
            data-as="a"
            mode="ghost"
            padding={2}
            // text={documentId}
            tone="primary"
          >
            <SanityDefaultPreview
              status={
                <Text>
                  <LinkIcon />
                </Text>
              }
              value={{id: documentId, type: 'author'}}
            />
          </Button>
        )}

        <FormField title="Document ID">
          <TextInput onChange={handleDocumentIdChange} value={documentId || ''} />
        </FormField>
      </Stack>
    </FormFieldSet>
  )
}
