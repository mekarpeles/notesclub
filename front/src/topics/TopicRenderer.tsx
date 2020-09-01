import * as React from 'react'
import { Form } from 'react-bootstrap'
import { Topic, topicKey, newTopic } from './Topic'
import { createBackendTopic, updateBackendTopic } from './../backendSync'
import { getChildren, areSibling } from './ancestry'

interface TopicRendererProps {
  selectedTopic: Topic | null
  topic: Topic
  descendants: Topic[]
  siblings: Topic[]
  currentTopic: Topic
  renderSubtopics: boolean
  setUserTopicPageState: Function
  setAppState: Function
  currentBlogUsername: string
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
    const { topic, selectedTopic, siblings } = this.props
    let { descendants } = this.props

    if (selectedTopic) {
      switch (event.key) {
        case "Enter":
          const newPosition = selectedTopic.position + 1

          descendants = descendants.map((descendant, index) => {
            if (areSibling(descendant, topic) && descendant.position >= newPosition) {
              descendant.position += 1
            }
            return (descendant)
          })
          const newNonSavedTopic = newTopic({
            position: newPosition,
            user_id: selectedTopic.user_id,
            ancestry: selectedTopic.ancestry
          })
          descendants.push(newNonSavedTopic)

          updateBackendTopic(selectedTopic, this.props.setAppState)

          this.props.setUserTopicPageState({ selectedTopic: newNonSavedTopic, descendants: descendants })
          createBackendTopic(newNonSavedTopic, this.props.setAppState)
            .then(topicWithId => {
              const selected = this.props.selectedTopic
              this.props.setUserTopicPageState({
                descendants: descendants.map((d) => d.tmp_key === topicWithId.tmp_key ? topicWithId : d),
                selectedTopic: selected && selected.tmp_key === topicWithId.tmp_key ? topicWithId : selected
              })
            })
          break
        case "Escape":
          this.props.setUserTopicPageState({ selectedTopic: null })
          updateBackendTopic(selectedTopic, this.props.setAppState)
          break
        case "ArrowDown":
          if (event.shiftKey && (event.ctrlKey || event.metaKey)) {
            if (siblings.length > selectedTopic.position) {
              // Move selectedTopic down (increase position by 1)
              let found = false
              descendants = descendants.map((descendant) => {
                if (!found && areSibling(descendant, selectedTopic)) {
                  if ((selectedTopic.position + 1) === descendant.position) {
                    descendant.position -= 1
                    selectedTopic.position += 1
                    found = true
                  }
                }
                return (descendant)
              })
              this.props.setUserTopicPageState({ descendants: descendants, selectedTopic: selectedTopic })
              updateBackendTopic(selectedTopic, this.props.setAppState)
            }
          } else {
            // Select topic below
            if (siblings.length > selectedTopic.position) {
              updateBackendTopic(selectedTopic, this.props.setAppState)
              const newSelected = siblings.filter((sibling) => sibling.position === selectedTopic.position + 1)[0]
              this.props.setUserTopicPageState({ selectedTopic: newSelected })
            }
          }
          break
        case "ArrowUp":
          if (event.shiftKey && (event.ctrlKey || event.metaKey)) {
            if (selectedTopic.position > 1) {
              // Move selectedTopic up (decrease position by 1)

              let found = false
              descendants = descendants.map((descendant) => {
                if (!found && areSibling(descendant, selectedTopic)) {
                  if ((selectedTopic.position - 1) === descendant.position) {
                    descendant.position += 1
                    selectedTopic.position -= 1
                    found = true
                  }
                }
                return (descendant)
              })
              this.props.setUserTopicPageState({ descendants: descendants, selectedTopic: selectedTopic })
              updateBackendTopic(selectedTopic, this.props.setAppState)
            }
          } else {
            // Select topic above
            updateBackendTopic(selectedTopic, this.props.setAppState)
            const newSelected = siblings.filter((sibling) => sibling.position === selectedTopic.position - 1)[0]
            this.props.setUserTopicPageState({ selectedTopic: newSelected })
          }
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
      this.props.setUserTopicPageState({ selectedTopic: selectedTopic })
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

  selectTopic = (topic: Topic, event: React.MouseEvent<HTMLElement>) => {
    const { selectedTopic, currentBlogUsername } = this.props

    if (event.altKey) {
      window.location.href = `/${currentBlogUsername}/${topic.slug}`
    } else {
      // Update previously selected topic:
      if (selectedTopic) {
        updateBackendTopic(selectedTopic, this.props.setAppState)
      }

      // Select new topic:
      this.props.setUserTopicPageState({ selectedTopic: topic })
    }
  }

  public render () {
    const { selectedTopic, topic, renderSubtopics, descendants, currentBlogUsername, currentTopic } = this.props
    const isSelected = selectedTopic && (selectedTopic.id === topic.id && selectedTopic.tmp_key === topic.tmp_key)
    const children = getChildren(topic, descendants)

    return (
      <>
        <li key={topicKey(topic)} onClick={(event) => !isSelected && this.selectTopic(topic, event)}>
          {isSelected && this.renderSelectedTopic(topic)}
          {!isSelected && topic.content}
        </li>
        {renderSubtopics && children &&
          <li className="hide-bullet">
            <ul>
            {children.map((subTopic) => (
              <TopicRenderer
                currentBlogUsername={currentBlogUsername}
                key={"sub" + topicKey(subTopic)}
                topic={subTopic}
                descendants={descendants}
                siblings={children}
                currentTopic={currentTopic}
                renderSubtopics={true}
                selectedTopic={selectedTopic}
                setUserTopicPageState={this.props.setUserTopicPageState}
                setAppState={this.props.setAppState} />
            ))}
            </ul>
          </li>
        }
      </>
    )
  }
}

export default TopicRenderer
