import * as React from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import { Topic, Reference, sameTopic } from './Topic'
import { User } from './../User'
import { updateBackendTopic } from './../backendSync'
import StringWithHtmlLinks from './StringWithHtmlLinks'
import { deleteBackendTopic } from './../backendSync'
import './CurrentTopicContentRenderer.scss'

interface CurrentTopicContentRendererProps {
  selectedTopic: Topic | null
  descendants: Topic[]
  references?: Reference[]
  currentTopic: Topic
  setUserTopicPageState: Function
  setAppState: Function
  currentUser?: User | null
}

interface CurrentTopicContentRendererState {
  showDeleteModal: boolean
}

class CurrentTopicContentRenderer extends React.Component<CurrentTopicContentRendererProps, CurrentTopicContentRendererState> {

  constructor(props: CurrentTopicContentRendererProps) {
    super(props)

    this.state = {
      showDeleteModal: false
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

  confirmDelete = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ showDeleteModal: true })
    event.stopPropagation()
  }

  deleteTopicAndDescendants = () => {
    const { currentTopic, currentUser } = this.props

    deleteBackendTopic(currentTopic, this.props.setAppState)
      .then(_ => window.location.href = `/${currentUser ? currentUser.username : ""}`)
      .catch(_ => {
        this.props.setAppState({ alert: { message: "Error deleting topic or children :(" , variant: "danger" }})
        this.setState({ showDeleteModal: false })
      })
  }

  public render() {
    const { currentTopic, currentUser, selectedTopic, descendants } = this.props
    const { showDeleteModal } = this.state
    const currentTopicSelected = currentTopic && selectedTopic && sameTopic(selectedTopic, currentTopic)
    const isLink = /^https?:\/\/[^\s]*$/.test(currentTopic.content)
    const isOwnBlog = currentUser && currentTopic && currentUser.id === currentTopic.user_id
    const editCurrentTopic = isOwnBlog && currentTopicSelected

    return (
      <>
        {!editCurrentTopic &&
          <span onClick={() => this.selectCurrentTopic()}>
            {isLink ?
              <StringWithHtmlLinks element={currentTopic.content}/>
            :
              currentTopic.content
            }
          {!selectedTopic && currentUser && currentTopic.user_id === currentUser.id &&
              <Button onClick={this.confirmDelete} className="delete-button" variant="link">
                <img src={process.env.PUBLIC_URL + '/images/close-outline.svg'} alt="delete" />
              </Button>
            }
          </span>
        }

        {editCurrentTopic &&
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
        <Modal show={showDeleteModal} onHide={() => this.setState({ showDeleteModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Delete topic and children?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This will delete <b>{currentTopic.content}</b> and {descendants.length} {descendants.length === 1 ? "child" : "children"}.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showDeleteModal: false })}>
              Close
            </Button>
            <Button variant="primary" onClick={this.deleteTopicAndDescendants}>
              Delete topic and children
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default CurrentTopicContentRenderer
