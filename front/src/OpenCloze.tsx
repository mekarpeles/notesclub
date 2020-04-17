import * as React from 'react';
import { Alert, Form, Button, InputGroup } from 'react-bootstrap';

interface IProps {
  title: string
  description: string
  text: string
  solutions: string[][]
}

interface IState {
  content: string[]
  gaps: string[]
  solve: boolean
  rightOrWrong: string[]
  error: string | null
}

class OpenCloze extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const { text, solutions }= this.props
    const content = text.split(/\(\d+\)\ \.+/)
    const gaps = Array(content.length - 1).fill("")
    this.state = {
      content: content,
      gaps: gaps,
      solve: false,
      rightOrWrong: Array(content.length - 1).fill(""),
      error: null
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.text !== this.props.text || prevProps.solutions !== this.props.solutions) {
      const { text } = this.props
      const content = text.split(/\(\d+\)\ \.+/)
      const gaps = Array(content.length - 1).fill("")
      this.setState({
        content: content,
        gaps: gaps,
        solve: false,
        rightOrWrong: Array(content.length - 1).fill(""),
        error: null
      })
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { solve, gaps } = this.state
    if(solve) {
      this.setState({ error: "The exercise has ended." })
    }else{
      const target = event.target
      const index = Number(target.name.replace("gap_", ""))
      gaps[index - 1] = target.value
      this.setState({ gaps: gaps })
    }
  }

  closeError = () => {
    this.setState({ error: null })
  }

  renderGap = (row_index: number) => {
    const { gaps, rightOrWrong } = this.state

    return(
      <b className={rightOrWrong[row_index] ? rightOrWrong[row_index] + "-answer" : ""}>({row_index + 1}) {gaps[row_index] || "......"}</b>
    )
  }

  check = () => {
    const { gaps } = this.state
    const { solutions } = this.props

    const rightOrWrong = gaps.map((gap, index) => solutions[index].includes(gaps[index]) ? "right" : "wrong")
    this.setState({ solve: true, rightOrWrong: rightOrWrong })
  }

  render() {
    const { content, gaps, solve, rightOrWrong, error } = this.state
    const { solutions, description, title } = this.props
    const content_length = content.length
    const all_solutions = solutions.map((solution, index) => solution.join(" | "))

    return(
      <div className="exercise container">
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <div className="justify-text open-cloze-core">
              <p><b>{title}</b></p>
              <p className="description">
                {description}
              </p>
              {error ? <Alert variant="danger" onClose={() => this.closeError()} dismissible>{error}</Alert> : <></>}
              {content.map((piece, row_index) => {
                return (
                  <>
                    {piece}
                    {row_index < content_length - 1 ? this.renderGap(row_index) : <></>}
                  </>
                )
              })}
            </div>

            {solve && gaps.length > 0 &&
              <div className="open-cloze-solutions-txt">
                <b>
                  {gaps.length == 1 ? "Solution:" : "Solutions:"}
                </b>
              </div>
            }

            {gaps.map((gap, index) => {
              return(
                <Form.Group>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1">({index + 1})</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      value={gap}
                      name={"gap_" + String(index + 1)}
                      className={solve ? rightOrWrong[index] + "-answer" : ""}
                      onChange={this.handleChange as any} />
                    <Form.Label>&nbsp;{solve ? all_solutions[index] : <></>}</Form.Label>
                  </InputGroup>
                </Form.Group>
              )
            })}
            <div className="check">
              <Button onClick={this.check}>Check</Button>
            </div>
          </div>
          <div className="col-lg-3" />
        </div>
      </div>
    )
  }
}

export default OpenCloze;
