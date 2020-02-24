import * as React from 'react';
import { Form, Button } from 'react-bootstrap';

interface IProps {
}

interface IState {
  answer: string;
}

class Exercise extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      answer: ""
    }
  }

  check = () => {
    this.setState({answer: "a good idea to go"})
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value

    this.setState({ answer: value })
  }

  public render() {
    const answer = this.state.answer

    return (
      <div>
        <p>I was in favour of going to the cinema.</p>
        <p><b>IDEA</b></p>
        <Form.Group className="form-inline exercise">
          <Form.Label>I thought it would be</Form.Label>
          <Form.Control
            type="text"
            value={answer}
            name="answer"
            onChange={this.handleChange as any} />
          <Form.Label>to the cinema.</Form.Label>
        </Form.Group>
        <Button onClick={this.check}>Check</Button>
      </div>
    );
  }
}

export default Exercise;
