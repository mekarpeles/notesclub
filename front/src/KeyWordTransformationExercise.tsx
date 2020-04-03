import * as React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

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
  error?: string
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

    if(!this.state.solve) {
      this.setState({ answer: value })
    }else{
      this.setState({ error: "The exercise has ended." })
    }
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

  closeError = () => {
    this.setState({ error: undefined })
  }

  public render() {
    const { answer, solve, rightOrWrong, error } = this.state
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
            {error ? <Alert variant="danger" onClose={() => this.closeError()} dismissible>{error}</Alert> : <></>}
            <div className="exercise-core">
              <p>{originalSentence}</p>
              <p><b>{word}</b></p>
              <Form.Group>
                <Form.Label>{part1} ......... {part2}</Form.Label>
                <Form.Control
                  type="text"
                  value={answer}
                  name="answer"
                  className={rightOrWrong + "-answer"}
                  onChange={this.handleChange as any} />
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
