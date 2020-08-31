import * as React from 'react'
import { Form } from 'react-bootstrap'
import { Topic, topicKey, sameTopic } from './Topic'
import { createBackendTopic, updateBackendTopic } from './../backendFetchers'
import { sleep } from './../utils/sleep'
import { getChildren, areSibling } from './ancestry'

interface TopicRendererProps {
  selectedTopic: Topic | null
  topic: Topic
  descendants: Topic[]
  siblings: Topic[]
  currentTopic: Topic
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
    const { topic, selectedTopic } = this.props
    let { descendants } = this.props

    if (selectedTopic) {
      switch (event.key) {
        case "Enter":
          const newPosition = selectedTopic.position + 1
          const newTopic = {
            content: "",
            position: newPosition,
            user_id: selectedTopic.user_id,
            ancestry: selectedTopic.ancestry,
            descendants: new Array<Topic>(),
            tmp_key: Math.random().toString(36).substring(2)
          }
          descendants = descendants.map((descendant, index) => {
            if (areSibling(descendant, topic) && descendant.position >= newPosition) {
              descendant.position += 1
            }
            return (descendant)
          })
          descendants.push(newTopic)

          updateBackendTopic(selectedTopic)
            .catch(_ => this.props.setAppState({ alert: { variant: "danger", message: "Sync error. Please copy your last change and refresh. Sorry, we're in alpha!" } }))
          this.props.setTopicPageState({ selectedTopic: newTopic, descendants: descendants })
          createBackendTopic(newTopic)
            .then(topicWithId => {
              const selected = this.props.selectedTopic
              this.props.setTopicPageState({
                descendants: descendants.map((d) => d.tmp_key === topicWithId.tmp_key ? topicWithId : d),
                selectedTopic: selected && selected.tmp_key === topicWithId.tmp_key ? topicWithId : selected
              })
            })
            .catch(_ => this.props.setAppState({ alert: { variant: "danger", message: "Sync error A3X. Please copy your last change and refresh. Sorry, we're in alpha!" } }))
          break
        case "Escape":
          this.props.setTopicPageState({ selectedTopic: null })

          updateBackendTopic(selectedTopic)
            .catch(_ => {
              console.log("Error updating Backend. Sleeping 200ms and trying again.")
              sleep(200)
                .then(_ => {
                  selectedTopic && updateBackendTopic(selectedTopic)
                    .catch(_ => this.props.setAppState({ alert: { variant: "danger", message: "Sync error. Please copy your last change and refresh. Sorry, we're in alpha!" } }))
                })
            })
          break
        case "ArrowDown":

          break
      }
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const name = target.name
    let { selectedTopic } = this.props
    if (selectedTopic) {
      selectedTopic.content = value
      this.props.setTopicPageState({ selectedTopic: selectedTopic })
    }
  }

  renderSelectedTopic = (topic: Topic) => {
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
    const isSelected = selectedTopic && (selectedTopic.id === topic.id && selectedTopic.tmp_key === topic.tmp_key)

    return (
      <li key={topicKey(topic)} onClick={() => !isSelected && this.props.setTopicPageState({ selectedTopic: topic })}>
        {isSelected && this.renderSelectedTopic(topic)}
        {!isSelected && topic.content}
      </li>
    )
  }
}

export default TopicRenderer
