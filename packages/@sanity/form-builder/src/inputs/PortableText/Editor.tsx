import {
  HotkeyOptions,
  PortableTextBlock,
  PortableTextEditable,
  PortableTextFeatures,
  RenderAnnotationFunction,
  RenderBlockFunction,
  RenderChildFunction,
  RenderDecoratorFunction,
  EditorSelection,
  OnPasteFn,
  OnCopyFn,
  PortableTextEditor,
  usePortableTextEditor,
} from '@sanity/portable-text-editor'
import {Marker, Path} from '@sanity/types'
import {Box, Card, Container, Flex, Theme, useLayer} from '@sanity/ui'
import {ScrollContainer} from '@sanity/base/components'
import React, {useMemo, useEffect} from 'react'
import styled, {css} from 'styled-components'
import PatchEvent from '../../PatchEvent'
import {ExpandCollapseButton} from './components/expandCollapseButton'
import {Toolbar} from './Toolbar'
import {RenderBlockActions, RenderCustomMarkers} from './types'
import {Decorator} from './Text/Decorator'
import {focusRingBorderStyle, focusRingStyle} from './Objects/styles'

interface PortableTextSanityEditorProps {
  hasFocus: boolean
  hotkeys: HotkeyOptions
  initialSelection?: EditorSelection
  isFullscreen: boolean
  markers: Array<Marker>
  onBlur: () => void
  onCopy?: OnCopyFn
  onFocus: (path?: Path) => void
  onFormBuilderChange: (change: PatchEvent) => void
  onPaste?: OnPasteFn
  onToggleFullscreen: () => void
  portableTextFeatures: PortableTextFeatures
  readOnly: boolean | null
  renderAnnotation: RenderAnnotationFunction
  renderBlock: RenderBlockFunction
  renderBlockActions?: RenderBlockActions
  renderChild: RenderChildFunction
  renderCustomMarkers?: RenderCustomMarkers
  setPortalElement?: (el: HTMLDivElement | null) => void
  setScrollContainerElement: (el: HTMLElement | null) => void
  value: PortableTextBlock[] | undefined
}

const Root = styled(Card)(({theme}: {theme: Theme}) => {
  const {focusRing, input, radius} = theme.sanity
  const {base, input: inputColor} = theme.sanity.color

  return css`
    &:not([hidden]) {
      display: flex;
    }
    position: relative;
    flex-direction: column;
    border-radius: ${radius[1]}px;

    --pte-box-shadow: ${focusRingBorderStyle({
      color: inputColor.default.enabled.border,
      width: input.border.width,
    })};

    &:after {
      content: '';
      position: absolute;
      z-index: 100;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: ${radius[1]}px;
      box-shadow: var(--pte-box-shadow);
      pointer-events: none;
    }

    &[data-focused] {
      --pte-box-shadow: ${focusRingStyle({
        base,
        border: {
          color: inputColor.default.enabled.border,
          width: input.border.width,
        },
        focusRing,
      })};
    }

    .root:not(.focus):not(.readOnly):not(.disabled) & {
      @media (hover: hover) {
        &:hover {
          box-shadow: var(--input-box-shadow--hover);
          border-color: var(--input-border-color-hover);
        }
      }
    }

    &:not([data-fullscreen]) {
      height: 400px;
    }

    &[data-fullscreen] {
      height: 100%;

      &:after {
        display: none;
      }
    }
  `
})

const EditableCard = styled(Card)<{$fullscreen: boolean}>((props: {$fullscreen: boolean}) => {
  const {$fullscreen} = props

  return css`
    /* The editable div itself */
    & > div {
      padding: ${$fullscreen ? '12px' : '0'};
      min-height: 0;
      flex: 1;
    }
  `
})

const renderDecorator: RenderDecoratorFunction = (mark, _markType, _attributes, defaultRender) => {
  return <Decorator mark={mark}>{defaultRender()}</Decorator>
}

export function PortableTextSanityEditor(props: PortableTextSanityEditorProps) {
  const {
    hasFocus,
    hotkeys: hotkeysProp,
    initialSelection,
    isFullscreen,
    // markers,
    onCopy,
    onFocus,
    onPaste,
    onToggleFullscreen,
    readOnly,
    renderAnnotation,
    renderBlock,
    // renderBlockActions,
    renderChild,
    setPortalElement,
    setScrollContainerElement,
    value,
  } = props

  const editor = usePortableTextEditor()
  const ptFeatures = useMemo(() => PortableTextEditor.getPortableTextFeatures(editor), [editor])
  const {isTopLayer} = useLayer()

  // TODO: Enable when we agree upon the hotkey for opening edit object interface when block object is focused
  // const handleOpenObjectHotkey = (
  //   event: React.BaseSyntheticEvent,
  //   ptEditor: PortableTextEditor
  // ) => {
  //   const selection = PortableTextEditor.getSelection(ptEditor)
  //   if (selection) {
  //     event.preventDefault()
  //     event.stopPropagation()
  //     const {focus} = selection
  //     const activeAnnotations = PortableTextEditor.activeAnnotations(ptEditor)
  //     const focusBlock = PortableTextEditor.focusBlock(ptEditor)
  //     const focusChild = PortableTextEditor.focusChild(ptEditor)
  //     if (activeAnnotations.length > 0) {
  //       onFocus([
  //         ...focus.path.slice(0, 1),
  //         'markDefs',
  //         {_key: activeAnnotations[0]._key},
  //         FOCUS_TERMINATOR,
  //       ])
  //       return
  //     }
  //     if (focusChild && PortableTextEditor.isVoid(ptEditor, focusChild)) {
  //       onFocus([...focus.path, FOCUS_TERMINATOR])
  //       return
  //     }
  //     if (focusBlock && PortableTextEditor.isVoid(ptEditor, focusBlock)) {
  //       onFocus([...focus.path.slice(0, 1), FOCUS_TERMINATOR])
  //     }
  //   }
  // }

  const customFromProps: HotkeyOptions = useMemo(
    () => ({
      custom: {
        'mod+enter': onToggleFullscreen,
        // TODO: disabled for now, enable when we agree on the hotkey
        // 'mod+o': handleOpenObjectHotkey,
        ...(hotkeysProp || {}).custom,
      },
    }),
    [hotkeysProp, onToggleFullscreen]
  )

  const defaultHotkeys = useMemo(() => {
    const def = {marks: {}}

    ptFeatures.decorators.forEach((dec) => {
      switch (dec.value) {
        case 'strong':
          def.marks['mod+b'] = dec.value
          break
        case 'em':
          def.marks['mod+i'] = dec.value
          break
        case 'underline':
          def.marks['mod+u'] = dec.value
          break
        case 'code':
          def.marks["mod+'"] = dec.value
          break
        default:
        // Nothing
      }
    })

    return def
  }, [ptFeatures.decorators])

  const marksFromProps: HotkeyOptions = useMemo(
    () => ({
      marks: {
        ...defaultHotkeys.marks,
        ...(hotkeysProp || {}).marks,
      },
    }),
    [hotkeysProp, defaultHotkeys]
  )

  const hotkeys: HotkeyOptions = useMemo(
    () => ({
      ...marksFromProps,
      ...customFromProps,
    }),
    [marksFromProps, customFromProps]
  )

  // const hasMarkers = useMemo(() => markers.length > 0, [markers])
  // const scClassNames = useMemo(
  //   () =>
  //     [
  //       styles.scrollContainer,
  //       ...(renderBlockActions || hasMarkers ? [styles.hasBlockExtras] : [styles.hasNoBlockExtras]),
  //     ].join(' '),
  //   [hasMarkers, renderBlockActions]
  // )
  // const editorWrapperClassNames = useMemo(() => [styles.editorWrapper].join(' '), [])
  // const editorClassNames = useMemo(
  //   () =>
  //     [
  //       styles.editor,
  //       ...(renderBlockActions || hasMarkers ? [styles.hasBlockExtras] : [styles.hasNoBlockExtras]),
  //     ].join(' '),
  //   [hasMarkers, renderBlockActions]
  // )

  useEffect(() => {
    if (!isTopLayer || !isFullscreen) return undefined

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onToggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isFullscreen, isTopLayer, onToggleFullscreen])

  const editorNode = useMemo(
    () => (
      <Root
        data-focused={hasFocus ? '' : undefined}
        data-fullscreen={isFullscreen ? '' : undefined}
        data-ui="PTEditor"
        // className={styles.editorBox}
      >
        <Flex
          // className={styles.header}
          style={{borderBottom: '1px solid var(--card-border-color)'}}
        >
          <Box
            data-ui="Editor__toolbarBox"
            flex={1}
            // className={styles.toolbarContainer}
          >
            <Toolbar
              isFullscreen={isFullscreen}
              hotkeys={hotkeys}
              onFocus={onFocus}
              renderBlock={renderBlock}
              readOnly={readOnly}
            />
          </Box>
          <Box
            data-ui="Editor__expandCollapseButtonBox"
            // className={styles.fullscreenButtonContainer}
            padding={isFullscreen ? 2 : 1}
            style={{borderLeft: '1px solid var(--card-border-color)'}}
          >
            <ExpandCollapseButton
              isFullscreen={isFullscreen}
              onToggleFullscreen={onToggleFullscreen}
            />
          </Box>
        </Flex>

        <Card
          // className={editorWrapperClassNames}
          data-ui="Editor__editableBg"
          flex={1}
          height={isFullscreen ? 'fill' : undefined}
          // padding={isFullscreen ? 2 : undefined}
          tone="transparent"
          sizing="border"
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: isFullscreen ? '100%' : undefined,
          }}
        >
          <ScrollContainer
            // className={scClassNames}
            data-ui="Editor__scrollContainer"
            ref={setScrollContainerElement}
            style={{
              overflow: 'auto',
              flex: 1,
              minHeight: 0,
              padding: isFullscreen ? 12 : undefined,
            }}
          >
            <Container
              data-ui="Editor__editableContainer"
              width={1}
              style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100%',
              }}
            >
              <EditableCard
                $fullscreen={isFullscreen}
                // className={editorClassNames}
                data-ui="Editor__editableCard"
                flex={1}
                // padding={isFullscreen ? 2 : undefined}
                shadow={isFullscreen ? 1 : undefined}
                style={{display: 'flex', flexDirection: 'column'}}
              >
                <PortableTextEditable
                  hotkeys={hotkeys}
                  onCopy={onCopy}
                  onPaste={onPaste}
                  placeholderText={value ? undefined : 'Empty'}
                  renderAnnotation={renderAnnotation}
                  renderBlock={renderBlock}
                  renderChild={renderChild}
                  renderDecorator={renderDecorator}
                  selection={initialSelection}
                  spellCheck
                />
              </EditableCard>
            </Container>
          </ScrollContainer>
        </Card>
        <div data-portal="" ref={setPortalElement} />
      </Root>
    ),
    [
      // editorClassNames,
      // editorWrapperClassNames,
      hasFocus,
      hotkeys,
      initialSelection,
      isFullscreen,
      onCopy,
      onFocus,
      onPaste,
      onToggleFullscreen,
      readOnly,
      renderAnnotation,
      renderBlock,
      renderChild,
      // scClassNames,
      setPortalElement,
      setScrollContainerElement,
      value,
    ]
  )

  return editorNode
}
