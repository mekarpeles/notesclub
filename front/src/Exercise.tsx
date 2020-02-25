import * as React from 'react';
import { Form, Button } from 'react-bootstrap';

interface IProps {
  originalSentence: string
  word: string
  part1: string
  part2: string
  solutions: string[]
}

interface IState {
  answer: string
  solve: boolean
  correctOrWrong: string
}

class Exerciser extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      answer: "",
      solve: false,
      correctOrWrong: ""
    }
  }

  check = () => {
    const { answer } = this.state
    const { solutions } = this.props
    let correctOrWrong = "wrong"

    for(let i = 0; i < solutions.length; i++){
      if(answer == solutions[i]){
        correctOrWrong = "correct"
        break
      }
    }

    this.setState({ solve: true, correctOrWrong: correctOrWrong })
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
        <b>{solutions.length == 1 ? "Solution:" : "Solutions:"}</b>
        {solutions.map((solution) => <p>{solution}</p>)}
      </div>
    )
  }
  public render() {
    const { answer, solve, correctOrWrong } = this.state
    const { originalSentence, word, part1, part2 } = this.props

    return (
      <div>
        <p>{originalSentence}</p>
        <p><b>{word}</b></p>
        <Form.Group className="form-inline exercise">
          <Form.Label>{part1}</Form.Label>
          <Form.Control
            type="text"
            value={answer}
            name="answer"
            className={correctOrWrong + "-answer"}
            onChange={this.handleChange as any} autoFocus/>
          <Form.Label>to the cinema.</Form.Label>
        </Form.Group>
        <Button onClick={this.check}>Check</Button>
        <div>
          {solve ? this.renderSolutions() : <></>}
        </div>
      </div>
    );
  }
}

export default Exerciser;
