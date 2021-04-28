import {uniqueId} from 'lodash'
import React, {useEffect, useState, useMemo, useCallback} from 'react'
import {Marker, Path} from '@sanity/types'
import {FormField} from '@sanity/base/components'
import {FormFieldPresence} from '@sanity/base/presence'
import {
  EditorChange,
  OnCopyFn,
  OnPasteFn,
  Patch as EditorPatch,
  PortableTextBlock,
  PortableTextEditor,
  Type,
  HotkeyOptions,
  InvalidValue,
} from '@sanity/portable-text-editor'
import {Subject} from 'rxjs'
import {Box, Button, Stack, useToast} from '@sanity/ui'
import styled from 'styled-components'
import PatchEvent from '../../PatchEvent'
import withPatchSubscriber from '../../utils/withPatchSubscriber'
import type {Patch} from '../../patch/types'
import {RenderBlockActions, RenderCustomMarkers} from './types'
import Input from './Input'
import {InvalidValue as RespondToInvalidContent} from './InvalidValue'
// import styles from './PortableTextInput.css'

export type PatchWithOrigin = Patch & {
  origin: 'local' | 'remote' | 'internal'
  timestamp: Date
}

type PatchSubscribe = (subscribeFn: PatchSubscriber) => () => void
type PatchSubscriber = ({
  patches,
}: {
  patches: PatchWithOrigin[]
  snapshot: PortableTextBlock[] | undefined
}) => void

interface PortableTextInputProps {
  focusPath: Path
  hotkeys: HotkeyOptions
  level: number
  markers: Marker[]
  onBlur: () => void
  onChange: (event: PatchEvent) => void
  onFocus: (path?: Path) => void
  onCopy?: OnCopyFn
  onPaste?: OnPasteFn
  readOnly: boolean | null
  renderBlockActions?: RenderBlockActions
  renderCustomMarkers?: RenderCustomMarkers
  presence: FormFieldPresence[]
  subscribe: PatchSubscribe
  type: Type
  value: PortableTextBlock[] | undefined
}

const Root = styled.div`
  position: relative;
`

const JumpToEditorBox = styled(Stack)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  &:not(:focus-within) {
    height: 1px;
    width: 1px;
    margin: 0;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
  }

  &:focus-within {
    z-index: 1000;
  }
`

const PortableTextInputWithRef = React.forwardRef(function PortableTextInput(
  props: Omit<PortableTextInputProps, 'level'>,
  ref: React.RefObject<PortableTextEditor>
) {
  const {
    focusPath,
    hotkeys,
    markers,
    onBlur,
    onChange,
    onCopy,
    onFocus,
    onPaste,
    presence,
    readOnly,
    renderBlockActions,
    renderCustomMarkers,
    type,
    value,
    subscribe,
  } = props

  const toast = useToast()

  // Reset invalidValue if new value is coming in from props
  const [invalidValue, setInvalidValue] = useState<InvalidValue | null>(null)
  useEffect(() => {
    if (invalidValue && value !== invalidValue.value) {
      setInvalidValue(null)
    }
  }, [invalidValue, value])

  // Memoized patch stream
  const patche$: Subject<EditorPatch> = useMemo(() => new Subject(), [])

  // Handle incoming patches from withPatchSubscriber HOC
  const handleDocumentPatches = useCallback(
    ({patches}: {patches: PatchWithOrigin[]; snapshot: PortableTextBlock[] | undefined}): void => {
      const patchSelection =
        patches && patches.length > 0 && patches.filter((patch) => patch.origin !== 'local')
      if (patchSelection) {
        patchSelection.map((patch) => patche$.next(patch))
      }
    },
    [patche$]
  )

  // Subscribe to incoming patches
  useEffect(() => {
    const unsubscribe = subscribe(handleDocumentPatches)
    return () => unsubscribe()
  }, [handleDocumentPatches, subscribe])

  // Handle editor changes
  const [hasFocus, setHasFocus] = useState(false)

  const handleEditorChange = useCallback(
    (change: EditorChange): void => {
      console.log('change', change)

      switch (change.type) {
        case 'mutation':
          // Don't wait for the result
          setTimeout(() => {
            onChange(PatchEvent.from(change.patches))
          })
          break
        case 'focus':
          setHasFocus(true)
          break
        case 'blur':
          setHasFocus(false)
          break
        case 'undo':
        case 'redo':
          onChange(PatchEvent.from(change.patches))
          break
        case 'invalidValue':
          setInvalidValue(change)
          break
        case 'error':
          toast.push({
            status: change.level,
            description: change.description,
          })
          break
        default:
      }
    },
    [onChange, toast]
  )

  const [ignoreValidationError, setIgnoreValidationError] = useState(false)

  const handleIgnoreValidation = useCallback((): void => {
    setIgnoreValidationError(true)
  }, [])

  const handleFocusSkipper = useCallback(() => {
    if (ref.current) {
      PortableTextEditor.focus(ref.current)
    }
  }, [ref])

  // Render error message and resolution
  let respondToInvalidContent = null

  if (invalidValue) {
    respondToInvalidContent = (
      <Box marginBottom={2}>
        <RespondToInvalidContent
          onChange={handleEditorChange}
          onIgnore={handleIgnoreValidation}
          resolution={invalidValue.resolution}
        />
      </Box>
    )
  }

  const [isFullscreen, setIsFullscreen] = useState(false)
  const handleToggleFullscreen = useCallback(() => setIsFullscreen(!isFullscreen), [isFullscreen])
  const editorId = useMemo(() => uniqueId('PortableTextInputRoot'), [])

  const editorInput = useMemo(
    () => (
      <Root>
        <PortableTextEditor
          data-ui="PortableTextEditor"
          ref={ref}
          incomingPatche$={patche$.asObservable()}
          key={`portable-text-editor-${editorId}`}
          onChange={handleEditorChange}
          // TODO: from schema?
          // maxBlocks={undefined}
          readOnly={readOnly}
          type={type}
          value={value}
        >
          {!readOnly && (
            <JumpToEditorBox padding={1}>
              <Button
                fontSize={1}
                mode="bleed"
                padding={2}
                onClick={handleFocusSkipper}
                // tabIndex={0}
                text="Jump to editor"
              />
            </JumpToEditorBox>
          )}

          <Input
            focusPath={focusPath}
            hasFocus={hasFocus}
            hotkeys={hotkeys}
            isFullscreen={isFullscreen}
            key={`portable-text-input-${editorId}`}
            markers={markers}
            onBlur={onBlur}
            onChange={onChange}
            onCopy={onCopy}
            onFocus={onFocus}
            onPaste={onPaste}
            onToggleFullscreen={handleToggleFullscreen}
            patche$={patche$}
            presence={presence}
            readOnly={readOnly}
            renderBlockActions={renderBlockActions}
            renderCustomMarkers={renderCustomMarkers}
            type={props.type}
            value={value}
          />
        </PortableTextEditor>
      </Root>
    ),
    [
      editorId,
      focusPath,
      handleEditorChange,
      handleFocusSkipper,
      handleToggleFullscreen,
      hasFocus,
      hotkeys,
      isFullscreen,
      markers,
      onBlur,
      onChange,
      onCopy,
      onFocus,
      onPaste,
      patche$,
      presence,
      props.type,
      readOnly,
      ref,
      renderBlockActions,
      renderCustomMarkers,
      type,
      value,
    ]
  )

  return (
    <>
      {invalidValue && !ignoreValidationError && respondToInvalidContent}
      {(!invalidValue || ignoreValidationError) && editorInput}
    </>
  )
})

export const PortableTextInput = withPatchSubscriber(
  class PortableTextInputWithFocusAndBlur extends React.Component<
    PortableTextInputProps & {children: React.ReactNode}
  > {
    editorRef: React.RefObject<PortableTextEditor> = React.createRef()

    focus() {
      if (this.editorRef.current) {
        PortableTextEditor.focus(this.editorRef.current)
      }
    }

    blur() {
      if (this.editorRef.current) {
        PortableTextEditor.blur(this.editorRef.current)
      }
    }

    render() {
      const {type, level, markers, presence} = this.props
      return (
        <FormField
          description={type.description}
          title={type.title}
          level={level}
          __unstable_markers={markers}
          __unstable_presence={presence}
          __unstable_changeIndicator={false}
        >
          <PortableTextInputWithRef {...this.props} ref={this.editorRef} />
        </FormField>
      )
    }
  }
)
