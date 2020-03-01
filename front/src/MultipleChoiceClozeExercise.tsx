import * as React from 'react';
import { Form, Button } from 'react-bootstrap';

interface IProps {
  text: string
  options: string[][]
}

interface IState {
  content: string[]
  choices: number[]
  field_highlighted: number | null
}

class KeyWordTransformationExercise extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const text = this.props.text
    const content = text.split(/\(\d+\)\ \.+/)
    const choices = Array(content.length - 1)

    this.state = {
      content: content,
      choices: choices,
      field_highlighted: null
    }
  }

  selectOption = (index: number, ind: number) => {
    const { choices } = this.state
    const { options }= this.props
    choices[index] = ind
    this.setState({ choices: choices, field_highlighted: index })
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
    const { field_highlighted } = this.state

    return (
      <div className="options">
        <table className="multiple-option-options">
          {options.map((line_options, index) => {
            return (
              <tr className={field_highlighted == index ? 'multiple-option-choice' : ''}>
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
    const { choices, field_highlighted } = this.state
    const { options } = this.props
    const c = choices.map((choice_index) => {
      return(options[row_index][choice_index])
    })

    return(
      <b className={field_highlighted == row_index ? 'multiple-option-choice' : ''} onMouseEnter={() => this.mouseOver(row_index)}>({row_index}) {c[row_index] || "......"}</b>
    )
  }

  public render() {
    const { content } = this.state
    const content_length = content.length

    return (
      <div className="exercise container">
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <div className="multiple-option-text">
              {content.map((piece, row_index) => {
                return(
                  <>{piece}{row_index < content_length - 1 ? this.renderChoice(row_index) : <></>}</>
                )
              })}
            </div>

            {this.renderOptions()}

          </div>
          <div className="col-lg-3"></div>
        </div>
      </div>
    );
  }
}

export default KeyWordTransformationExercise;
