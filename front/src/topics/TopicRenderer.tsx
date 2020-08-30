import * as React from 'react'
import { Topic, Topics, BackendTopic } from './Topic'
import { Form, Button } from 'react-bootstrap'
import { fetchUser, fetchUsers, fetchTopics, updateBackendTopic } from './../backendFetchers'
import { sleep } from './../utils/sleep'

interface TopicRendererProps {
  selectedTopic: BackendTopic | null
  topic: BackendTopic
  renderSubtopics: boolean
  setTopicPageState: Function
  setAppState: Function
}

interface TopicRendererState {

}

class TopicRenderer extends React.Component<TopicRendererProps, TopicRendererState> {
  constructor(props: TopicRendererProps) {
    super(props)

    this.state = {

    }
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { selectedTopic } = this.props

    if (selectedTopic) {
      switch (event.key) {
        case "Escape":
          this.props.setTopicPageState({ selectedTopic: null })

          updateBackendTopic(selectedTopic)
            .catch(_ => {
              console.log("Error updating Backend. Sleeping 200ms and trying again.")
              sleep(200)
                .then(_ => {
                  updateBackendTopic(selectedTopic)
                    .catch(_ => this.props.setAppState({ alert: { variant: "danger", message: "Sync error. Please copy your last change and refresh. Sorry, we're in alpha!" } }))
                })
            })
          break
      }
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const name = target.name
    const topicId = name.replace("topic_", "")
    let { selectedTopic } = this.props

    if (selectedTopic) {
      selectedTopic.content = value
      this.setState({ selectedTopic: selectedTopic })
    }
  }

  renderSelectedTopic = (topic: BackendTopic) => {
    return (
      <>
        <Form.Group>
          <Form.Control
            type="text"
            value={topic.content}
            name={`topic_${topic.id}`}
            onKeyDown={this.onKeyDown}
            onChange={this.handleChange as any} autoFocus
          />
        </Form.Group>
      </>
    )
  }

  renderUnselectedTopic = (topic: Topic) => {
  }

  public render () {
    const { selectedTopic, topic } = this.props
    const isSelected = (selectedTopic === topic)

    return (
      <li key={`topic_${topic.id}`} onClick={() => !isSelected && this.props.setTopicPageState({ selectedTopic: topic })}>
        {isSelected && this.renderSelectedTopic(topic)}
        {!isSelected && topic.content}
      </li>
    )
  }
}

export default TopicRenderer
