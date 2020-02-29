import * as React from 'react';
import { Form, Button } from 'react-bootstrap';

interface IProps {
  text: string
  choices: string[][]
}

interface IState {
  solve: boolean
}

class KeyWordTransformationExercise extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      solve: false,
    }
  }

  renderChoices = () => {
    const { choices }= this.props
    return (
      <div className="choices">
        <table className="multiple-choice-choices">
          {choices.map((options, index) => {
            return (<tr>{index}:&nbsp;{options.map((word) => {
              return (<td>{word}</td>)
            })}</tr>)
          })}
        </table>
      </div>
    );
  }
  public render() {
    const { text, choices } = this.props
    return (
      <div className="exercise container">
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <div className="multiple-choice-text">
              {text}
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
