import * as React from 'react'
import { Link } from 'react-router-dom'
import { Topic, Reference } from './Topic'
import { User } from './../User'

interface ReferenceRendererProps {
  topic: Reference
}

interface ReferenceRendererState {

}

class ReferenceRenderer extends React.Component<ReferenceRendererProps, ReferenceRendererState> {
  constructor(props: ReferenceRendererProps) {
    super(props)

    this.state = {
    }
  }

  renderElement = (topic: Topic | Reference, user: User) => {
    const path = `/${user.username}/${topic.slug}`

    return (
      <Link to={path} onClick={() => window.location.href = path}>{topic.content}</Link>
    )
  }

  public render () {
    const { topic } = this.props

    const second_line = topic.ancestors || []
    const first_element = second_line.shift() || topic
    const first_element_path = `/${topic.user.username}/${first_element.slug}`
    const second_line_count = second_line.length

    return (
      <>
        {topic.ancestors && second_line_count > 0 &&
          <li key={`ref_${first_element.id}`}>
            {this.renderElement(first_element, topic.user)}
            <p>
              {second_line.map((ancestor, index) => {
                const path = topic.user ? `/${topic.user.username}/${ancestor.slug}` : '/'
                return (
                  <span>
                    {this.renderElement(ancestor, topic.user)}
                    {index < second_line_count - 1 ? ' > ' : ''}
                  </span>
                )
              })}
            </p>
            <ul>
              <li>
                {topic.content}
                descendants:...
              </li>
            </ul>
          </li>
        }

        {topic.ancestors && second_line_count === 0 && first_element.id === topic.id &&
          <li key={`ref_${first_element.id}`}>
            {topic.content}
            descendants:...
          </li>
        }

        {topic.ancestors && second_line_count === 0 && first_element.id != topic.id &&
          <li key={`ref_${first_element.id}`}>
            {first_element.content}
            <ul>
              <li>
                {topic.content}
                descendants:...
              </li>
            </ul>
          </li>
        }
      </>
    )
  }
}

export default ReferenceRenderer
