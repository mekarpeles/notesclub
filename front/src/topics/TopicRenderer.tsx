import * as React from 'react'
import { Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Topic, topicKey, newTopic, sameTopic, topicOrAncestorBelow, topicAbove, lastDescendantOrSelf } from './Topic'
import { createBackendTopic, updateBackendTopic, deleteBackendTopic } from './../backendSync'
import { getChildren, areSibling, getParent } from './ancestry'
import { parameterize } from './../utils/parameterize'

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

  indentTopic = () => {
    let { descendants, selectedTopic } = this.props
    let selectedTopicIndex: number | undefined = undefined
    let siblingAbove: Topic | null = null

    if (selectedTopic) {
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
    }
  }

  unindentTopic = () => {
    const { currentTopic } = this.props
    let { descendants, selectedTopic } = this.props
    let selectedTopicIndex: number | undefined = undefined
    let siblingAbove: Topic | null = null

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
              console.log(`replacing ancestry ${old_ancestry} with ${parent.ancestry}/${selected.id}`)
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
    const { selectedTopic, siblings, descendants } = this.props
    if (selectedTopic) {
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
        if (parent != currentTopic) {
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
    const { topic, selectedTopic, siblings } = this.props
    let { descendants } = this.props

    if (selectedTopic) {
      switch (event.key) {
        case "Enter":
          const newPosition = selectedTopic.position + 1

          descendants = descendants.map((descendant) => {
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
        case "Tab":
          event.shiftKey ? this.unindentTopic() : this.indentTopic()
          event.preventDefault()
          break
        case "ArrowDown":
          if (event.shiftKey && (event.ctrlKey || event.metaKey)) {
            this.moveTopicBelow()
          } else {
            this.selectTopicBelow()
          }
          break
        case "ArrowUp":
          if (event.shiftKey && (event.ctrlKey || event.metaKey)) {
            this.moveTopicAbove()
          } else {
            this.selectTopicAbove()
          }
          break
        case "Backspace":
          if (selectedTopic.content === "") {
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

            if (newSelected && selectedTopicIndex != undefined) {
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
    const arr = topic.content.split(/\[\[([^\[]*)\]\]/)
    return (
      <>
        {arr.map((element, index) => {
          if (index % 2 === 0) {
            return (<span>{element}</span>)
          } else {
            const path = `/hec/${parameterize(element, 100)}`
            return (<Link to={path} onClick={(event) => {
              window.location.href = path
              event.stopPropagation()
            }}>{element}</Link>)
          }
        })}
      </>
    )
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
          {!isSelected && this.renderUnselectedTopic(topic)}
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
