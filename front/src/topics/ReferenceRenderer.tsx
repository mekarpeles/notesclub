import * as React from 'react'
import { Topic } from './Topic'

interface ReferenceRendererProps {
  topic: Topic
}

interface ReferenceRendererState {

}

class ReferenceRenderer extends React.Component<ReferenceRendererProps, ReferenceRendererState> {
  constructor(props: ReferenceRendererProps) {
    super(props)

    this.state = {
    }
  }

  public render () {
    const { topic } = this.props

    const user = topic.user

    return (
      <li key={`ref_${topic.id}`}>
        {topic.user?.name}: {topic.content}
      </li>
    )
  }
}

export default ReferenceRenderer
