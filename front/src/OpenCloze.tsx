import * as React from 'react';
import { Form, Button } from 'react-bootstrap';

interface IProps {
  text: string
}

interface IState {
  content: string[]
  gaps: string[]
}

class OpenCloze extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const text = this.props.text
    const content = text.split(/\(\d+\)\ \.+/)
    this.state = {
      content: content,
      gaps: Array(content.length).fill("")
    }
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target
    const index = Number(target.name.replace("gap_", ""))
    const gaps = this.state.gaps
    gaps[index] = target.value
    this.setState({ gaps: gaps })
  }

  renderGap(row_index: number) {
    const gaps = this.state.gaps
    return(
      <b>({row_index}) {gaps[row_index] || "......"}</b>
    )
  }

  render() {
    const { content, gaps } = this.state
    const content_length = content.length

    return(
      <div className="exercise container">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-6 ">
            <div className="justify-text">
                {content.map((piece, row_index) => {
                  return (
                    <>
                      {piece}
                      {row_index < content_length - 1 ? this.renderGap(row_index) : <></>}
                    </>
                  )
                })}
            </div>
          </div>
          <div className="col-lg-4">
            {gaps.map((gap, index) => {
              return(
                <Form.Group className="form-inline">
                  <Form.Label>({index})</Form.Label>
                  <Form.Control
                    type="text"
                    value={gaps[index]}
                    name={"gap_" + String(index)}
                    onChange={this.handleChange as any} autoFocus />
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
