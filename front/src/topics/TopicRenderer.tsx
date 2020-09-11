import * as React from 'react'
import { Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Topic, topicKey, newTopicWithDescendants, sameTopic, topicOrAncestorBelow, topicAbove, lastDescendantOrSelf } from './Topic'
import { createBackendTopic, updateBackendTopic, deleteBackendTopic } from './../backendSync'
import { getChildren, areSibling, getParent } from './ancestry'
import { parameterize } from './../utils/parameterize'
import { User } from './../User'
import { sleep } from './../utils/sleep'

interface TopicRendererProps {
  selectedTopic: Topic | null
  topic: Topic
  descendants: Topic[]
  siblings: Topic[]
  currentTopic: Topic
  renderSubtopics: boolean
  setUserTopicPageState: Function
  setAppState: Function
  currentBlogger: User
  currentUser: User | undefined
  isReference: boolean
}

interface TopicRendererState {
}

class TopicRenderer extends React.Component<TopicRendererProps, TopicRendererState> {
  readonly LINK_REGEX = /\[\[([^[]*)\]\]/

  constructor(props: TopicRendererProps) {
    super(props)

    this.state = {

    }
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  indentTopic = () => {
    let { descendants, selectedTopic } = this.props
    let selectedTopicIndex: number | undefined = undefined
    let siblingAbove: Topic | null = null

    if (selectedTopic) {
      if (selectedTopic.id) {
        const selected = selectedTopic as Topic // Don't know why it complains if I skip this
        descendants = descendants.map((descendant, index) => {
          if (sameTopic(selected, descendant)) {
            selectedTopicIndex = index
          } else if (areSibling(descendant, selected)) {
            if (descendant.position === (selected).position - 1) {
              siblingAbove = descendant
            }
            if (descendant.position > (selected).position) {
              descendant.position -= 1
            }
          }
          return (descendant)
        })

        if (siblingAbove && selectedTopicIndex) {
          const newParent = siblingAbove as Topic

          // Indent subtree too:
          const old_ancestry = new RegExp(`^${selected.ancestry}/${selected.id}`)
          descendants = descendants.map((descendant) => {
            // Replace ancestry of selected's descendants
            if (descendant.ancestry && old_ancestry.test(descendant.ancestry)) {
              descendant.ancestry = descendant.ancestry.replace(old_ancestry, `${selected.ancestry}/${newParent.id}/${selected.id}`)
            }
            return (descendant)
          })

          const children = getChildren(newParent, descendants)
          selectedTopic.ancestry = `${selectedTopic.ancestry}/${(siblingAbove as Topic).id}`
          selectedTopic.position = children.length + 1 // add at the end
          descendants.splice(selectedTopicIndex, 1, selectedTopic)
          this.props.setUserTopicPageState({descendants: descendants, selectedTopic: selectedTopic})
          updateBackendTopic(selectedTopic, this.props.setAppState)
        }
      } else {
        // selectedTopic.id is null -> the topic has been created and we're waiting for the id from the backend
        this.props.setAppState({ alert: {variant: "danger", message: "Sorry, too fast. We're in alpha! It should be ok now."}})
        sleep(3000).then(() => this.props.setAppState({ alert: null }))
      }
    }
  }

  unindentTopic = () => {
    const { currentTopic } = this.props
    let { descendants, selectedTopic } = this.props
    let selectedTopicIndex: number | undefined = undefined

    if (selectedTopic) {
      let selected = selectedTopic as Topic // Don't know why it complains if I skip this
      const parent = getParent(selectedTopic, descendants)
      if (parent && !sameTopic(parent, currentTopic)) {
        descendants = descendants.map((descendant, index) => {
          if (sameTopic(selected, descendant)) {
            selectedTopicIndex = index
          } else if (areSibling(descendant, selected)) {
            if (descendant.position > (selected).position) {
              descendant.position -= 1
            }
          } else if (areSibling(descendant, parent)) {
            if (descendant.position > parent.position) {
              descendant.position += 1
            }
          }
          return (descendant)
        })

        if (selectedTopicIndex) {
          const old_ancestry = new RegExp(`^${selected.ancestry}/${selected.id}`)
          descendants = descendants.map((descendant) => {
            // Unindent subtree too:
            if (descendant.ancestry && old_ancestry.test(descendant.ancestry)) {
              descendant.ancestry = descendant.ancestry.replace(old_ancestry, `${parent.ancestry}/${selected.id}`)
            }
            return (descendant)
          })
          selectedTopic.ancestry = parent.ancestry
          selectedTopic.position = parent.position + 1

          descendants.splice(selectedTopicIndex, 1, selectedTopic)
          this.props.setUserTopicPageState({ descendants: descendants, selectedTopic: selectedTopic })
          updateBackendTopic(selectedTopic, this.props.setAppState)
        }
      }
    }
  }

  moveTopicBelow = () => {
    const { selectedTopic, siblings } = this.props
    let { descendants } = this.props

    if (selectedTopic && siblings.length > selectedTopic.position) {
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
  }

  selectTopicBelow = () => {
    const { selectedTopic, siblings, descendants, currentBlogger, currentUser } = this.props
    const isOwnBlog = currentUser && currentUser.id === currentBlogger.id

    if (selectedTopic && isOwnBlog) {
      const children = getChildren(selectedTopic, descendants)
      let newSelected: Topic | null = null
      if (children.length > 0) {
        newSelected = children[0]
      } else if (siblings.length > selectedTopic.position) {
        newSelected = siblings.filter((sibling) => sibling.position === selectedTopic.position + 1)[0]
      } else {
        newSelected = topicOrAncestorBelow(selectedTopic, descendants)
      }

      if (newSelected) {
        this.props.setUserTopicPageState({ selectedTopic: newSelected })
      }
    }
  }

  selectTopicAbove = () => {
    const { selectedTopic, descendants, currentTopic } = this.props

    if (selectedTopic) {
      const tAbove = topicAbove(selectedTopic, descendants)
      let newSelected: Topic | null = null
      if (tAbove) {
        const lastDesc = lastDescendantOrSelf(tAbove, descendants)
        newSelected = lastDesc ? lastDesc : tAbove
      } else {
        const parent = getParent(selectedTopic, descendants)
        if (parent && !sameTopic(parent as Topic, currentTopic)) {
          newSelected = parent
        }
      }
      if (newSelected) {
        this.props.setUserTopicPageState({ selectedTopic: newSelected })
      }
    }
  }

  moveTopicAbove = () => {
    const { selectedTopic } = this.props
    let { descendants } = this.props

    if (selectedTopic && selectedTopic.position > 1) {
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
  }

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { topic, selectedTopic, isReference } = this.props
    let { descendants } = this.props

    if (selectedTopic) {
      switch (event.key) {
        case "Enter":
          if (isReference) {
            updateBackendTopic(selectedTopic, this.props.setAppState)
            this.props.setUserTopicPageState({ selectedTopic: null })
          } else {
            const newPosition = selectedTopic.position + 1

            descendants = descendants.map((descendant) => {
              if (areSibling(descendant, topic) && descendant.position >= newPosition) {
                descendant.position += 1
              }
              return (descendant)
            })
            const newNonSavedTopic = newTopicWithDescendants({
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
          }
          break
        case "Escape":
          updateBackendTopic(selectedTopic, this.props.setAppState)
          this.props.setUserTopicPageState({ selectedTopic: null })
          break
        case "Tab":
          if (!isReference) {
            event.shiftKey ? this.unindentTopic() : this.indentTopic()
          }
          event.preventDefault()
          break
        case "ArrowDown":
          if (!isReference) {
            if (event.shiftKey && (event.ctrlKey || event.metaKey)) {
              this.moveTopicBelow()
            } else {
              this.selectTopicBelow()
            }
          }
          break
        case "ArrowUp":
          if (!isReference) {
            if (event.shiftKey && (event.ctrlKey || event.metaKey)) {
              this.moveTopicAbove()
            } else {
              this.selectTopicAbove()
            }
          }
          break
        case "Backspace":
          if (!isReference && selectedTopic.content === "") {
            let selectedTopicIndex: number | undefined = undefined
            let siblingAbove: Topic | null = null
            let newSelected: Topic | null = null

            if (getChildren(selectedTopic, descendants).length > 0) {
              // Do nothing when topics have descendants
              return
            }

            descendants = descendants.map((descendant, index) => {
              if (sameTopic(selectedTopic, descendant)) {
                selectedTopicIndex = index
              } else if (areSibling(descendant, selectedTopic)) {
                if (descendant.position === selectedTopic.position - 1) {
                  siblingAbove = descendant
                }
                if (descendant.position > selectedTopic.position) {
                  descendant.position -= 1
                }
              }
              return (descendant)
            })

            if (siblingAbove) {
              const ch = getChildren(siblingAbove, descendants)
              if (ch.length > 0) {
                // Select the last child of the siblingAbove
                newSelected = ch[ch.length - 1]
              } else {
                // Otherwise, select the siblingAbove
                newSelected = siblingAbove
              }
            } else if (selectedTopic.position === 1) {
              // Select parent if this parent is not currentTopic
              const parent = getParent(selectedTopic, descendants)
              const { currentTopic } = this.props
              if (parent && !sameTopic(parent, currentTopic)) {
                newSelected = parent
              } else {
                return // Do nothing when selectedTopic is the only descendant of currentTopic
              }
            }

            if (newSelected && selectedTopicIndex !== undefined) {
              // delete selectedTopic from descendants:
              descendants.splice(selectedTopicIndex, 1)
              deleteBackendTopic(selectedTopic, this.props.setAppState)
              this.props.setUserTopicPageState({ descendants: descendants, selectedTopic: newSelected })
            }
            event.preventDefault()
          }
          break
      }
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
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
    const { currentBlogger } = this.props
    const arr = topic.content.split(this.LINK_REGEX)
    return (
      <>
        {arr.map((element, index) => {
          if (index % 2 === 0) {
            return (<span key={index}>{element}</span>)
          } else {
            const path = `/${currentBlogger.username}/${parameterize(element, 100)}`
            return (
              <Link
                to={path}
                key={index}
                onClick={(event) => {
                  window.location.href = path
                  event.stopPropagation()
                }}
                >{element}</Link>
            )
          }
        })}
      </>
    )
  }

  selectTopic = (topic: Topic, event: React.MouseEvent<HTMLElement>) => {
    const { selectedTopic, currentBlogger, currentUser } = this.props
    const isOwnBlog = currentUser && currentUser.id === currentBlogger.id

    if (event.altKey) {
      window.location.href = `/${currentBlogger.username}/${topic.slug}`
    } else if (isOwnBlog) {
      // Update previously selected topic:
      if (selectedTopic) {
        updateBackendTopic(selectedTopic, this.props.setAppState)
      }

      // Select new topic:
      this.props.setUserTopicPageState({ selectedTopic: topic })
    }
  }

  public render () {
    const { selectedTopic, topic, renderSubtopics, descendants, currentBlogger, currentUser, currentTopic } = this.props
    const isSelected = selectedTopic && (selectedTopic.id === topic.id && selectedTopic.tmp_key === topic.tmp_key)
    const children = getChildren(topic, descendants)

    return (
      <>
        <li key={topicKey(topic)} onClick={(event) => !isSelected && this.selectTopic(topic, event)}>
          {isSelected && this.renderSelectedTopic(topic)}
          {!isSelected && this.renderUnselectedTopic(topic)}
        </li>
        {renderSubtopics && children &&
          <li className="hide-bullet">
            <ul>
              {children.map((subTopic) => (
                <TopicRenderer
                  currentBlogger={currentBlogger}
                  currentUser={currentUser}
                  key={"sub" + topicKey(subTopic)}
                  topic={subTopic}
                  descendants={descendants}
                  siblings={children}
                  currentTopic={currentTopic}
                  renderSubtopics={true}
                  selectedTopic={selectedTopic}
                  setUserTopicPageState={this.props.setUserTopicPageState}
                  setAppState={this.props.setAppState}
                  isReference={this.props.isReference} />
              ))}
            </ul>
          </li>
        }
      </>
    )
  }
}

export default TopicRenderer
