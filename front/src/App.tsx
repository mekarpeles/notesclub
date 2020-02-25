import * as React from 'react';
import './App.css';
import Exercise from './Exercise';
import Header from './Header';

class App extends React.Component {
  public render() {
    const solutions = ["a good idea to go"]
    return (
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        <Exercise originalSentence="I was in favour of going to the cinema." word="IDEA" part1="I thought it would be" part2="to the cinema." solutions={solutions} />
      </div>

    );
  }
}

export default App;
