import * as React from 'react'
import { Topic, Reference, newTopicWithDescendants, topicKey, newTopic } from './Topic'
import TopicRenderer from './TopicRenderer'
import { User } from './../User'
import { fetchBackendUser, fetchBackendTopics, fetchBackendReferences, createBackendTopic } from './../backendSync'
import { getChildren } from './ancestry'
import { Link } from 'react-router-dom'
import ReferenceRenderer from './ReferenceRenderer'

interface UserTopicPageProps {
  setAppState: Function
  currentUser?: User
  currentTopicKey: string
  currentBlogUsername: string
}

interface UserTopicPageState {
  currentBlogger?: User
  currentTopic?: Topic
  selectedTopic: Topic | null
  descendants?: Topic[]
  ancestors?: Topic[]
  references?: Reference[]
}

class UserTopicPage extends React.Component<UserTopicPageProps, UserTopicPageState> {
  constructor(props: UserTopicPageProps) {
    super(props)

    this.state = {
      selectedTopic: null
    }
  }

  componentDidMount() {
    const { currentBlogger } = this.state

    if(!currentBlogger) {
      this.fetchBloggerAndCurrentTopic()
    }
  }

  fetchBloggerAndCurrentTopic = () => {
    const { currentBlogUsername, currentUser, currentTopicKey } = this.props

    fetchBackendUser(currentBlogUsername)
      .then(blogger => {
        this.setState({ currentBlogger: blogger})
        if (blogger) {
          fetchBackendTopics({ slug: currentTopicKey, user_ids: [blogger.id], include_descendants: true, include_ancestors: true }, this.props.setAppState)
            .then(fetchBackendTopicsAndDescendants => {
              if (fetchBackendTopicsAndDescendants.length === 0) {
                // Create topic
                if (currentUser) {
                  const newNonSavedTopic = newTopic({
                    slug: currentTopicKey,
                    user_id: currentUser.id,
                    ancestry: null,
                    position: -1 // We'll replace this with null before sending it to the backend so it adds it to the end
                  })
                  createBackendTopic(newNonSavedTopic, this.props.setAppState)
                    .then(topic => {
                      this.setState({currentTopic: topic, descendants: []})
                      this.createEmptyTopicIfNoDescendants()
                      this.setReferences()
                    })
                }
              } else {
                // Topic already exists
                const topicAndFamily = fetchBackendTopicsAndDescendants[0]
                this.setState({currentTopic: topicAndFamily})
                if (topicAndFamily.descendants) {
                  this.setState({ descendants: topicAndFamily.descendants})
                  if (topicAndFamily.descendants.length === 1) {
                    this.setState({ selectedTopic: topicAndFamily.descendants[0] })
                  }
                }
                if (topicAndFamily.ancestors) {
                  this.setState({ ancestors: topicAndFamily.ancestors })
                }
                this.createEmptyTopicIfNoDescendants()
                this.setReferences()
              }
            })
        }
      })
  }

  setReferences = () => {
    const { currentTopic } = this.state
    const { currentUser } = this.props

    if (currentTopic && currentUser) {
      fetchBackendReferences({ reference: currentTopic.content }, this.props.setAppState)
        .then(references => {
          this.setState(
            {
              references: references.
                filter((t) => t.id != currentTopic.id).
                sort((a, b) => a.user_id === currentTopic.user_id ? -1 : 1).
                sort((a, b) => a.user_id === currentUser.id ? -1 : 1)})
            }
          )
    }
  }

  updateState = (partialState: Partial<UserTopicPageState>) => {
    const newState: UserTopicPageState = { ...this.state, ...partialState };
    this.setState(newState);
  }

  createEmptyTopicIfNoDescendants = (): void => {
    const { currentTopic, descendants } = this.state
    const { currentUser } = this.props

    if (currentUser && currentTopic && descendants && descendants.length === 0) {
      const newNonSavedTopic = newTopicWithDescendants({
        position: 1,
        user_id: currentUser.id,
        ancestry: currentTopic.ancestry ? `${currentTopic.ancestry}/${currentTopic.id}` : String(currentTopic.id)
      })
      descendants.push(newNonSavedTopic)
      this.setState({ selectedTopic: newNonSavedTopic, descendants: descendants })
      createBackendTopic(newNonSavedTopic, this.props.setAppState)
        .then(topicWithId => {
          const selected = this.state.selectedTopic
          this.setState({
            descendants: descendants.map((d) => d.tmp_key === topicWithId.tmp_key ? topicWithId : d),
            selectedTopic: selected && selected.tmp_key === topicWithId.tmp_key ? topicWithId : selected
          })
        })
    }
  }

  public render () {
    const { currentBlogger, currentTopic, selectedTopic, descendants, ancestors, references } = this.state
    const { currentBlogUsername } = this.props
    const children = currentTopic && descendants ? getChildren(currentTopic, descendants) : undefined

    const ancestor_count = ancestors ? ancestors.length : 0
    return (
      <>
        <div className="container">
          { currentBlogger && !currentTopic &&
          <h1><a href={`/${currentBlogger.username}`}>{currentBlogger.name}</a></h1>
          }
          {!currentBlogger || !currentTopic || !children || !descendants &&
            <p>Loading</p>
          }
          {currentBlogger && currentTopic && children && descendants && ancestors &&
            <>
              {ancestor_count > 0 &&
                <p>
                  {ancestors.map((ancestor, index) => {
                    const path = `/${currentBlogger.username}/${ancestor.slug}`
                    return (
                      <span>
                        <Link
                          to={path}
                          onClick={(event) => {
                            window.location.href = path
                          }}
                        >{ancestor.content}</Link>
                        {(index < ancestor_count - 1) && " > "}
                      </span>
                    )
                  })}
                </p>
              }
              <h1><a href={`/${currentBlogger.username}`}>{currentBlogger.name}</a> · {currentTopic.content}</h1>
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
                    setUserTopicPageState={this.updateState}
                    setAppState={this.props.setAppState} />
                ))}
              </ul>
              {references && references.length > 0 &&
                <>
                  References:
                  <ul>
                    {references.map((ref) => (
                      <ReferenceRenderer
                        key={ref.id}
                        topic={ref}
                        selectedTopic={selectedTopic}
                        setUserTopicPageState={this.updateState}
                        setAppState={this.props.setAppState} />
                    ))}
                  </ul>
                </>
              }
            </>
          }
        </div>
      </>
    )
  }
}

export default UserTopicPage
