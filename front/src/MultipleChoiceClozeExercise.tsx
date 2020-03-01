import * as React from 'react';
import { Alert, Button } from 'react-bootstrap';

interface IProps {
  text: string
  options: string[][]
  description: string
  solutions: number[]
}

interface IState {
  content: string[]
  choices: number[]
  field_highlighted: number | null
  showAlert: boolean
  solve: boolean
}

class KeyWordTransformationExercise extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const text = this.props.text
    const content = text.split(/\(\d+\)\ \.+/)
    const choices = Array(content.length - 1)
    choices[0] = 2

    this.state = {
      content: content,
      choices: choices,
      field_highlighted: null,
      showAlert: false,
      solve: false
    }
  }

  selectOption = (index: number, ind: number) => {
    const { choices } = this.state
    const { options }= this.props
    if(index != 0){
      choices[index] = ind
      this.setState({ choices: choices, field_highlighted: index, showAlert: false })
    }else{
      this.setState({ showAlert: true })
    }
  }

  renderOption = (index: number, ind: number, word: string) => {
    const { choices } = this.state

    return (
      <td onClick={() => this.selectOption(index, ind)}>
        {choices[index] === ind ? <b>{word}</b> : word}
      </td>
    )
  }

  renderOptions = () => {
    const { options } = this.props
    const { field_highlighted, showAlert } = this.state

    return (
      <div className="multiple-choice-options">
        {showAlert ? <Alert variant="danger">The first line (0) is an example!</Alert> : <></>}
        <table>
          {options.map((line_options, index) => {
            return (
              <tr className={field_highlighted == index ? 'multiple-choice-choice' : ''}>
                {index}:&nbsp;{line_options.map((word, ind) => {
                  return(this.renderOption(index, ind, word))
                })}
              </tr>
            )
          })}
        </table>
      </div>
    );
  }

  mouseOver = (row_index: number) => {
    this.setState({ field_highlighted: row_index })
  }

  renderChoice = (row_index: number) => {
    const { choices, field_highlighted, solve } = this.state
    const { options, solutions } = this.props
    const c = choices.map((choice_index) => {
      return(options[row_index][choice_index])
    })

    let classN = ""
    if (field_highlighted == row_index){ classN = "multiple-choice-choice" }
    if (solve){
      if(choices[row_index] === solutions[row_index]){
        classN = classN + " right-answer"
      }else{
        classN = classN + " wrong-answer"
      }
    }

    return(
      <b className={classN} onMouseEnter={() => this.mouseOver(row_index)}>({row_index}) {c[row_index] || "......"}</b>
    )
  }

  check = () => {
    this.setState({ solve: true, field_highlighted: null })
  }

  public render() {
    const { content } = this.state
    const { description } = this.props
    const content_length = content.length

    return (
      <div className="exercise container">
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <p><b>Multiple Choice Cloze</b></p>
            <p className="description">
              {description}
            </p>
            <div className="multiple-choice-text">
              {content.map((piece, row_index) => {
                return(
                  <>{piece}{row_index < content_length - 1 ? this.renderChoice(row_index) : <></>}</>
                )
              })}
            </div>
            {this.renderOptions()}
            <Button onClick={this.check}>Check</Button>
          </div>
          <div className="col-lg-3"></div>
        </div>
      </div>
    );
  }
}

export default KeyWordTransformationExercise;
