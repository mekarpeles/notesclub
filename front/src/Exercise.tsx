import * as React from 'react';

interface IProps {
}

interface IState {
  answer: string;
}

class Exercise extends React.Component<IProps, IState> {
  check() {

  }
  public render() {
    return (
      <div>
        <p>I was in favour of going to the cinema.</p>
        <p><b>IDEA</b></p>
        <p>I thought it would be ... to the cinema.</p>
        <button onClick={this.check}>Check</button>
      </div>
    );
  }
}

export default Exercise;
