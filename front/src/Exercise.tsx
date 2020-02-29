import * as React from 'react';
import { Form, Button } from 'react-bootstrap';

interface IProps {
  type: string
  originalSentence: string
  word: string
  part1: string
  part2: string
  solutions: string[]
  instructions: string
}

interface IState {
  answer: string
  correctOrWrong: string
  solve: boolean
}

class Exercise extends React.Component<IProps, IState> {
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
      if(answer === solutions[i]){
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
        <b>{solutions.length === 1 ? "Solution:" : "Solutions:"}</b>
        {solutions.map((solution) => <p>{solution}</p>)}
      </div>
    )
  }

  renderInstructions = () => {
    const instructions = this.props.instructions
    return (
      <div>
        {instructions}
      </div>
    )
  }

  public render() {
    const { answer, solve, correctOrWrong } = this.state
    const { originalSentence, word, part1, part2, instructions, type } = this.props

    return (
      <div className="exercise container">
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <div>
              <p>
                <b>{type}</b>
              </p>
              <p>
                {instructions}
              </p>
            </div>
            <div className="exercise-core">
              <p>{originalSentence}</p>
              <p><b>{word}</b></p>
              <Form.Group className="form-inline sentence-to-complete">
                <Form.Label>{part1}&nbsp;</Form.Label>
                <Form.Control
                  type="text"
                  value={answer}
                  name="answer"
                  className={correctOrWrong + "-answer"}
                  onChange={this.handleChange as any} autoFocus/>
                <Form.Label>&nbsp;{part2}</Form.Label>
              </Form.Group>
              <Button onClick={this.check}>Check</Button>
              <div>
                {solve ? this.renderSolutions() : <></>}
              </div>
            </div>
          </div>
          <div className="col-lg-3"></div>
        </div>
      </div>
    );
  }
}

export default Exercise;
