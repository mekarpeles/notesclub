import * as React from 'react'
import { Form } from 'react-bootstrap'
import { Topic, Reference, sameTopic } from './Topic'
import { User } from './../User'
import { updateBackendTopic } from './../backendSync'

interface CurrentTopicContentRendererProps {
  selectedTopic: Topic | null
  descendants: Topic[]
  references?: Reference[]
  currentTopic: Topic
  setUserTopicPageState: Function
  setAppState: Function
  currentUser: User | undefined
}

interface CurrentTopicContentRendererState {
}

class CurrentTopicContentRenderer extends React.Component<CurrentTopicContentRendererProps, CurrentTopicContentRendererState> {

  constructor(props: CurrentTopicContentRendererProps) {
    super(props)

    this.state = {
    }
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const { currentTopic } = this.props
    let { selectedTopic, descendants, references } = this.props

    if (selectedTopic && references) {
      descendants = descendants.map((descendant) => {
        if (descendant.user_id === currentTopic.user_id) {
          descendant.content = descendant.content.replace(new RegExp('\\[\\[' + currentTopic.content + '\\]\\]', 'g'), `[[${value}]]`)
        }
        return (descendant)
      })
      references = references.map((reference) => {
        if (reference.user_id === currentTopic.user_id) {
          reference.content = reference.content.replace(new RegExp('\\[\\[' + currentTopic.content + '\\]\\]', 'g'), `[[${value}]]`)
        }
        return (reference)
      })
      selectedTopic.content = value

      // We also need to update all topics which include [[currentTopic.content]] in their content
      updateBackendTopic(currentTopic, this.props.setAppState, true)
      this.props.setUserTopicPageState({
        selectedTopic: selectedTopic,
        currentTopic: selectedTopic,
        descendants: descendants,
        references: references
      })
    }
  }

  selectCurrentTopic = () => {
    this.props.setUserTopicPageState({ selectedTopic: this.props.currentTopic })
  }


  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { selectedTopic } = this.props

    if (selectedTopic) {
      if (event.key === "Enter" || event.key === "Escape") {
        this.props.setUserTopicPageState({ selectedTopic: null })
      }
    }
  }

  public render() {
    const { currentTopic, selectedTopic } = this.props
    const currentTopicSelected = currentTopic && selectedTopic && sameTopic(selectedTopic, currentTopic)
    const isLink = /^https?:\/\/[^\s]*$/.test(currentTopic.content)
    const contentShortened = currentTopic.content.length > 50 ? currentTopic.content.slice(0, 50) + "..." : currentTopic.content
    return (
      <>
        {currentTopic && !currentTopicSelected &&
          <span onClick={() => this.selectCurrentTopic()}>
          {isLink ?
            <a href={currentTopic.content} target="_blank" onClick={(event) => event.stopPropagation()}>{contentShortened}</a>
          :
            currentTopic.content
          }
          </span>
        }

        {currentTopic && currentTopicSelected &&
          <Form.Group>
            <Form.Control
              type="text"
              value={currentTopic.content}
              name="current_topic"
              onKeyDown={this.onKeyDown}
              onChange={this.handleChange as any}
            />
          </Form.Group>
        }
      </>
    )
  }
}

export default CurrentTopicContentRenderer
