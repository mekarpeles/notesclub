import * as React from 'react';
import { Form, Button } from 'react-bootstrap';

interface IProps {
  text: string
  solutions: string[][]
  description: string
  title: string
}

interface IState {
  content: string[]
  gaps: string[]
  solve: boolean
  rightOrWrong: string[]
}

class OpenCloze extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const { text, solutions }= this.props
    const content = text.split(/\(\d+\)\ \.+/)
    const gaps = Array(content.length - 1).fill("")
    gaps[0] = solutions[0].join("/")
    this.state = {
      content: content,
      gaps: gaps,
      solve: false,
      rightOrWrong: Array(content.length - 1).fill("")
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const index = Number(target.name.replace("gap_", ""))
    const { gaps } = this.state
    gaps[index] = target.value
    this.setState({ gaps: gaps })
  }

  renderGap = (row_index: number) => {
    const { gaps, rightOrWrong } = this.state

    return(
      <b className={rightOrWrong[row_index] ? rightOrWrong[row_index] + "-answer" : ""}>({row_index}) {gaps[row_index] || "......"}</b>
    )
  }

  check = () => {
    const { gaps } = this.state
    const { solutions } = this.props

    const rightOrWrong = gaps.map((gap, index) => solutions[index].includes(gaps[index]) ? "right" : "wrong")
    this.setState({ solve: true, rightOrWrong: rightOrWrong })
  }

  render() {
    const { content, gaps, solve, rightOrWrong } = this.state
    const { solutions, description, title } = this.props
    const content_length = content.length
    const all_solutions = solutions.map((solution, index) => solution.join("/"))

    return(
      <div className="exercise container">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-6 ">
            <p><b>{title}</b></p>
            <div className="justify-text open-cloze-core">
              <p className="description">
                {description}
              </p>
              {content.map((piece, row_index) => {
                return (
                  <>
                    {piece}
                    {row_index < content_length - 1 ? this.renderGap(row_index) : <></>}
                  </>
                )
              })}
            </div>
            <Button onClick={this.check}>Check</Button>

          </div>
          <div className="col-lg-4">
            {gaps.map((gap, index) => {
              return(
                <Form.Group className="form-inline">
                  <Form.Label>({index})&nbsp;</Form.Label>
                  <Form.Control
                    type="text"
                    value={gap}
                    name={"gap_" + String(index)}
                    className={solve ? rightOrWrong[index] + "-answer" : ""}
                    onChange={this.handleChange as any} autoFocus />
                  <Form.Label>&nbsp;{solve ? all_solutions[index] : <></>}</Form.Label>
                </Form.Group>
              )
            })}
          </div>
          <div className="col-lg-1"></div>

        </div>
      </div>
    )
  }
}

export default OpenCloze;
