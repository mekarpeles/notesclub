import * as React from 'react';
import { Form, Button } from 'react-bootstrap';

interface IProps {
  text: string
  choices: string[][]
}

interface IState {
  solve: boolean
  content: string[]
  options: string[]
}

class KeyWordTransformationExercise extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const text = this.props.text
    const content = text.split(/\(\d+\)\ \.+/)
    const options = Array(content.length - 1).fill(".......")

    this.state = {
      solve: false,
      content: content,
      options: options
    }
  }

  selectChoice = (index: number, ind: number) => {
    const { options } = this.state
    const { choices }= this.props
    options[index] = choices[index][ind]
    this.setState({ options: options })
  }

  renderChoices = () => {
    const { choices }= this.props
    return (
      <div className="choices">
        <table className="multiple-choice-choices">
          {choices.map((options, index) => {
            return (<tr>{index}:&nbsp;{options.map((word, ind) => {
              return (<td onClick={() => this.selectChoice(index, ind)}>{word}</td>)
            })}</tr>)
          })}
        </table>
      </div>
    );
  }
  renderOption = (index: number) => {
    const { options } = this.state

    return(
      <b>({index}) {options[index]}</b>
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
              {content.map((piece, index) => {
                return(
                  <>{piece}{index < content_length - 1 ? this.renderOption(index) : <></>}</>
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
