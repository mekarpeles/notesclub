import * as React from 'react'
import { Link } from 'react-router-dom'
import { Topic, Reference, topicKey } from './Topic'
import { User } from './../User'
import { getChildren } from './ancestry'
import TopicRenderer from './TopicRenderer'

interface ReferenceRendererProps {
  topic: Reference
  selectedTopic: Topic | null
  setUserTopicPageState: Function
  setAppState: Function
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

  renderDescendants = (topic: Reference, children: Topic[]) => {
    return (
      <ul>
        {children.map((subTopic) => (
          <TopicRenderer
            currentBlogUsername={topic.user.username}
            key={"sub" + topicKey(subTopic)}
            topic={subTopic}
            descendants={topic.descendants}
            siblings={children}
            currentTopic={topic}
            renderSubtopics={true}
            selectedTopic={this.props.selectedTopic}
            setUserTopicPageState={this.props.setUserTopicPageState}
            setAppState={this.props.setAppState} />
        ))}
      </ul>
    )
  }

  renderParentWithDescendants = (topic: Reference, parent: Topic) => {
    let descendantsAndTopic = topic.descendants
    descendantsAndTopic = descendantsAndTopic.concat(topic)

    return (
      <ul>
        <TopicRenderer
          currentBlogUsername={topic.user.username}
          topic={topic}
          descendants={descendantsAndTopic}
          siblings={[topic]}
          currentTopic={parent}
          renderSubtopics={true}
          selectedTopic={this.props.selectedTopic}
          setUserTopicPageState={this.props.setUserTopicPageState}
          setAppState={this.props.setAppState} />
      </ul>
    )
  }

  public render () {
    const { topic } = this.props
    const ancestors = topic.ancestors

    let second_line: Topic[]
    let first_element: Topic
    let parent: Topic

    if (ancestors.length > 0) {
      parent = ancestors[ancestors.length - 1]
      first_element = ancestors[0]
      second_line = ancestors.slice(1, ancestors.length)
    } else {
      parent = topic
      first_element = topic
      second_line = []
    }
    const second_line_count = second_line.length
    const children = getChildren(topic as Topic, topic.descendants)

    return (
      <>
        {second_line_count > 0 &&
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
            {this.renderParentWithDescendants(topic, parent)}
          </li>
        }

        {second_line_count === 0 && first_element.id === topic.id &&
          <li key={`ref_${first_element.id}`}>
            {this.renderElement(first_element, topic.user)}

            {this.renderDescendants(topic, children)}
          </li>
        }

        {second_line_count === 0 && first_element.id != topic.id &&
          <li key={`ref_${first_element.id}`}>
            {this.renderElement(first_element, topic.user)}
            {this.renderParentWithDescendants(topic, parent)}
          </li>
        }
      </>
    )
  }
}

export default ReferenceRenderer
