import PropTypes from 'prop-types'
import React from 'react'
import {PreviewAny} from './utils/fallback-preview/PreviewAny'

type PreviewProps = {
  layout?: string
  value?: any
  type: object
}
export default class Preview extends React.PureComponent<PreviewProps, {}> {
  static contextTypes = {
    formBuilder: PropTypes.object,
  }
  render() {
    const {type, value} = this.props
    if (!this.context.formBuilder) {
      return <div>Missing form builder in context</div>
    }
    const PreviewComponent = this.context.formBuilder.resolvePreviewComponent(type)
    if (PreviewComponent) {
      return <PreviewComponent {...this.props} />
    }
    return (
      <div title="Unable to resolve preview component. Using fallback.">
        <PreviewAny value={value} maxDepth={2} />
      </div>
    )
  }
}
