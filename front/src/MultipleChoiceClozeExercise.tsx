import * as React from 'react';
import { Form, Button } from 'react-bootstrap';

interface IProps {
  text: string
  choices: string[][]
}

interface IState {
  solve: boolean
  content: string[]
  options: number[]
  choice_highlighted: number | null
}

class KeyWordTransformationExercise extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const text = this.props.text
    const content = text.split(/\(\d+\)\ \.+/)
    const options = Array(content.length - 1)

    this.state = {
      solve: false,
      content: content,
      options: options,
      choice_highlighted: null
    }
  }

  selectChoice = (index: number, ind: number) => {
    const { options } = this.state
    const { choices }= this.props
    options[index] = ind
    this.setState({ options: options, choice_highlighted: index })
  }

  renderChoice = (index: number, ind: number, word: string) => {
    const { options } = this.state

    return (
      <td onClick={() => this.selectChoice(index, ind)}>
        {options[index] === ind ? <b>{word}</b> : word}
      </td>
    )
  }

  renderChoices = () => {
    const { choices } = this.props
    const { choice_highlighted } = this.state

    return (
      <div className="choices">
        <table className="multiple-choice-choices">
          {choices.map((line_choices, index) => {
            return (
              <tr className={choice_highlighted == index ? 'multiple-choice-option' : ''}>
                {index}:&nbsp;{line_choices.map((word, ind) => {
                  return(this.renderChoice(index, ind, word))
                })}
              </tr>
            )
          })}
        </table>
      </div>
    );
  }

  mouseOver = (row_index: number) => {
    this.setState({ choice_highlighted: row_index })
  }

  renderOption = (row_index: number) => {
    const { options, choice_highlighted } = this.state
    const { choices } = this.props
    const c = options.map((option_index) => {
      return(choices[row_index][option_index])
    })

    return(
      <b className={choice_highlighted == row_index ? 'multiple-choice-option' : ''} onMouseEnter={() => this.mouseOver(row_index)}>({row_index}) {c[row_index] || "......"}</b>
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
            <div className="multiple-choice-text">
              {content.map((piece, row_index) => {
                return(
                  <>{piece}{row_index < content_length - 1 ? this.renderOption(row_index) : <></>}</>
                )
              })}
            </div>

            {this.renderChoices()}

          </div>
          <div className="col-lg-3"></div>
        </div>
      </div>
    );
  }
}

export default KeyWordTransformationExercise;
