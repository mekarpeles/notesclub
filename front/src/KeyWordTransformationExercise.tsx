import * as React from 'react';
import { Form, Button } from 'react-bootstrap';

interface IProps {
  originalSentence: string
  word: string
  part1: string
  part2: string
  solutions: string[]
  description: string
  title: string
}

interface IState {
  answer: string
  rightOrWrong: string
  solve: boolean
}

class KeyWordTransformationExercise extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      answer: "",
      solve: false,
      rightOrWrong: ""
    }
  }

  check = () => {
    const { answer } = this.state
    const { solutions } = this.props
    let rightOrWrong = "wrong"

    for(let i = 0; i < solutions.length; i++){
      if(answer === solutions[i]){
        rightOrWrong = "right"
        break
      }
    }

    this.setState({ solve: true, rightOrWrong: rightOrWrong })
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value

    this.setState({ answer: value })
  }

  renderSolutions = () => {
    const solutions = this.props.solutions
    return(
      <div className="solution">
        <b>{solutions.length === 1 ? "Solution:" : "Solutions:"}</b>
        {solutions.map((solution) => <p>{solution}</p>)}
      </div>
    )
  }

  public render() {
    const { answer, solve, rightOrWrong } = this.state
    const { originalSentence, word, part1, part2, description, title } = this.props

    return (
      <div className="exercise container">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-6">
            <div className="justify-text">
              <p><b>{title}</b></p>
              <p className="description">
                {description}
              </p>
            </div>
            <div className="exercise-core">
              <p>{originalSentence}</p>
              <p><b>{word}</b></p>
              <Form.Group className="form-inline">
                <Form.Label>{part1}&nbsp;</Form.Label>
                <Form.Control
                  type="text"
                  value={answer}
                  name="answer"
                  className={rightOrWrong + "-answer"}
                  onChange={this.handleChange as any} autoFocus/>
                <Form.Label>&nbsp;{part2}</Form.Label>
              </Form.Group>
              <Button onClick={this.check}>Check</Button>
              <div>
                {solve ? this.renderSolutions() : <></>}
              </div>
            </div>
          </div>
          <div className="col-lg-5"></div>
        </div>
      </div>
    );
  }
}

export default KeyWordTransformationExercise;
